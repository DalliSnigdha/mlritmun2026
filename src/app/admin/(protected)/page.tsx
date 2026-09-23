import Link from "next/link";
import { listDelegates } from "@/lib/delegates";
import { listRooms } from "@/lib/rooms";

export default function AdminDashboardPage() {
  const rooms = listRooms();
  const needingRoom = listDelegates({ needsRoomOnly: true });
  const assigned = needingRoom.filter((d) => d.roomId);
  const unassigned = needingRoom.filter((d) => !d.roomId);

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0);

  const stats = [
    { label: "Need Accommodation", value: needingRoom.length },
    { label: "Assigned", value: assigned.length },
    { label: "Unassigned", value: unassigned.length },
    { label: "Room Capacity Used", value: `${totalOccupied} / ${totalCapacity}` },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-white">Dashboard</h1>
      <p className="mt-2 text-[14px] text-white/45">
        A snapshot of accommodation requests and room capacity.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-sm border border-white/10 bg-blue-900/40 p-5"
          >
            <p className="font-display text-3xl font-light text-white">{s.value}</p>
            <p className="mt-2 text-[11px] uppercase tracking-widest2 text-white/45">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/admin/rooms" className="btn-ghost">
          Manage Rooms
        </Link>
        <Link href="/admin/delegates" className="btn-primary">
          Manage Delegates
        </Link>
      </div>

      {unassigned.length > 0 && rooms.length === 0 && (
        <p className="mt-8 rounded-sm border border-ivory-500/30 bg-white/[0.03] px-5 py-4 text-[13.5px] text-white/60">
          No rooms have been added yet — add rooms first, then assign delegates to them.
        </p>
      )}
    </div>
  );
}
