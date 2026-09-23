import { site } from "@/data/site";
import { Icon, type IconName } from "./Icon";

/**
 * Renders the socials from src/data/site.ts. A social with an empty `href` is
 * shown dimmed and non-interactive, so the row still looks complete before the
 * accounts are live — set the URL in the config to activate it.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {site.socials.map((s) => {
        const base =
          "inline-flex h-11 w-11 items-center justify-center rounded-sm border transition-all duration-300";

        if (!s.href) {
          return (
            <li key={s.label}>
              <span
                className={`${base} cursor-default border-white/[0.07] text-white/20`}
                title={`${s.label} — coming soon`}
                aria-label={`${s.label} — coming soon`}
              >
                <Icon name={s.icon as IconName} size={17} />
              </span>
            </li>
          );
        }

        return (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`${base} border-white/[0.12] text-white/60 hover:-translate-y-0.5 hover:border-ivory-500/50 hover:text-ivory-400`}
            >
              <Icon name={s.icon as IconName} size={17} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
