import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import "./globals.css";

/* Typefaces
 * ---------
 * Cormorant Garamond (editorial serif) + Inter (UI sans), loaded from Google
 * Fonts with a <link> in the document head. The two CSS variables they fill
 * (--font-display / --font-sans) are declared in globals.css and consumed by
 * tailwind.config.ts, so swapping typefaces is a two-line change.
 *
 * Prefer self-hosted, build-time-optimised fonts? Replace the <link> tags below
 * with next/font/google — see the README, "Fonts".
 */

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.fullName}`,
    template: `%s · ${site.name}`,
  },
  description: `${site.name}: the Model United Nations conference hosted by ${site.institution}. ${site.tagline}`,
  keywords: ["MLRITMUN", "Model United Nations", "MUN", site.institution, "conference"],
  openGraph: {
    title: `${site.name} — ${site.fullName}`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050B1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
