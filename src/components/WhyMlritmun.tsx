import { whyItems } from "@/data/why";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { WhyCard } from "./WhyCard";

export function WhyMlritmun() {
  return (
    <section id="why" className="section pt-0">
      <div className="shell">
        <SectionHeading
          eyebrow="02 — What You Take Away"
          title={
            <>
              Why <span className="ivory-text">MLRITMUN</span>
            </>
          }
          intro="Three days in committee tend to teach a handful of things faster than a semester does."
          align="center"
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-sm border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {whyItems.map((it, i) => (
            <Reveal as="li" key={it.title} delay={0.05 * i}>
              <WhyCard item={it} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
