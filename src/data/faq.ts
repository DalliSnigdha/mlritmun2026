/* =============================================================================
 *  MLRITMUN — FREQUENTLY ASKED QUESTIONS
 * =============================================================================
 *  Add or edit entries below; the accordion renders whatever is in this array.
 *  Answers that depend on unconfirmed information use [PLACEHOLDER] markers.
 * ========================================================================== */

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "What is MLRITMUN?",
    answer:
      "MLRITMUN is the Model United Nations conference hosted by MLR Institute of Technology. Delegates are assigned a country and a committee, research that country's position, and then debate, negotiate and draft resolutions under formal rules of procedure.",
  },
  {
    question: "Who can participate?",
    answer:
      "Registration is open to school and college students. You do not need to be a student of MLR Institute of Technology to attend. Any specific eligibility conditions will be confirmed by the organizing team before registrations close.",
  },
  {
    question: "Do I need previous MUN experience?",
    answer:
      "No. A number of committees are chosen specifically to suit first-time delegates, and the registration form asks about your experience so that allocations can take it into account. Preparation matters far more than prior attendance.",
  },
  {
    question: "How do I register?",
    answer:
      "Head to the Registration section and open the Priority Round form — it's hosted on Google Forms and takes a few minutes: your personal details, a short note on any previous MUN experience, and three committee preferences. Bringing a group from your school or college? A dedicated group delegation form is coming soon.",
  },
  {
    question: "Can I choose my committee?",
    answer:
      "You may submit a first, second and third preference. Preferences are given genuine weight, but they are subject to availability and to the final allocation decided by the MLRITMUN organizing team.",
  },
  {
    question: "When will committee allocations be announced?",
    answer:
      "Allocations will be announced after registrations close. The exact date will be communicated to registered delegates at mlritmun@mlrit.ac.in and posted on our official channels.",
  },
  {
    question: "What are the dates and where is the conference held?",
    answer:
      "MLRITMUN's 8th edition runs 9–11 October 2026 at the MLRIT campus. Full details will be shared with registered delegates ahead of the conference.",
  },
  {
    question: "Who do I contact if I have a question?",
    answer:
      "Write to mlritmun@mlrit.ac.in or message us on Instagram at @mlritmun. The organizing team will respond as quickly as it can.",
  },
];
