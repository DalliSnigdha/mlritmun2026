import { db, newId } from "./db";

export type Delegate = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  institution: string | null;
  committee: string | null;
  source: string;
  gender: string | null;
  needsRoom: boolean;
  notes: string | null;
  roomId: string | null;
  roomLabel: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DelegateInput = {
  fullName: string;
  email?: string;
  phone?: string;
  institution?: string;
  committee?: string;
  source?: string;
  gender?: string;
  needsRoom?: boolean;
  notes?: string;
};

export type DelegateFilter = {
  search?: string;
  assigned?: "all" | "assigned" | "unassigned";
  needsRoomOnly?: boolean;
};

type DelegateRow = Omit<Delegate, "needsRoom"> & { needsRoom: number };

const SELECT_DELEGATES = `
  SELECT
    d.id, d.full_name AS fullName, d.email, d.phone, d.institution, d.committee,
    d.source, d.gender, d.needs_room AS needsRoom, d.notes, d.room_id AS roomId,
    d.created_at AS createdAt, d.updated_at AS updatedAt,
    CASE WHEN r.id IS NOT NULL THEN r.block || '-' || r.number ELSE NULL END AS roomLabel
  FROM delegates d
  LEFT JOIN rooms r ON r.id = d.room_id
`;

function toDelegate(row: DelegateRow): Delegate {
  return { ...row, needsRoom: Boolean(row.needsRoom) };
}

export function listDelegates(filter: DelegateFilter = {}): Delegate[] {
  const clauses: string[] = [];
  const params: string[] = [];

  if (filter.needsRoomOnly) clauses.push("d.needs_room = 1");
  if (filter.assigned === "assigned") clauses.push("d.room_id IS NOT NULL");
  if (filter.assigned === "unassigned") clauses.push("d.room_id IS NULL");
  if (filter.search) {
    clauses.push("(d.full_name LIKE ? OR d.email LIKE ? OR d.institution LIKE ?)");
    const needle = `%${filter.search}%`;
    params.push(needle, needle, needle);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`${SELECT_DELEGATES} ${where} ORDER BY d.full_name`)
    .all(...params) as unknown as DelegateRow[];
  return rows.map(toDelegate);
}

export function getDelegate(id: string): Delegate | undefined {
  const row = db.prepare(`${SELECT_DELEGATES} WHERE d.id = ?`).get(id) as
    | DelegateRow
    | undefined;
  return row ? toDelegate(row) : undefined;
}

export function createDelegate(input: DelegateInput): string {
  const id = newId();
  db.prepare(
    `INSERT INTO delegates
       (id, full_name, email, phone, institution, committee, source, gender, needs_room, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.fullName,
    input.email || null,
    input.phone || null,
    input.institution || null,
    input.committee || null,
    input.source || "priority",
    input.gender || null,
    input.needsRoom === false ? 0 : 1,
    input.notes || null,
  );
  return id;
}

/** Bulk-insert from a CSV import, in one transaction. */
export function bulkCreateDelegates(inputs: DelegateInput[]): number {
  const insert = db.prepare(
    `INSERT INTO delegates
       (id, full_name, email, phone, institution, committee, source, gender, needs_room, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  db.exec("BEGIN");
  try {
    for (const input of inputs) {
      insert.run(
        newId(),
        input.fullName,
        input.email || null,
        input.phone || null,
        input.institution || null,
        input.committee || null,
        input.source || "priority",
        input.gender || null,
        input.needsRoom === false ? 0 : 1,
        input.notes || null,
      );
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return inputs.length;
}

export function updateDelegate(id: string, input: DelegateInput): void {
  db.prepare(
    `UPDATE delegates SET
       full_name = ?, email = ?, phone = ?, institution = ?, committee = ?,
       source = ?, gender = ?, needs_room = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    input.fullName,
    input.email || null,
    input.phone || null,
    input.institution || null,
    input.committee || null,
    input.source || "priority",
    input.gender || null,
    input.needsRoom === false ? 0 : 1,
    input.notes || null,
    id,
  );
}

export function assignRoom(delegateId: string, roomId: string | null): void {
  db.prepare(`UPDATE delegates SET room_id = ?, updated_at = datetime('now') WHERE id = ?`).run(
    roomId,
    delegateId,
  );
}

export function deleteDelegate(id: string): void {
  db.prepare(`DELETE FROM delegates WHERE id = ?`).run(id);
}

/** Fills every room with remaining capacity from the unassigned queue,
 *  respecting a room's gender restriction when both sides state one.
 *  Delegates are placed in `full_name` order, one room at a time. */
export function autoAssign(): { assigned: number; remaining: number } {
  const rooms = db
    .prepare(
      `SELECT r.id, r.gender, r.capacity - (SELECT COUNT(*) FROM delegates d WHERE d.room_id = r.id) AS free
       FROM rooms r
       ORDER BY r.block, r.number`,
    )
    .all() as { id: string; gender: string; free: number }[];

  const unassigned = db
    .prepare(
      `SELECT id, gender FROM delegates WHERE needs_room = 1 AND room_id IS NULL ORDER BY full_name`,
    )
    .all() as { id: string; gender: string | null }[];

  const update = db.prepare(
    `UPDATE delegates SET room_id = ?, updated_at = datetime('now') WHERE id = ?`,
  );

  let assigned = 0;
  db.exec("BEGIN");
  try {
    for (const delegate of unassigned) {
      // Rooms store a fixed lowercase enum ("male" | "female" | "any"), but
      // a delegate's gender comes from free-text CSV data ("Female", "F",
      // whatever the form asked) — compare case-insensitively so a genuine
      // match doesn't fall through over capitalization alone.
      const delegateGender = delegate.gender?.trim().toLowerCase();
      const room = rooms.find(
        (r) => r.free > 0 && (r.gender === "any" || !delegateGender || r.gender === delegateGender),
      );
      if (!room) continue;
      update.run(room.id, delegate.id);
      room.free -= 1;
      assigned += 1;
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  return { assigned, remaining: unassigned.length - assigned };
}
