/* =============================================================================
 *  MLRITMUN — CENTRAL SITE CONFIGURATION
 * =============================================================================
 *  This is the ONE file to edit for conference details.
 *  Anything wrapped in [SQUARE BRACKETS] is a placeholder awaiting official
 *  information — replace the string, and it updates everywhere on the site.
 *
 *  Nothing here has been invented. Fill it in from official MLRITMUN sources.
 * ========================================================================== */

export const site = {
  /** Short name used in the navbar, footer and browser tab. */
  name: "MLRITMUN",

  /** Full expansion, shown under the hero wordmark. */
  fullName: "Model United Nations",

  /** Host institution. */
  institution: "MLR Institute of Technology",

  /** The conference tagline. */
  tagline: "Where Diplomacy Meets Dialogue.",

  /** Edition / year label used in the footer copyright. */
  year: 2026,

  /** Edition ordinal, shown as a small tag in the hero — e.g. "8th Edition". */
  edition: "8th Edition",

  /** The three-word theme printed on the official poster. */
  themeWords: ["Envision", "Engage", "Empower"],

  /* -------------------------------------------------------------------------
   *  CONFERENCE DETAILS
   * ---------------------------------------------------------------------- */
  conference: {
    date: "9–11 October 2026",
    /** e.g. "MLR Institute of Technology, Dundigal, Hyderabad" */
    venue: "VENUE: MLRIT Campus",
  },

  /* -------------------------------------------------------------------------
   *  CONTACT  — replace the placeholders below
   * ---------------------------------------------------------------------- */
  contact: {
    email: "mlritmun@mlrit.ac.in",
    phone: "JDGS — 6304925539",
    location: "MLRIT CAMPUS",
  },

  /* -------------------------------------------------------------------------
   *  REGISTRATION  — Google Forms links.
   * ---------------------------------------------------------------------- */
  registration: {
    priorityFormUrl: "https://forms.gle/t6RSAaoJRxp2Kr6Z6",
    groupFormUrl: "https://forms.gle/vu2Y1BT7xdXXSpM47",
  },

  /* -------------------------------------------------------------------------
   *  SOCIAL LINKS
   *  Set `href` to a real URL to activate a link. Leave it as an empty string
   *  and the icon renders as "coming soon" (dimmed, not clickable).
   * ---------------------------------------------------------------------- */
  socials: [
    { label: "Instagram", href: "https://instagram.com/mlritmun", icon: "instagram" },
    { label: "LinkedIn", href: "", icon: "linkedin" },
    { label: "X", href: "", icon: "x" },
    { label: "YouTube", href: "", icon: "youtube" },
  ],

  /* -------------------------------------------------------------------------
   *  HOSTS & PARTNERS  — logos cropped from the official poster.
   * ---------------------------------------------------------------------- */
  hosts: [
    { name: "MLR Institute of Technology", logo: "/host-mlrit.png", width: 119, height: 29 },
    { name: "Club Literati", logo: "/host-club-literati.png", width: 117, height: 46 },
    { name: "Arundathi Institute of Medical Sciences", logo: "/host-arundathi.png", width: 116, height: 43 },
  ],
  /* -------------------------------------------------------------------------
   *  NAVIGATION
   * ---------------------------------------------------------------------- */
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Committees", href: "#committees" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  /* -------------------------------------------------------------------------
   *  ABOUT COPY  — placeholder text, kept deliberately short.
   *  Swap for the official description once it is approved.
   * ---------------------------------------------------------------------- */
  about: {
    lead: "MLRITMUN is the Model United Nations conference hosted by MLR Institute of Technology — three days of simulated diplomacy in which students take the floor as delegates of nations and negotiate their way through the issues shaping our world.",
    body: [
      "A Model United Nations is a structured simulation of the United Nations and its bodies. Delegates are assigned a country, research its position, and then debate, caucus, draft and vote exactly as diplomats do — bound by rules of procedure and by the interests of the state they represent.",
      "For a student, that is a rare kind of practice. You leave having argued a position that is not your own, having built consensus with people who came to disagree with you, and having written policy under a deadline. Research, negotiation, public speaking and leadership are not modules here; they are the only way through the committee.",
    ],
  },
} as const;

export type Site = typeof site;

/** True when a value is still an unfilled placeholder like "[DATE]". */
export const isPlaceholder = (value: string): boolean =>
  /^\[.*\]$/.test(value.trim());
