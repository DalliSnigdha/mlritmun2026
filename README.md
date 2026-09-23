# MLRITMUN — Conference Website (Version 1)

The official site for MLRITMUN, the Model United Nations conference hosted by MLR
Institute of Technology.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**,
**Framer Motion** and plain **three.js**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

For a production run:

```bash
npm run build
npm start
```

The accommodation admin tool (see below) needs two extra environment
variables before it will let anyone log in — copy `.env.local.example` to
`.env.local` and fill them in. The public marketing site works without them.

---

## The files you will actually edit

Everything that is still unconfirmed lives in `src/data/`, marked with
`[SQUARE BRACKETS]`. You do not need to touch any component to fill them in.

| File | What it controls |
| --- | --- |
| `src/data/site.ts` | Conference date, edition, theme words, venue, email, phone, social links, the two Google Forms registration links, host/partner logos, navigation, About copy, the footer year. |
| `src/data/committees.ts` | The committee list — name, abbreviation, descriptions, agenda, crest image. Feeds the committee grid and the detail modal. |
| `src/data/faq.ts` | The FAQ accordion. |
| `src/data/why.ts` | The six "Why MLRITMUN" cards. |

### Placeholders currently in place

`[CONTACT NUMBER]` · `[To be announced]` (committee agendas)

Search the project for `[` to find every one of them. Nothing about MLRITMUN has
been invented — where the real information was not available, a placeholder is
shown instead.

**Social links:** in `site.ts`, a social with an empty `href` renders dimmed and
non-clickable. Paste a real URL in and it activates. No code change needed.

---

## Registration

Registration itself happens on **Google Forms**, not on this site — the
Registration section is two cards that link out:

- **Priority Round** — `site.registration.priorityFormUrl`
- **Group Delegation** — `site.registration.groupFormUrl`

Leave either URL as an empty string and that card renders as "Coming Soon"
(dimmed, not clickable) instead of a dead link — the same pattern the social
links use.

---

## The accommodation admin tool

A private tool at **`/admin`** for the organizing team to track who needs a
room and assign them to one. It is not linked from the public site — only
people who know the URL and the shared password can reach it.

### Setup

```bash
cp .env.local.example .env.local
```

Fill in two values:

```
ADMIN_PASSWORD=<the password the whole organizing team shares>
ADMIN_SESSION_SECRET=<any long random string>
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Restart `npm run dev` after editing `.env.local`.

### Using it

1. **Add your Google Form's "Do you need accommodation?" question** if it
   isn't there already — this tool reads exported responses, it doesn't edit
   your form.
2. Go to `/admin/rooms` and add every room or dorm block available, with its
   capacity and an optional gender restriction.
3. Go to `/admin/delegates` and either:
   - **Import CSV** — export your Google Form responses as a CSV (in Google
     Sheets: File → Download → Comma Separated Values) and upload it. You map
     each of your form's columns to a field once; nothing is imported until
     you confirm. Every row is kept even if it didn't ask for a room, so
     nothing from the export is silently dropped — a "needing a room" filter
     just hides the rest by default.
   - **Add a delegate manually** for one-off entries.
4. Assign delegates to rooms one at a time from the dropdown in each row, or
   click **Auto-Assign Remaining** to fill every room with spare capacity
   from the unassigned queue, respecting a room's gender restriction when one
   is set.

The dashboard at `/admin` gives a one-screen count of who needs a room, who's
assigned, and how much capacity is left.

### Where the data lives

`data/accommodation.db` — a single SQLite file, created automatically the
first time the app runs. It is gitignored: this holds real delegates' contact
details and must never be committed.

### ⚠️ Read this before you deploy

This uses Node's built-in `node:sqlite` (no native dependency to install or
compile — deliberately, since a corporate network's TLS inspection can block
the binary downloads some ORMs need). That file works on any host with a
normal, persistent disk: a college server, a VPS, Railway, Render, a laptop
running `npm start`, Docker with a mounted volume.

It does **not** work on serverless hosting (Vercel, Netlify Functions, AWS
Lambda) — those platforms give each request a fresh, read-only filesystem, so
the database would reset constantly. If you deploy there, point
`ACCOMMODATION_DB_PATH` differently is not enough on its own; you'd need to
swap `src/lib/db.ts` for a hosted database (Supabase, Neon, Turso) instead.

---

## Project structure

```
src/
  app/
    layout.tsx                 root layout: fonts, metadata — no site chrome
    (site)/
      layout.tsx                the 3D backdrop + cursor glow, scoped to the
                                 marketing site only
      page.tsx                  the single public page — sections in order
    admin/
      login/page.tsx             shared-password login
      (protected)/
        layout.tsx                admin nav chrome + logout
        page.tsx                  dashboard
        rooms/                    room CRUD
        delegates/                CSV import, manual add, room assignment
    globals.css                 design tokens, glass, buttons, form controls
    icon.png                    favicon
  proxy.ts                      gates /admin/* behind the session cookie
  components/
    Navbar.tsx  Hero.tsx  About.tsx  WhyMlritmun.tsx  Committees.tsx
    Registration.tsx  Faq.tsx  Contact.tsx  Footer.tsx
    CommitteeCard.tsx  CommitteeModal.tsx
    globe/
      SiteVisuals.tsx           capability check + 3D / 2D switch + error boundary
      SiteScene.tsx             the plain-three.js canvas, fixed site-wide
      buildGlobe.ts             the globe + shards, procedural, no textures
      buildConstellation.ts     the dot-and-line background for every other page
      GlobeFallback.tsx         animated SVG globe (no WebGL required)
    ui/
      SectionHeading.tsx  Reveal.tsx  Icon.tsx  SocialLinks.tsx  CursorGlow.tsx
  data/                         ← the config files above
  lib/
    db.ts                       the accommodation SQLite connection + schema
    rooms.ts  delegates.ts      data-access functions the admin pages call directly
    adminAuth.ts                shared-password check + signed session cookie
```

Public-site sections are composed in `src/app/(site)/page.tsx`. Adding,
reordering or removing one is a one-line change there.

---

## Notes on a few decisions

**The globe.** Plain three.js, not a React renderer — an earlier attempt with
`@react-three/fiber` crashed under Next's App Router client bundling
(`react-reconciler` reads a React internal that isn't exported under the
`"react-server"` condition). `buildGlobe.ts` assembles the whole scene once by
hand and a manual `requestAnimationFrame` loop drives it, so React never
reconciles any of it. It's entirely procedural — a GLSL noise shader for
continents, no textures or model files — and mounted once, fixed to the
viewport, in `(site)/layout.tsx`, so it stays visible while scrolling through
every section: the globe owns the hero, then splits into drifting fragments
and hands off to a faint constellation for the rest of the page.
`SiteVisuals.tsx` checks for WebGL, reduced-motion preference, device memory
and core count before loading any of it — three.js is dynamically imported,
so visitors who get the 2D fallback never download it. If WebGL fails
mid-session, an error boundary drops to the 2D globe without breaking the
page.

**The accommodation tool uses `node:sqlite`, not an ORM.** Two small tables
don't need one, and it sidesteps a native-binary download entirely — Prisma's
own engine binaries failed to download here behind a corporate TLS-inspecting
proxy. `node:sqlite` ships with Node 22+ and needs nothing extra installed.

**Fonts.** Cormorant Garamond and Inter are loaded from Google Fonts with a
`<link>` in `src/app/layout.tsx`, and the two CSS variables they fill
(`--font-display`, `--font-sans`) are declared in `globals.css` and consumed by
`tailwind.config.ts`. This project intentionally does not use `next/font`, so
a build never depends on reaching Google — helpful on locked-down campus
networks.

Prefer self-hosted, build-time-optimised fonts? Replace the `<link>` tags with:

```tsx
import { Cormorant_Garamond, Inter } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
```

…then put `className={`${display.variable} ${sans.variable}`}` on `<html>` and
drop the `--font-display` / `--font-sans` declarations from `globals.css`.
That build needs internet access.

**Accessibility.** Skip link, visible focus rings, labelled fields, Escape-to-close
and scroll lock on the committee modal and mobile menu, and a full
`prefers-reduced-motion` path that also turns off the 3D globe.

---

## Deliberately not in Version 1

Payment · food and logistics · schedule · timeline · Executive Board ·
portfolio and country allocation · delegate-facing accounts or dashboards ·
certificates · notifications.

---

© 2026 MLRITMUN. All Rights Reserved.
