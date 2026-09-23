import Link from "next/link";
import { committees } from "@/data/committees";
import { listDelegates, type DelegateFilter } from "@/lib/delegates";
import { listRooms } from "@/lib/rooms";
import { autoAssignAction, createDelegateAction } from "./actions";
import { DelegateRow } from "./DelegateRow";
import { ImportButton } from "./ImportButton";

const inputClass =
  "w-full rounded-sm border border-white/15 bg-white/[0.04] px-3 py-2.5 text-[14px] text-white outline-none focus:border-ivory-500/70";

export default async function AdminDelegatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; assigned?: string; show?: string }>;
}) {
  const params = await searchParams;
  const assigned =
    params.assigned === "assigned" || params.assigned === "unassigned"
      ? params.assigned
      : "all";
  const showAll = params.show === "all";

  const filter: DelegateFilter = {
    search: params.q,
    assigned,
    needsRoomOnly: !showAll,
  };

  const delegates = listDelegates(filter);
  const rooms = listRooms();

  const linkWith = (patch: Record<string, string>) => {
    const next = new URLSearchParams({
      ...(params.q ? { q: params.q } : {}),
      assigned,
      show: showAll ? "all" : "needing",
      ...patch,
    });
    return `/admin/delegates?${next.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-white">Delegates</h1>
          <p className="mt-2 text-[14px] text-white/45">
            Import your Google Form responses, then assign delegates to rooms.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ImportButton />
          <form action={autoAssignAction}>
            <button type="submit" className="btn-primary">
              Auto-Assign Remaining
            </button>
          </form>
        </div>
      </div>

      {/* Manual add */}
      <details className="mt-8 rounded-sm border border-white/10 bg-blue-900/40">
        <summary className="cursor-pointer px-6 py-4 text-[13px] uppercase tracking-widest2 text-white/60">
          Add a delegate manually
        </summary>
        <form action={createDelegateAction} className="flex flex-wrap items-end gap-4 px-6 pb-6">
          <label className="w-44">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
              Full Name
            </span>
            <input name="fullName" required className={inputClass} />
          </label>
          <label className="w-44">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
              Institution
            </span>
            <input name="institution" className={inputClass} />
          </label>
          <label className="w-36">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
              Committee
            </span>
            <select name="committee" defaultValue="" className={inputClass}>
              <option value="">—</option>
              {committees.map((c) => (
                <option key={c.id} value={c.abbr}>
                  {c.abbr}
                </option>
              ))}
            </select>
          </label>
          <label className="w-44">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
              Email
            </span>
            <input name="email" type="email" className={inputClass} />
          </label>
          <label className="w-32">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-white/50">
              Gender
            </span>
            <select name="gender" defaultValue="" className={inputClass}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <button type="submit" className="btn-ghost">
            Add
          </button>
        </form>
      </details>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <form method="get" className="flex-1 min-w-[14rem]">
          <input type="hidden" name="assigned" value={assigned} />
          <input type="hidden" name="show" value={showAll ? "all" : "needing"} />
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search name, email, institution…"
            className={inputClass}
          />
        </form>
        <div className="flex gap-2 text-[12px] uppercase tracking-widest2">
          {(["all", "unassigned", "assigned"] as const).map((option) => (
            <Link
              key={option}
              href={linkWith({ assigned: option })}
              className={`rounded-sm px-3 py-2 ${
                assigned === option
                  ? "bg-ivory-500 text-blue-950"
                  : "border border-white/15 text-white/50 hover:text-white"
              }`}
            >
              {option}
            </Link>
          ))}
        </div>
        <Link
          href={linkWith({ show: showAll ? "needing" : "all" })}
          className="text-[12px] uppercase tracking-widest2 text-white/40 hover:text-white"
        >
          {showAll ? "Showing everyone imported" : "Only showing those needing a room"}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-white/10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-widest2 text-white/40">
              <th className="px-4 py-3 font-medium">Delegate</th>
              <th className="px-4 py-3 font-medium">Institution</th>
              <th className="px-4 py-3 font-medium">Committee</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {delegates.map((delegate) => (
              <DelegateRow key={delegate.id} delegate={delegate} rooms={rooms} />
            ))}
            {delegates.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[14px] text-white/35">
                  No delegates match — import a CSV or add one manually above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
