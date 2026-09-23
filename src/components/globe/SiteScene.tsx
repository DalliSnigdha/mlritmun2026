"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildEarthBackdrop } from "./buildEarthBackdrop";
import { buildStarfield } from "./buildStarfield";

/** Caps how visible the Earth backdrop gets even at its brightest. Kept
 *  high — a dim backdrop reads as blurry rather than a clear photo. */
const EARTH_OPACITY_CAP = 0.35;
/** How fast the Earth turns on its own, in radians/second. */
const EARTH_SPIN_SPEED = 0.075;
/** How much faster the clouds drift over the land than the Earth itself
 *  spins — the relative motion is what sells "clouds", not the spin alone. */
const CLOUD_DRIFT_SPEED = 0.017;
/** How far the pointer may tilt the Earth, in radians. */
const TILT = 0.04;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/* Plain three.js, no react-three-fiber — r3f's react-reconciler dependency
 * crashes under Next.js App Router's client bundling (see git history). A
 * manual rAF loop sidesteps that dependency entirely.
 *
 * This canvas is mounted once, fixed to the viewport, for the whole site —
 * a dark Earth curving below the horizon in the hero, fading into a faint
 * night sky for every section after it. */
export default function SiteScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;
    // Re-typed as a plain non-null binding: TypeScript's null-narrowing above
    // doesn't survive into the nested closures below, but an explicitly
    // non-nullable type on its own binding does.
    const canvas: HTMLCanvasElement = canvasNode;

    const starfield = buildStarfield();
    const earth = buildEarthBackdrop();

    const scene = new THREE.Scene();
    scene.add(starfield.points);
    scene.add(earth.group);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20);
    camera.position.set(0, 0, 3.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    window.addEventListener("pointermove", onPointerMove);

    // The hero section's own scroll position drives how much the Earth
    // dims once it's scrolled away.
    const heroEl = document.getElementById("home");

    const clock = new THREE.Clock();
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const delta = Math.min(clock.getDelta(), 0.05);

      // 0 while the hero fills the viewport, ramping to 1 as it scrolls out.
      let heroProgress = 0;
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        heroProgress = clamp01(-rect.top / Math.max(rect.height, 1));
      }
      const awayFactor = smoothstep(0, 1, heroProgress);

      const earthOpacity = (1 - awayFactor) * EARTH_OPACITY_CAP;
      earth.material.uniforms.uOpacity.value = earthOpacity;
      earth.cloudsMaterial.uniforms.uOpacity.value = earthOpacity;
      earth.earth.rotation.y += EARTH_SPIN_SPEED * delta;
      earth.clouds.rotation.y += CLOUD_DRIFT_SPEED * delta;

      target.x += (pointer.x - target.x) * (1 - Math.pow(0.0015, delta));
      target.y += (pointer.y - target.y) * (1 - Math.pow(0.0015, delta));
      earth.group.rotation.x = target.y * TILT;
      earth.group.rotation.z = -target.x * TILT * 0.6;
      starfield.setParallax(target.x, target.y);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      starfield.dispose();
      earth.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
    />
  );
}
