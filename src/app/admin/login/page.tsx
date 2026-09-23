import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  checkAdminPassword,
  createSessionToken,
} from "@/lib/adminAuth";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!checkAdminPassword(password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-950 px-6 text-white/85">
      <form
        action={login}
        className="w-full max-w-sm rounded-sm border border-white/10 bg-blue-900/40 p-8"
      >
        <p className="font-sans text-[11px] uppercase tracking-widest2 text-ivory-500">
          MLRITMUN Admin
        </p>
        <h1 className="mt-3 font-display text-2xl font-light text-white">
          Accommodation Desk
        </h1>
        <p className="mt-2 text-[13.5px] text-white/45">
          Shared organizer password. Contact the tech team if you don&apos;t have it.
        </p>

        <input type="hidden" name="next" value={next} />

        <label className="mt-7 block">
          <span className="mb-2 block text-[11px] uppercase tracking-widest2 text-white/55">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white outline-none focus:border-ivory-500/70"
          />
        </label>

        {params.error && (
          <p role="alert" className="mt-4 text-[13px] text-red-300">
            That password isn&apos;t right — try again.
          </p>
        )}

        <button
          type="submit"
          className="btn-primary mt-7 w-full justify-center"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
