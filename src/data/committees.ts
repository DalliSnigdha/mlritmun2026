/* =============================================================================
 *  MLRITMUN — COMMITTEES
 * =============================================================================
 *  Add, remove or reorder committees by editing the array below. Everything
 *  downstream — the committee grid and the detail modal — reads from this
 *  single list.
 *
 *  Executive Board and country/portfolio allocation are intentionally NOT
 *  part of V1. Do not add those fields here yet.
 * ========================================================================== */

export type Committee = {
  /** Stable machine id. */
  id: string;
  /** Full committee name, e.g. "United Nations Human Rights Council". */
  name: string;
  /** Short form shown on the card, e.g. "UNHRC". */
  abbr: string;
  /** One or two sentences for the card face. */
  short: string;
  /** Longer body shown in the detail modal. */
  description: string;
  /** Agenda, once announced. Leave as "[To be announced]" until then. */
  agenda: string;
  /** Optional guidance shown in the modal. Leave as "" to hide. */
  difficulty: string;
  /** Official committee crest, cropped from the conference poster. */
  crest: string;
  /** Flags a committee that runs outside the normal GA/council format
   *  (e.g. a crisis committee) — shown as a "Special Committee" badge. */
  special?: boolean;
};

export const committees: Committee[] = [
  {
    id: "aippm",
    name: "All India Political Parties Meet",
    abbr: "AIPPM",
    short:
      "A domestic simulation in which delegates represent Indian political leaders debating a national question.",
    description:
      "AIPPM breaks from UN procedure entirely. Delegates take on the roles of serving politicians and argue from party position rather than national interest, in a format that rewards rhetoric, floor presence and quick thinking. It is often the loudest and most keenly followed committee at an Indian conference.",
    agenda: "[To be announced]",
    difficulty: "Open to all experience levels",
    crest: "/committee-aippm.png",
  },
  {
    id: "unga-disec",
    name: "United Nations General Assembly — Disarmament and International Security Committee",
    abbr: "DISEC",
    short:
      "The First Committee of the General Assembly, where every member state holds an equal voice on questions of disarmament and global security.",
    description:
      "DISEC is the largest committee at most conferences and the natural home for first-time delegates who want a full General Assembly experience. Debate here is broad and consensus-driven: the committee cannot bind states, so its power lies in the strength of the language it agrees on. Expect a wide floor, long speakers' lists, and resolutions that must survive the scrutiny of a very large room.",
    agenda: "[To be announced]",
    difficulty: "Recommended for beginners and intermediate delegates",
    crest: "/committee-disec.png",
  },
  {
    id: "unhrc",
    name: "United Nations Human Rights Council",
    abbr: "UNHRC",
    short:
      "The UN body responsible for promoting and protecting human rights across the world.",
    description:
      "The Human Rights Council debates the questions that sit closest to the individual — civil liberties, protection of vulnerable groups, accountability for abuses — and it does so knowing that almost every member state has something to defend. Substantive research matters enormously here: delegates are expected to argue from treaty text, reports and precedent, not sentiment.",
    agenda: "[To be announced]",
    difficulty: "Recommended for intermediate delegates",
    crest: "/committee-unhrc.png",
  },
  {
    id: "ccc",
    name: "Continuous Crisis Committee",
    abbr: "CCC",
    short:
      "A single, fast-moving crisis scenario that evolves in real time as delegates act, rather than debate, their way through it.",
    description:
      "The CCC drops delegates into individual character portfolios inside one unfolding crisis, updated continuously by the executive board through crisis notes, breaking news and sudden developments. There is no fixed agenda to research in advance — the committee rewards improvisation, private strategy and decisive action over prepared speeches. Expect long, unpredictable sessions, with consequences that carry from one update to the next.",
    agenda: "[To be announced]",
    difficulty: "Recommended for experienced delegates",
    crest: "/committee-ccc.png",
    special: true,
  },
  {
    id: "ip",
    name: "International Press",
    abbr: "IP",
    short:
      "Delegates cover the conference itself — reporting, interviewing and publishing on the committees in session, rather than debating in one.",
    description:
      "The International Press corps moves between committee rooms as journalists and photographers, filing stories, interviewing delegates and producing the conference's own bulletin as the day unfolds. It suits delegates who write well under deadline and would rather uncover a story than deliver one — access, curiosity and a sharp editorial eye matter more than command of procedure.",
    agenda: "[To be announced]",
    difficulty: "Open to all experience levels",
    crest: "/committee-ip.png",
  },
];

export const getCommitteeById = (id: string): Committee | undefined =>
  committees.find((c) => c.id === id);
