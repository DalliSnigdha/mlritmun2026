"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Committee } from "@/data/committees";
import { Icon } from "./ui/Icon";

interface Props {
  committee: Committee | null;
  onClose: () => void;
}

export function CommitteeModal({ committee, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape to close, scroll lock, and move focus into the dialog. */
  useEffect(() => {
    if (!committee) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [committee, onClose]);

  return (
    <AnimatePresence>
      {committee && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-blue-950/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="committee-modal-title"
            tabIndex={-1}
            className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-lg p-8 outline-none sm:rounded-sm sm:p-11"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-sm text-white/50 transition-colors hover:bg-white/5 hover:text-ivory-400"
              aria-label="Close"
            >
              <Icon name="close" size={19} />
            </button>

            <div className="flex items-center gap-3">
              <p className="eyebrow">Committee</p>
              {committee.special && (
                <span className="inline-flex items-center rounded-sm border border-ivory-500/40 px-2.5 py-1 font-sans text-[9.5px] font-semibold uppercase tracking-widest2 text-ivory-500">
                  Special Committee
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-5">
              <Image
                src={committee.crest}
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <p className="font-display text-5xl font-light leading-none tracking-tight ivory-text">
                {committee.special ? "?" : committee.abbr}
              </p>
            </div>

            <h2
              id="committee-modal-title"
              className="mt-5 pr-10 text-[14px] font-medium uppercase leading-[1.6] tracking-[0.1em] text-white"
            >
              {committee.special ? "Identity Withheld Until the Conference" : committee.name}
            </h2>

            <div className="mt-7 h-px w-full bg-ivory-line" />

            <p className="mt-7 text-[15.5px] leading-[1.8] text-white/70">
              {committee.special
                ? "This committee's name, format and portfolios are kept confidential and will only be revealed to registered delegates at the conference itself."
                : committee.description}
            </p>

            <dl className="mt-9 space-y-6">
              <div>
                <dt className="eyebrow">Agenda</dt>
                <dd className="mt-2 text-[15px] text-white/80">{committee.agenda}</dd>
              </div>

              {!committee.special && committee.difficulty && (
                <div>
                  <dt className="eyebrow">Suited To</dt>
                  <dd className="mt-2 text-[15px] text-white/80">
                    {committee.difficulty}
                  </dd>
                </div>
              )}
            </dl>

            <p className="mt-9 rounded-sm border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-[13px] leading-relaxed text-white/50">
              Executive Board details and country / portfolio allocations will be
              announced separately by the MLRITMUN organizing team.
            </p>

            <a href="#registration" onClick={onClose} className="btn-primary mt-8 w-full">
              Register for MLRITMUN
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
