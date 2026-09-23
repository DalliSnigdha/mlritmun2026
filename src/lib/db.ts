/* =============================================================================
 *  Accommodation admin — database
 * =============================================================================
 *  Node's built-in `node:sqlite` (Node 22+, no extra native dependency to
 *  install or compile) rather than an ORM — two small tables don't need one,
 *  and this sidesteps a native-binary download entirely, which matters on a
 *  locked-down corporate network.
 *
 *  The file lives outside `public/` and outside version control (see
 *  .gitignore) — it holds real delegates' contact details.
 * ========================================================================== */

import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.ACCOMMODATION_DB_PATH ?? path.join(DB_DIR, "accommodation.db");

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const globalForDb = globalThis as unknown as { accommodationDb?: DatabaseSync };

const db = globalForDb.accommodationDb ?? new DatabaseSync(DB_PATH);
if (process.env.NODE_ENV !== "production") globalForDb.accommodationDb = db;

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS rooms (
    id         TEXT PRIMARY KEY,
    block      TEXT NOT NULL,
    number     TEXT NOT NULL,
    capacity   INTEGER NOT NULL,
    gender     TEXT NOT NULL DEFAULT 'any',
    notes      TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (block, number)
  );

  CREATE TABLE IF NOT EXISTS delegates (
    id          TEXT PRIMARY KEY,
    full_name   TEXT NOT NULL,
    email       TEXT,
    phone       TEXT,
    institution TEXT,
    committee   TEXT,
    source      TEXT NOT NULL DEFAULT 'priority',
    gender      TEXT,
    needs_room  INTEGER NOT NULL DEFAULT 1,
    notes       TEXT,
    room_id     TEXT REFERENCES rooms (id) ON DELETE SET NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_delegates_room_id ON delegates (room_id);
`);

export function newId(): string {
  return randomUUID();
}

export { db };
