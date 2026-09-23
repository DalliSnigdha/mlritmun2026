import { CursorTrail } from "@/components/ui/CursorTrail";
import { SiteVisuals } from "@/components/globe/SiteVisuals";

/**
 * The marketing site's own layout — the 3D backdrop and cursor trail are
 * scoped to this route group so the admin tool (outside it) stays a
 * plain, fast, chrome-free internal page.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteVisuals />
      <CursorTrail />
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-sm focus:bg-ivory-500 focus:px-5 focus:py-3 focus:text-[12px] focus:font-semibold focus:uppercase focus:tracking-widest2 focus:text-blue-950"
      >
        Skip to content
      </a>
      {children}
    </>
  );
}
