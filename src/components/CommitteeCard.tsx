"use client";

import Image from "next/image";
import type { Committee } from "@/data/committees";
import { Icon } from "./ui/Icon";
import { useTilt } from "./ui/useTilt";

interface Props {
  committee: Committee;
  index: number;
  onOpen: (committee: Committee) => void;
}

export function CommitteeCard({ committee, index, onOpen }: Props) {
  const { ref, handleMove, handleLeave } = useTilt<HTMLElement>();

  return (
    <article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/[0.08] bg-blue-900/50 p-8 backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-out hover:border-ivory-500/35 hover:bg-blue-850/70 sm:p-9"
    >
      {/* Corner index */}
      <span className="absolute right-7 top-7 font-display text-sm text-white/12 transition-colors duration-500 group-hover:text-ivory-600/50">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Crest */}
      <Image
        src={committee.crest}
        alt=""
        width={56}
        height={56}
        className="h-12 w-12 object-contain opacity-90 transition-transform duration-500 group-hover:scale-110"
      />

      {committee.special ? (
        <>
          {/* Special committees keep their identity under wraps —
              no abbreviation, name or description rendered here. */}
          <p className="mt-5 font-display text-[2.1rem] font-light leading-none tracking-tight text-white/90 transition-colors duration-500 group-hover:text-ivory-400">
            Special Committee
          </p>

          <div className="mt-5 h-px w-10 bg-ivory-500/40 transition-all duration-500 group-hover:w-20" />

          <p className="mt-5 flex-1 text-[14.5px] leading-[1.75] text-white/55">
            Its format and portfolios are kept under wraps until the conference itself.
          </p>
        </>
      ) : (
        <>
          {/* Abbreviation */}
          <p className="mt-5 font-display text-[2.6rem] font-light leading-none tracking-tight text-white/90 transition-colors duration-500 group-hover:text-ivory-400">
            {committee.abbr}
          </p>

          {/* Full name */}
          <h3 className="mt-5 text-[13.5px] font-medium uppercase leading-[1.55] tracking-[0.11em] text-white/80">
            {committee.name}
          </h3>

          <div className="mt-5 h-px w-10 bg-ivory-500/40 transition-all duration-500 group-hover:w-20" />

          {/* Short description */}
          <p className="mt-5 flex-1 text-[14.5px] leading-[1.75] text-white/55">
            {committee.short}
          </p>
        </>
      )}

      {/* Agenda */}
      <p className="mt-7 text-[12.5px] leading-relaxed text-white/45">
        <span className="font-sans text-[10.5px] uppercase tracking-widest2 text-ivory-500">
          Agenda
        </span>
        <span className="mt-1.5 block text-white/65">{committee.agenda}</span>
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={() => onOpen(committee)}
        className="mt-8 inline-flex items-center gap-2.5 self-start font-sans text-[11px] font-semibold uppercase tracking-widest2 text-white/70 transition-colors duration-300 hover:text-ivory-400"
      >
        View Details
        <Icon
          name="arrow"
          size={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
        <span className="sr-only">for {committee.special ? "the special committee" : committee.abbr}</span>
      </button>
    </article>
  );
}
