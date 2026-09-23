"use client";

import { useState } from "react";
import type { Delegate } from "@/lib/delegates";
import type { Room } from "@/lib/rooms";
import { assignRoomAction, deleteDelegateAction, updateDelegateAction } from "./actions";

const inputClass =
  "w-full rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-ivory-500/70";

export function DelegateRow({ delegate, rooms }: { delegate: Delegate; rooms: Room[] }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
        <td colSpan={7} className="px-4 py-3">
          <form
            action={async (formData) => {
              await updateDelegateAction(formData);
              setEditing(false);
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <input type="hidden" name="id" value={delegate.id} />
            <input name="fullName" defaultValue={delegate.fullName} required className={`${inputClass} w-40`} placeholder="Full name" />
            <input name="institution" defaultValue={delegate.institution ?? ""} className={`${inputClass} w-40`} placeholder="Institution" />
            <input name="committee" defaultValue={delegate.committee ?? ""} className={`${inputClass} w-32`} placeholder="Committee" />
            <input name="email" defaultValue={delegate.email ?? ""} className={`${inputClass} w-40`} placeholder="Email" />
            <input name="phone" defaultValue={delegate.phone ?? ""} className={`${inputClass} w-32`} placeholder="Phone" />
            <select name="gender" defaultValue={delegate.gender ?? ""} className={`${inputClass} w-28`}>
              <option value="">Gender —</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label className="flex items-center gap-2 text-[12px] text-white/60">
              <input type="checkbox" name="needsRoom" value="true" defaultChecked={delegate.needsRoom} />
              Needs room
            </label>
            <input name="notes" defaultValue={delegate.notes ?? ""} className={`${inputClass} min-w-[8rem] flex-1`} placeholder="Notes" />
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
      <td className="px-4 py-3">
        <p className="text-[14px] text-white/85">{delegate.fullName}</p>
        <p className="text-[12px] text-white/35">{delegate.email || delegate.phone || "—"}</p>
      </td>
      <td className="px-4 py-3 text-[13.5px] text-white/60">{delegate.institution || "—"}</td>
      <td className="px-4 py-3 text-[13.5px] text-white/60">{delegate.committee || "—"}</td>
      <td className="px-4 py-3 text-[13px] uppercase tracking-wide text-white/45">
        {delegate.gender || "—"}
      </td>
      <td className="px-4 py-3">
        <form
          action={async (formData) => {
            formData.set("delegateId", delegate.id);
            await assignRoomAction(formData);
          }}
        >
          <select
            name="roomId"
            defaultValue={delegate.roomId ?? ""}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="rounded-sm border border-white/15 bg-white/[0.04] px-2 py-1.5 text-[13px] text-white"
          >
            <option value="">Unassigned</option>
            {rooms.map((room) => (
              <option
                key={room.id}
                value={room.id}
                disabled={room.occupied >= room.capacity && room.id !== delegate.roomId}
              >
                {room.block}-{room.number} ({room.occupied}/{room.capacity})
              </option>
            ))}
          </select>
        </form>
      </td>
      <td className="px-4 py-3 text-[12px] text-white/35">
        {delegate.needsRoom ? "Needs room" : "Not requested"}
      </td>
      <td className="px-4 py-3 text-right text-[12px]">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mr-4 uppercase tracking-widest2 text-white/50 hover:text-white"
        >
          Edit
        </button>
        <form action={deleteDelegateAction} className="inline">
          <input type="hidden" name="id" value={delegate.id} />
          <button type="submit" className="uppercase tracking-widest2 text-red-300/70 hover:text-red-300">
            Delete
          </button>
        </form>
      </td>
    </tr>
  );
}
