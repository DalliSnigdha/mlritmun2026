/* =============================================================================
 *  MLRITMUN — "WHY MLRITMUN" CARDS
 * =============================================================================
 *  Edit the copy freely. `icon` maps to a key in components/ui/Icon.tsx.
 * ========================================================================== */

export type WhyItem = {
  title: string;
  body: string;
  icon: "diplomacy" | "speaking" | "research" | "negotiation" | "leadership" | "network";
};

export const whyItems: WhyItem[] = [
  {
    title: "Diplomacy",
    body: "Argue a position that is not your own, and hold it under pressure. Delegates learn to separate the person from the policy.",
    icon: "diplomacy",
  },
  {
    title: "Public Speaking",
    body: "A ninety-second speech to a full committee is a different skill from a classroom presentation. You get many chances to sharpen it.",
    icon: "speaking",
  },
  {
    title: "Research",
    body: "Every claim on the floor must be defensible. Preparation means treaties, reports and voting records — not a search result.",
    icon: "research",
  },
  {
    title: "Negotiation",
    body: "Resolutions pass because blocs form. Finding the clause that two opposed delegations can both sign is the real work of committee.",
    icon: "negotiation",
  },
  {
    title: "Leadership",
    body: "No one is appointed to lead a bloc. Delegates who draft well, listen well and keep a room moving end up leading it.",
    icon: "leadership",
  },
  {
    title: "Networking",
    body: "Three days in committee with students from across institutions — and a set of contacts that tends to outlast the conference.",
    icon: "network",
  },
];
