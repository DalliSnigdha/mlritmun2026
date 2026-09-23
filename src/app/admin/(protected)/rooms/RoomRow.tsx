"use client";

import { useState } from "react";
import type { Room } from "@/lib/rooms";
import { deleteRoomAction, updateRoomAction } from "./actions";

const inputClass =
  "w-full rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-ivory-500/70";

export function RoomRow({ room }: { room: Room }) {
  const [editing, setEditing] = useState(false);
  const full = room.occupied >= room.capacity;

  if (editing) {
    return (
      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
        <td colSpan={6} className="px-4 py-3">
          <form
            action={async (formData) => {
              await updateRoomAction(formData);
              setEditing(false);
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <input type="hidden" name="id" value={room.id} />
            <input name="block" defaultValue={room.block} required className={`${inputClass} w-24`} placeholder="Block" />
            <input name="number" defaultValue={room.number} required className={`${inputClass} w-20`} placeholder="Room #" />
            <input
              name="capacity"
              type="number"
              min={1}
              defaultValue={room.capacity}
              required
              className={`${inputClass} w-20`}
            />
            <select name="gender" defaultValue={room.gender} className={`${inputClass} w-24`}>
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              name="notes"
              defaultValue={room.notes ?? ""}
              placeholder="Notes"
              className={`${inputClass} min-w-[10rem] flex-1`}
            />
            <button type="submit" className="text-[12px] font-semibold uppercase tracking-widest2 text-ivory-500 hover:text-ivory-400">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-[12px] uppercase tracking-widest2 text-white/40 hover:text-white/70"
            >
              Cancel
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-white/[0.06]">
      <td className="px-4 py-3 text-[14px] text-white/85">{room.block}</td>
      <td className="px-4 py-3 text-[14px] text-white/85">{room.number}</td>
      <td className="px-4 py-3 text-[13px] uppercase tracking-wide text-white/50">
        {room.gender}
      </td>
      <td className={`px-4 py-3 text-[14px] ${full ? "text-red-300" : "text-white/70"}`}>
        {room.occupied} / {room.capacity}
      </td>
      <td className="px-4 py-3 text-[13px] text-white/40">{room.notes || "—"}</td>
      <td className="px-4 py-3 text-right text-[12px]">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mr-4 uppercase tracking-widest2 text-white/50 hover:text-white"
        >
          Edit
        </button>
        <form action={deleteRoomAction} className="inline">
          <input type="hidden" name="id" value={room.id} />
          <button type="submit" className="uppercase tracking-widest2 text-red-300/70 hover:text-red-300">
            Delete
          </button>
        </form>
      </td>
    </tr>
  );
}
