import { isPlaceholder, site } from "@/data/site";
import { ContactCard } from "./ContactCard";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { SocialLinks } from "./ui/SocialLinks";

type Detail = {
  label: string;
  value: string;
  icon: IconName;
  /** Link scheme to use once the value is real. */
  href?: string;
};

export function Contact() {
  const details: Detail[] = [
    {
      label: "Email",
      value: site.contact.email,
      icon: "mail",
      href: isPlaceholder(site.contact.email)
        ? undefined
        : `mailto:${site.contact.email}`,
    },
    {
      label: "Phone",
      value: site.contact.phone,
      icon: "phone",
      href: isPlaceholder(site.contact.phone)
        ? undefined
        : `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      label: "Venue",
      value: site.contact.location,
      icon: "pin",
    },
  ];

  return (
    <section id="contact" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="06 — Get in Touch"
          title={<>Contact</>}
          align="center"
        />

        <ul className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3 lg:mt-20">
          {details.map((d, i) => {
            const inner = (
              <>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-ivory-500/25 text-ivory-500 transition-colors duration-500 group-hover:border-ivory-500/60 group-hover:text-ivory-400">
                  <Icon name={d.icon} size={20} />
                </span>
                <span className="mt-6 block font-sans text-[10.5px] uppercase tracking-widest2 text-white/40">
                  {d.label}
                </span>
                <span className="mt-2.5 block break-words text-[15.5px] leading-relaxed text-white/85">
                  {d.value}
                </span>
              </>
            );

            return (
              <Reveal as="li" key={d.label} delay={0.06 * i}>
                <ContactCard href={d.href}>{inner}</ContactCard>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={0.12}>
          <div className="mt-14 flex flex-col items-center gap-6">
            <p className="font-sans text-[10.5px] uppercase tracking-widest2 text-white/35">
              Follow MLRITMUN
            </p>
            <SocialLinks />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
