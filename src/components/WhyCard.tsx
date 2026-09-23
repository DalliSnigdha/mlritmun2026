"use client";

import type { WhyItem } from "@/data/why";
import { Icon } from "./ui/Icon";
import { useTilt } from "./ui/useTilt";

export function WhyCard({ item, index }: { item: WhyItem; index: number }) {
  const { ref, handleMove, handleLeave } = useTilt<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative h-full bg-blue-950/85 p-8 transition-[transform,background-color] duration-300 ease-out hover:bg-blue-900/90 sm:p-9"
    >
      {/* Ivory wash on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ivory-500/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-ivory-500/25 text-ivory-500 transition-all duration-500 group-hover:border-ivory-500/60 group-hover:text-ivory-400">
            <Icon name={item.icon} size={22} />
          </span>
          <span className="font-display text-sm text-white/15 transition-colors duration-500 group-hover:text-ivory-600/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-7 font-display text-[1.45rem] font-normal tracking-wide text-white">
          {item.title}
        </h3>

        <p className="mt-3.5 text-[14.5px] leading-[1.75] text-white/55">{item.body}</p>
      </div>

      {/* Bottom hairline that draws in on hover */}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-ivory-500/70 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}
