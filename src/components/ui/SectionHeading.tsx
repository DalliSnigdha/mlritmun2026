import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  /** Small ivory label above the title, e.g. "01 — About". */
  eyebrow?: string;
  title: ReactNode;
  /** Optional line of supporting copy under the rule. */
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Every section header on the site is this component — one rhythm throughout. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <h2 className="font-display text-[2.15rem] font-light leading-[1.1] tracking-[-0.015em] sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <div
          className={`mt-7 h-px w-24 bg-gradient-to-r from-ivory-500 to-transparent ${
            centered ? "mx-auto from-transparent via-ivory-500 to-transparent" : ""
          }`}
        />
      </Reveal>

      {intro && (
        <Reveal delay={0.18}>
          <p className="mt-7 text-[16.5px] leading-[1.75] text-white/60">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
