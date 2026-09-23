import { db, newId } from "./db";

export type RoomGender = "any" | "male" | "female";

export type Room = {
  id: string;
  block: string;
  number: string;
  capacity: number;
  gender: RoomGender;
  notes: string | null;
  createdAt: string;
  /** How many delegates currently sit in this room. */
  occupied: number;
};

export type RoomInput = {
  block: string;
  number: string;
  capacity: number;
  gender: RoomGender;
  notes: string;
};

const SELECT_ROOMS_WITH_OCCUPANCY = `
  SELECT
    r.id, r.block, r.number, r.capacity, r.gender, r.notes, r.created_at AS createdAt,
    (SELECT COUNT(*) FROM delegates d WHERE d.room_id = r.id) AS occupied
  FROM rooms r
`;

// node:sqlite returns null-prototype row objects, which React refuses to
// pass from a Server Component to a Client Component ("Classes or null
// prototypes are not supported") — spreading each row into a plain object
// literal fixes that.
function toRoom(row: Room): Room {
  return { ...row };
}

export function listRooms(): Room[] {
  const rows = db
    .prepare(`${SELECT_ROOMS_WITH_OCCUPANCY} ORDER BY r.block, r.number`)
    .all() as unknown as Room[];
  return rows.map(toRoom);
}

export function getRoom(id: string): Room | undefined {
  const row = db.prepare(`${SELECT_ROOMS_WITH_OCCUPANCY} WHERE r.id = ?`).get(id) as
    | Room
    | undefined;
  return row ? toRoom(row) : undefined;
}

export function createRoom(input: RoomInput): string {
  const id = newId();
  db.prepare(
    `INSERT INTO rooms (id, block, number, capacity, gender, notes) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, input.block, input.number, input.capacity, input.gender, input.notes || null);
  return id;
}

export function updateRoom(id: string, input: RoomInput): void {
  db.prepare(
    `UPDATE rooms SET block = ?, number = ?, capacity = ?, gender = ?, notes = ? WHERE id = ?`,
  ).run(input.block, input.number, input.capacity, input.gender, input.notes || null, id);
}

export function deleteRoom(id: string): void {
  // Delegates in this room fall back to unassigned (ON DELETE SET NULL).
  db.prepare(`DELETE FROM rooms WHERE id = ?`).run(id);
}
