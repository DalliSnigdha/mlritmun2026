/* =============================================================================
 *  The Earth backdrop, built in plain three.js
 * =============================================================================
 *  A huge sphere sitting low and far behind the hero, its curve just
 *  breaking the horizon at the bottom of the frame — the "standing above
 *  the world" backdrop from the reference photo: a vivid blue ocean, dark
 *  landmasses lit by bloomy warm city lights that trace real coastlines
 *  (see buildCountryMap.ts), and a soft blue atmospheric rim. Nothing
 *  about the shading draws a line — no borders, no crisp edges — the way
 *  an actual long-exposure photo of the night side looks rather than a
 *  map illustration of one.
 * ========================================================================== */

import * as THREE from "three";
import { buildCountryMapTexture, OCEAN as OCEAN_HEX } from "./buildCountryMap";

const OCEAN = new THREE.Color(OCEAN_HEX);
const CITY_CORE = new THREE.Color("#FFD9A0");
const CITY_HALO = new THREE.Color("#E8935A");
const RIM = new THREE.Color("#5FA8E0");
const RIM_HOT = new THREE.Color("#DCEBFF");
const LIGHT_DIR = new THREE.Vector3(2.2, 1.6, 2.4).normalize();

const RADIUS = 7.5;
/** Centre well below and behind the hero, so only its topmost curve
 *  breaks the frame near the bottom, like a horizon. */
const CENTER = new THREE.Vector3(0, -8.15, -4.5);

const NOISE_GLSL = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float valueNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
          mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
          mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 4; i++) {
      sum += valueNoise(p) * amp;
      p *= 2.05;
      amp *= 0.55;
    }
    return sum;
  }
`;

function earthMaterial(map: THREE.CanvasTexture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uOcean: { value: OCEAN },
      uCityCore: { value: CITY_CORE },
      uCityHalo: { value: CITY_HALO },
      uRim: { value: RIM },
      uRimHot: { value: RIM_HOT },
      uLightDir: { value: LIGHT_DIR },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vPos;
      varying vec3 vViewDir;
      varying vec2 vMapUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        vMapUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uOcean;
      uniform vec3 uCityCore;
      uniform vec3 uCityHalo;
      uniform vec3 uRim;
      uniform vec3 uRimHot;
      uniform vec3 uLightDir;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying vec3 vViewDir;
      varying vec2 vMapUv;

      ${NOISE_GLSL}

      void main() {
        vec3 mapColor = texture2D(uMap, vMapUv).rgb;
        // The mask is the only thing the map texture is used for — a real
        // coastline shape, not a border to draw.
        float land = step(0.02, length(mapColor - uOcean));

        vec3 p = normalize(vPos);

        // Terrain variation within the real coastline — mountain-range-ish
        // ridges and desert-ish warmer patches, so land isn't one flat
        // fill. Ocean gets its own gentle depth variation too.
        float terrainFine = fbm(p * 9.0);
        float terrainCoarse = fbm(p * 2.6 + vec3(4.0, 9.0, 2.0));
        vec3 landWarm = mix(mapColor, mapColor * vec3(1.5, 1.15, 0.85), smoothstep(0.55, 0.75, terrainCoarse));
        vec3 landVaried = mix(mapColor * 0.82, landWarm, terrainFine);
        vec3 oceanVaried = mapColor * (0.88 + terrainFine * 0.3);
        vec3 base = mix(oceanVaried, landVaried, land);

        vec3 normal = normalize(vNormal);
        vec3 view = normalize(vViewDir);
        vec3 light = normalize(uLightDir);
        float diffuse = max(dot(normal, light), 0.0);
        float lighting = 0.13 + 0.16 * diffuse;

        // City lights as a soft bloom, not a hard dot: a bright core, a
        // wider dimmer halo at a coarser frequency, and a fine speckle on
        // top so lit regions break into individual clusters rather than
        // one glowing patch — closer to how light actually traces a real
        // coastline or river valley.
        float night = 1.0 - smoothstep(0.0, 0.4, diffuse);
        vec3 cp = p * 3.1;
        float cityRegion = fbm(cp + vec3(11.0, 4.0, 8.0));
        float cityDetail = fbm(cp * 3.0 + vec3(37.0, 91.0, 12.0));
        float citySpeckle = fbm(p * 26.0 + vec3(5.0, 17.0, 29.0));
        float core = smoothstep(0.52, 0.58, cityRegion) * smoothstep(0.46, 0.62, cityDetail);
        float halo = smoothstep(0.42, 0.56, cityRegion) * smoothstep(0.32, 0.6, cityDetail);
        float speckle = smoothstep(0.5, 0.78, citySpeckle) * smoothstep(0.4, 0.56, cityDetail);
        float lit = land * (0.55 + night * 0.45);
        vec3 cityGlow = (uCityCore * (core * 0.75 + speckle * 0.35) + uCityHalo * halo * 0.3) * lit;

        // A broad, soft atmospheric glow rather than a crisp edge, with a
        // tighter near-white highlight where the limb catches the most
        // light — the gradient a real photo's atmosphere scatters into.
        float grazing = 1.0 - max(dot(normal, view), 0.0);
        float rimSoft = pow(grazing, 1.9);
        float rimHot = pow(grazing, 5.5);
        vec3 rim = uRim * rimSoft * 0.16 + uRimHot * rimHot * 0.14;

        // Limb darkening — the grazing edge scatters more of its own
        // light away from the viewer, reading slightly darker than the
        // centre of the disc, the way a real planet does. Kept gentle so
        // the disc still reads bright and clear rather than fading out.
        float limb = pow(max(dot(normal, view), 0.0), 0.2);
        vec3 shaded = mix(base * 0.88, base, limb) * lighting;

        gl_FragColor = vec4(shaded + cityGlow + rim, uOpacity);
      }
    `,
    transparent: true,
  });
}

/** A wispy, semi-transparent cloud shell, a touch larger than the globe.
 *  Rotated at its own independent rate by the caller, it drifts visibly
 *  over the land beneath it — the single detail that most reads as "a
 *  real planet" rather than a lit sphere. Three noise scales — broad
 *  banks, medium swirl, fine wisp — read as one continuous weather
 *  system rather than a single soft blob. */
function cloudsMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLightDir: { value: LIGHT_DIR },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLightDir;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vPos;

      ${NOISE_GLSL}

      void main() {
        vec3 p = normalize(vPos);
        float broad = fbm(p * 2.1);
        float swirl = fbm(p * 4.6 + vec3(5.0, 2.0, 8.0)) * 0.5;
        float wisp = fbm(p * 10.0 + vec3(13.0, 27.0, 4.0)) * 0.25;
        float n = broad + swirl + wisp;
        // A tighter threshold reads as defined cloud banks; a wide one
        // spreads into an even haze that looks like blur.
        float cloud = smoothstep(0.62, 0.78, n);

        float diffuse = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
        float lighting = 0.65 + 0.3 * diffuse;

        gl_FragColor = vec4(vec3(1.0) * lighting, cloud * 0.55 * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}

export interface EarthBackdropHandles {
  /** Position/orient the whole planet (Earth + clouds together) from here. */
  group: THREE.Group;
  earth: THREE.Mesh;
  material: THREE.ShaderMaterial;
  clouds: THREE.Mesh;
  cloudsMaterial: THREE.ShaderMaterial;
  dispose: () => void;
}

export function buildEarthBackdrop(): EarthBackdropHandles {
  const group = new THREE.Group();
  group.position.copy(CENTER);

  const map = buildCountryMapTexture();
  const geometry = new THREE.SphereGeometry(RADIUS, 128, 128);
  const material = earthMaterial(map);
  const earth = new THREE.Mesh(geometry, material);
  group.add(earth);

  const cloudsGeo = new THREE.SphereGeometry(RADIUS * 1.012, 96, 96);
  const cloudsMat = cloudsMaterial();
  const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
  group.add(clouds);

  return {
    group,
    earth,
    material,
    clouds,
    cloudsMaterial: cloudsMat,
    dispose: () => {
      map.dispose();
      geometry.dispose();
      material.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
    },
  };
}
