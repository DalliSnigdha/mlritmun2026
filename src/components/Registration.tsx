import { site } from "@/data/site";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

type RegistrationRoute = {
  label: string;
  description: string;
  icon: IconName;
  href: string;
  cta: string;
};

export function Registration() {
  const routes: RegistrationRoute[] = [
    {
      label: "Priority Round",
      description:
        "Limited early-access seats before general registration opens. Takes a few minutes on Google Forms — have your committee preferences ready.",
      icon: "bolt",
      href: site.registration.priorityFormUrl,
      cta: "Register Here",
    },
    {
      label: "Group Delegation",
      description:
        "Bringing a delegation from your school or college? A dedicated group form is here.",
      icon: "users",
      href: site.registration.groupFormUrl,
      cta: "Register Here",
    },
  ];

  return (
    <section id="registration" className="section">
      <div className="shell relative">
        <SectionHeading
          eyebrow="04 — Delegate Registration"
          title={<>Registration</>}
          intro="Registration runs through Google Forms — pick the route below that fits you."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2 lg:mt-20">
          {routes.map((route, i) => {
            const open = Boolean(route.href);
            const inner = (
              <>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-ivory-500/25 text-ivory-500 transition-colors duration-500 group-hover:border-ivory-500/60 group-hover:text-ivory-400">
                  <Icon name={route.icon} size={20} />
                </span>
                <span className="mt-6 block font-display text-xl font-light text-white">
                  {route.label}
                </span>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/55">
                  {route.description}
                </p>
                <span
                  className={`mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest2 ${
                    open ? "text-ivory-500" : "text-white/30"
                  }`}
                >
                  {route.cta}
                  {open && <Icon name="arrow" size={14} />}
                </span>
              </>
            );

            return (
              <Reveal key={route.label} delay={0.08 * i}>
                {open ? (
                  <a
                    href={route.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col items-start rounded-sm border border-white/[0.08] bg-blue-900/40 p-9 text-left transition-all duration-500 hover:-translate-y-1 hover:border-ivory-500/30 hover:bg-blue-850/60"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group flex h-full flex-col items-start rounded-sm border border-white/[0.08] bg-blue-900/25 p-9 text-left opacity-60">
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.18}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-[13px] text-white/35">
            Each form opens in a new tab. Keep the confirmation email you get from Google
            Forms — it&apos;s your proof of submission until allocations go out.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
