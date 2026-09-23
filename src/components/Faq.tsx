"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faqs } from "@/data/faq";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="shell">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="05 — Questions"
              title={
                <>
                  Frequently
                  <br />
                  Asked
                </>
              }
              intro="Don't see your question? Slide into our inbox — the address is just below."
            />
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-white/[0.08]">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <Reveal
                    as="li"
                    key={faq.question}
                    delay={0.03 * i}
                    y={12}
                    className="border-b border-white/[0.08]"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={`text-[16px] font-normal leading-snug transition-colors duration-300 sm:text-[17px] ${
                            isOpen
                              ? "text-white"
                              : "text-white/70 group-hover:text-white"
                          }`}
                        >
                          {faq.question}
                        </span>
                        <span
                          className={`mt-0.5 shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "rotate-180 text-ivory-400"
                              : "text-white/35 group-hover:text-ivory-500"
                          }`}
                        >
                          <Icon name="chevron" size={18} />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pr-10 text-[15px] leading-[1.8] text-white/55">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
