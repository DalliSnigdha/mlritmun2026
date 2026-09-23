"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/data/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="home"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* The 3D starfield backdrop is mounted once, site-wide, in layout.tsx —
          it sits fixed behind every section, not scoped to this one. Only
          the veils that keep the type readable live here. */}

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 55% at 50% 48%, rgba(5,11,30,0.72) 0%, rgba(5,11,30,0.35) 45%, rgba(5,11,30,0.05) 70%)",
        }}
      />
      {/* Top and bottom fades, so the hero joins the page rather than sitting on it */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-blue-950 via-blue-950/70 to-transparent" />

      {/* --- Content --- */}
      <motion.div
        className="shell relative z-10 py-32 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Crest */}
        <motion.div variants={item} className="mb-7 flex justify-center">
          <Image
            src="/logo-mark.png"
            alt={`${site.name} crest`}
            width={190}
            height={190}
            className="h-[140px] w-[140px] object-contain sm:h-[190px] sm:w-[190px]"
            priority
          />
        </motion.div>

        {/* Host line */}
        <motion.p
          variants={item}
          className="mb-8 font-sans text-[10.5px] uppercase tracking-widest3 text-white/45 sm:text-[11.5px]"
        >
          {site.institution}
          <span className="mx-2.5 text-ivory-500/60">·</span>
          {site.edition}
        </motion.p>

        {/* Wordmark */}
        <motion.h5
          variants={item}
          className="text-shadow-hero font-display text-[1.9rem] font-light leading-[0.95] tracking-[-0.02em] text-white sm:text-[2.6rem] lg:text-[3.4rem] xl:text-[3.75rem]"
        >
          MLRIT<span className="ivory-text">MUN</span>
        </motion.h5>

        {/* Expansion */}
        <motion.p
          variants={item}
          className="mt-6 font-sans text-[11px] font-medium uppercase tracking-widest3 text-white/70 sm:mt-8 sm:text-[13px] lg:text-[15px]"
        >
          {site.fullName}
        </motion.p>

        {/* Rule */}
        <motion.div
          variants={item}
          className="mx-auto mt-9 h-px w-40 bg-ivory-line sm:w-56"
        />

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mt-9 font-display text-xl font-light italic tracking-wide text-white/85 sm:text-2xl lg:text-[1.75rem]"
        >
          {site.tagline}
        </motion.p>

        {/* Theme */}
        <motion.p
          variants={item}
          className="mt-5 font-sans text-[11px] uppercase tracking-widest3 text-ivory-500/80 sm:text-[12px]"
        >
          {site.themeWords.join(" · ")}
        </motion.p>

        {/* Date • Venue */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5"
        >
          <span className="glass rounded-sm px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest2 text-white/75">
            {site.conference.date}
          </span>
          <span className="hidden h-1 w-1 rotate-45 bg-ivory-500 sm:block" />
          <span className="glass rounded-sm px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest2 text-white/75">
            {site.conference.venue}
          </span>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <a href="#registration" className="btn-primary w-full sm:w-auto">
            Register Now
          </a>
          <a href="#committees" className="btn-ghost w-full sm:w-auto">
            Explore Committees
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/35 transition-colors hover:text-ivory-400 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="font-sans text-[9.5px] uppercase tracking-widest2">Scroll</span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-ivory-500/70 to-transparent"
          style={{ transformOrigin: "top" }}
          animate={{ scaleY: [0.35, 1, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
