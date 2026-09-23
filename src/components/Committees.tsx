"use client";

import { useState } from "react";
import { committees, type Committee } from "@/data/committees";
import { CommitteeCard } from "./CommitteeCard";
import { CommitteeModal } from "./CommitteeModal";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Committees() {
  const [selected, setSelected] = useState<Committee | null>(null);

  return (
    <section id="committees" className="section">
      <div className="shell relative">
        <SectionHeading
          eyebrow="03 — The Floor"
          title={<>Committees</>}
          intro="Five rooms, five kinds of pressure. Read each one before you rank your preferences — the committee you enjoy is rarely the one with the most familiar name."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {committees.map((committee, i) => (
            <Reveal as="li" key={committee.id} delay={0.05 * (i % 3)} className="h-full">
              <CommitteeCard committee={committee} index={i} onOpen={setSelected} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-12 text-[13.5px] leading-relaxed text-white/40">
            Agendas, Executive Board members and country allocations will be published
            by the MLRITMUN organizing team ahead of the conference.
          </p>
        </Reveal>
      </div>

      <CommitteeModal committee={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
