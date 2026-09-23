/* =============================================================================
 *  The site starfield, built in plain three.js
 * =============================================================================
 *  Every earlier version of this file built some kind of centrepiece —
 *  a globe, a wreath, a particle planet, an iridescent orb — and every one
 *  of them got rejected in turn. This is deliberately NOT another
 *  centrepiece: just a wide, faint scatter of points behind the page, with
 *  a little pointer-driven parallax so it still reads as alive. It fills
 *  the full width of the viewport (including the sides a centred object
 *  always left empty) rather than sitting in one spot for the eye to
 *  fixate on and reject.
 * ========================================================================== */

import * as THREE from "three";

export interface StarfieldHandles {
  points: THREE.Points;
  /** Nudge the field slightly opposite the pointer for a parallax feel. */
  setParallax: (x: number, y: number) => void;
  dispose: () => void;
}

export function buildStarfield(): StarfieldHandles {
  const STAR_COUNT = 1700;
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    // Wide enough to still have stars near the edges of an ultrawide
    // viewport, not just the centre column a hero object used to occupy.
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = -3 - Math.random() * 8;
    // Mostly small points, with an occasional larger "hero" star among
    // them — a flat size distribution reads as static noise, a few
    // stand-outs read as a sky.
    sizes[i] = Math.random() < 0.06 ? 2.6 + Math.random() * 2.2 : 1.1 + Math.random() * 1.6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float size;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (9.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      void main() {
        // A bright core plus a softer glow halo — a plain circular falloff
        // reads as a faint smudge at this size; layering the two reads as
        // an actual point of light.
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.22, 0.0, d);
        float glow = smoothstep(0.5, 0.0, d);
        float a = core + glow * 0.55;
        gl_FragColor = vec4(vec3(1.0, 0.98, 0.94), a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);

  function setParallax(x: number, y: number) {
    // A small counter-drift — the field leans slightly away from the
    // pointer, the way a distant background does against a foreground.
    points.position.x = -x * 0.35;
    points.position.y = -y * 0.25;
  }

  return {
    points,
    setParallax,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
