import { site } from "@/data/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="01 — The Conference"
          title={
            <>
              About <span className="ivory-text">MLRITMUN</span>
            </>
          }
        />

        <div className="mt-14 grid gap-x-16 gap-y-10 lg:mt-20 lg:grid-cols-12">
          {/* Lead */}
          <Reveal className="lg:col-span-5">
            <p className="font-display text-[1.4rem] font-light leading-[1.5] text-white/90 sm:text-[1.6rem]">
              {site.about.lead}
            </p>
          </Reveal>

          {/* Body */}
          <div className="space-y-6 lg:col-span-7">
            {site.about.body.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="text-[16px] leading-[1.85] text-white/60">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
