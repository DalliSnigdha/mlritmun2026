"use client";

import { useEffect, useRef } from "react";

const SQUARE_COUNT = 7;
const SIZE_START = 13;
const SIZE_END = 4;

/**
 * A chain of small square outlines trailing the cursor across the whole
 * page — replaces the earlier soft radial glow. Each square eases toward
 * the one ahead of it (the first eases toward the pointer itself), the
 * classic "cursor trail" effect, rather than one shape following the
 * pointer directly. Mounted once in the root layout; see layout.tsx.
 */
export function CursorTrail() {
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // A meaningful "cursor" only exists with a fine pointer; skip touch
    // devices and anyone who has asked for reduced motion.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = !window.matchMedia?.("(pointer: fine)").matches;
    if (reduceMotion || coarsePointer) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const positions = Array.from({ length: SQUARE_COUNT }, () => ({ x: target.x, y: target.y }));
    let frame = 0;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    function tick() {
      frame = requestAnimationFrame(tick);
      let leadX = target.x;
      let leadY = target.y;

      positions.forEach((pos, i) => {
        const ease = i === 0 ? 0.35 : 0.3;
        pos.x += (leadX - pos.x) * ease;
        pos.y += (leadY - pos.y) * ease;

        const el = squareRefs.current[i];
        if (el) {
          const rotation = 45 + i * 7;
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;
        }

        leadX = pos.x;
        leadY = pos.y;
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      {Array.from({ length: SQUARE_COUNT }, (_, i) => {
        const size = SIZE_START - ((SIZE_START - SIZE_END) * i) / (SQUARE_COUNT - 1);
        const opacity = 0.5 - (0.36 * i) / (SQUARE_COUNT - 1);
        return (
          <div
            key={i}
            ref={(el) => {
              squareRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 border border-ivory-500"
            style={{ width: size, height: size, opacity, willChange: "transform" }}
          />
        );
      })}
    </div>
  );
}
