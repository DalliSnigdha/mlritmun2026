/* A small, dependency-free icon set. Every icon is a 24×24 stroke glyph so the
 * whole site keeps one line weight. Add new glyphs to `paths` below. */

import type { SVGProps } from "react";

export type IconName =
  // "Why MLRITMUN" cards
  | "diplomacy"
  | "speaking"
  | "research"
  | "negotiation"
  | "leadership"
  | "network"
  // UI
  | "menu"
  | "close"
  | "chevron"
  | "arrow"
  | "check"
  | "mail"
  | "phone"
  | "pin"
  | "globe"
  | "bolt"
  | "users"
  // Social
  | "instagram"
  | "linkedin"
  | "x"
  | "youtube";

const paths: Record<IconName, React.ReactNode> = {
  diplomacy: (
    <>
      <path d="M12 21c0-4 2-6 5.5-7.5C20 12.4 21 10.5 21 8c-3.2 0-5.6 1-7 3" />
      <path d="M12 21c0-4-2-6-5.5-7.5C4 12.4 3 10.5 3 8c3.2 0 5.6 1 7 3" />
      <path d="M12 21V11" />
      <circle cx="12" cy="6" r="2.5" />
    </>
  ),
  speaking: (
    <>
      <path d="M12 3v9" />
      <rect x="9.5" y="3" width="5" height="6" rx="2.5" />
      <path d="M6.5 9a5.5 5.5 0 0 0 11 0" />
      <path d="M7 21h10" />
      <path d="M10 21l2-6 2 6" />
    </>
  ),
  research: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v13H6.5A2.5 2.5 0 0 0 4 18.5z" />
      <path d="M12 3h5.5A2.5 2.5 0 0 1 20 5.5V12" />
      <circle cx="17" cy="17" r="3" />
      <path d="M19.2 19.2 21.5 21.5" />
    </>
  ),
  negotiation: (
    <>
      <path d="M12 4v16" />
      <path d="M5 7h14" />
      <path d="M8 7 5 14h6z" />
      <path d="M16 7l-3 7h6z" />
      <path d="M9 20h6" />
    </>
  ),
  leadership: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 3.5L16 11H5" />
      <path d="M5 21h5" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="17" r="2.2" />
      <circle cx="19" cy="17" r="2.2" />
      <path d="M10.6 6.8 6.4 15.2M13.4 6.8l4.2 8.4M7.2 17h9.6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  chevron: (
    <>
      <path d="M6 9l6 6 6-6" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  check: (
    <>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <>
      <path d="M8.2 3.6 10 7.4l-2 1.6a12 12 0 0 0 5 5l1.6-2 3.8 1.8v3.3c0 1-.9 1.8-1.9 1.7C8.4 18.9 5.1 15.6 3.6 5.5A1.8 1.8 0 0 1 5.3 3.6z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </>
  ),
  bolt: (
    <>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      <path d="M15.5 6.5a3.2 3.2 0 0 1 0 6" />
      <path d="M15 14c2.8.4 4.9 2.6 4.9 6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V17" />
      <circle cx="8" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <path d="M12 10.5V17" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l16 16M20 4L4 20" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5z" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
