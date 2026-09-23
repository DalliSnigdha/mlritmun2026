"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { GlobeFallback } from "./GlobeFallback";

/* three.js is pulled in only once we have decided the device can take it —
 * and never on the server. Mounted once at the root layout, fixed to the
 * viewport, so it stays visible (and animating) across every section of the
 * page, not just the hero. */
const SiteScene = dynamic(() => import("./SiteScene"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

/** Cheap capability probe. Errs towards the 2D fallback when in any doubt. */
function canRender3D(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 2)
    return false;

  // A canvas keeps the first context type it is given, so each attempt needs
  // its own element — otherwise a failed "webgl2" probe poisons the "webgl" one.
  const supports = (type: string) => {
    try {
      return Boolean(document.createElement("canvas").getContext(type));
    } catch {
      return false;
    }
  };

  return supports("webgl2") || supports("webgl") || supports("experimental-webgl");
}

/** If WebGL dies mid-session (lost context, driver hiccup), drop to 2D quietly. */
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[MLRITMUN] 3D scene unavailable, using 2D fallback.", error);
  }

  render() {
    return this.state.failed ? <GlobeFallback /> : this.props.children;
  }
}

/** The site-wide 3D backdrop: a dark Earth curving below the horizon in
 *  the hero that fades into a plain starfield for every section after it.
 *  Fixed to the viewport and mounted once in the root layout — see
 *  layout.tsx, where (like CursorTrail) it sits early in `body` so normal
 *  DOM order keeps it behind all page content. */
export function SiteVisuals() {
  // Always start on the fallback so the server and first client paint agree.
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // Client-only capability probe: must run post-mount so SSR and the first
    // client paint agree, then upgrades once — a standard hydration-safe
    // escape hatch, not a cascading-render risk.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUse3D(canRender3D());
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden="true">
      {use3D ? (
        <SceneBoundary>
          <SiteScene />
        </SceneBoundary>
      ) : (
        <GlobeFallback />
      )}
    </div>
  );
}
