import { listRooms } from "@/lib/rooms";
import { createRoomAction } from "./actions";
import { RoomRow } from "./RoomRow";

const inputClass =
  "w-full rounded-sm border border-white/15 bg-white/[0.04] px-3 py-2.5 text-[14px] text-white outline-none focus:border-ivory-500/70";

export default function AdminRoomsPage() {
  const rooms = listRooms();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-white">Rooms</h1>
      <p className="mt-2 text-[14px] text-white/45">
        Add every room or dorm bed block available for the conference, then assign
        delegates to them from the Delegates page.
      </p>

      <form
        action={createRoomAction}
        className="mt-8 flex flex-wrap items-end gap-4 rounded-sm border border-white/10 bg-blue-900/40 p-6"
      >
        <label className="w-28">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
            Block
          </span>
          <input name="block" required placeholder="A" className={inputClass} />
        </label>
        <label className="w-28">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
            Room No.
          </span>
          <input name="number" required placeholder="101" className={inputClass} />
        </label>
        <label className="w-28">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
            Capacity
          </span>
          <input name="capacity" type="number" min={1} defaultValue={2} required className={inputClass} />
        </label>
        <label className="w-32">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
            Gender
          </span>
          <select name="gender" defaultValue="any" className={inputClass}>
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="min-w-[12rem] flex-1">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
            Notes
          </span>
          <input name="notes" placeholder="Optional" className={inputClass} />
        </label>
        <button type="submit" className="btn-primary">
          Add Room
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-sm border border-white/10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-widest2 text-white/40">
              <th className="px-4 py-3 font-medium">Block</th>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Occupancy</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[14px] text-white/35">
                  No rooms yet — add the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
