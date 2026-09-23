import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

async function logout() {
  "use server";
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-950 text-white/85">
      <header className="border-b border-white/10 bg-blue-900/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg font-light text-ivory-400">
              MLRITMUN Admin
            </span>
            <nav className="flex gap-6 text-[13px] text-white/55">
              <Link href="/admin" className="transition-colors hover:text-white">
                Dashboard
              </Link>
              <Link href="/admin/rooms" className="transition-colors hover:text-white">
                Rooms
              </Link>
              <Link href="/admin/delegates" className="transition-colors hover:text-white">
                Delegates
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-[13px] text-white/40 transition-colors hover:text-white"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
