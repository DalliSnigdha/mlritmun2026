"use client";

import type { ReactNode } from "react";
import { useTilt } from "./ui/useTilt";

export function ContactCard({ href, children }: { href?: string; children: ReactNode }) {
  const { ref, handleMove, handleLeave } = useTilt<HTMLElement>();
  const className =
    "group flex h-full flex-col items-center rounded-sm border border-white/[0.08] bg-blue-900/40 p-9 text-center transition-[transform,border-color,background-color] duration-300 ease-out hover:border-ivory-500/30 hover:bg-blue-850/60";

  if (href) {
    return (
      <a
        ref={ref as unknown as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <div
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </div>
  );
}
