"use client";

import { useRef } from "react";

/** Maximum tilt in degrees — enough to read as 3D, restrained enough to stay chic. */
const MAX_TILT = 7;

/** The cursor-tilt effect every card on the site shares. Mutates the DOM
 *  style directly instead of going through React state, so tilting never
 *  triggers a re-render. */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduceMotion = useRef(false);

  const handleMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && reduceMotion.current === false) {
      reduceMotion.current = Boolean(
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
      );
    }
    if (reduceMotion.current) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return { ref, handleMove, handleLeave };
}
