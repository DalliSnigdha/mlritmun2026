import Image from "next/image";
import { isPlaceholder, site } from "@/data/site";
import { SocialLinks } from "./ui/SocialLinks";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-blue-950/60">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Identity */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-mark.png"
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
              <p className="font-display text-[1.7rem] font-medium tracking-[0.14em] text-white">
                {site.name.slice(0, 5)}
                <span className="ivory-text">{site.name.slice(5)}</span>
              </p>
            </div>
            <p className="mt-4 font-display text-[17px] font-light italic text-white/55">
              {site.tagline}
            </p>
            <p className="mt-7 max-w-xs text-[13.5px] leading-relaxed text-white/35">
              {site.fullName} at {site.institution}.
            </p>
          </div>

          {/* Navigate */}
          <nav className="lg:col-span-4" aria-label="Footer">
            <p className="font-sans text-[10.5px] uppercase tracking-widest2 text-ivory-500">
              Navigate
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[14px] text-white/50 transition-colors duration-300 hover:text-ivory-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Reach us */}
          <div className="lg:col-span-3">
            <p className="font-sans text-[10.5px] uppercase tracking-widest2 text-ivory-500">
              Reach Us
            </p>
            <ul className="mt-6 space-y-3.5 text-[14px] text-white/50">
              <li>
                {isPlaceholder(site.contact.email) ? (
                  site.contact.email
                ) : (
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="transition-colors duration-300 hover:text-ivory-400"
                  >
                    {site.contact.email}
                  </a>
                )}
              </li>
              <li>
                {isPlaceholder(site.contact.phone) ? (
                  site.contact.phone
                ) : (
                  <a
                    href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}
                    className="transition-colors duration-300 hover:text-ivory-400"
                  >
                    {site.contact.phone}
                  </a>
                )}
              </li>
            </ul>
            <SocialLinks className="mt-7" />
          </div>
        </div>

        {/* Hosts & partners */}
        <div className="mt-16 border-t border-white/[0.07] pt-10">
          <p className="text-center font-sans text-[10.5px] uppercase tracking-widest2 text-white/30 sm:text-left">
            Organized By
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-5 sm:justify-start">
            {site.hosts
              .filter((host) => host.name === "Club Literati")
              .map((host) => (
                <Image
                  key={host.name}
                  src={host.logo}
                  alt={host.name}
                  width={host.width}
                  height={host.height}
                  loading="eager"
                  className="h-auto max-h-9 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:max-h-11"
                />
            ))}
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center">
          <p className="text-[12.5px] text-white/30">
            © {site.year} {site.name}. All Rights Reserved.
          </p>
          <p className="text-[12.5px] text-white/25">
            {site.conference.date} · {site.conference.venue}
          </p>
        </div>
      </div>
    </footer>
  );
}
