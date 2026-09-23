/* =============================================================================
 *  The land-mask texture, built from real geographic data
 * =============================================================================
 *  Procedural noise can suggest "continents" but can never draw an actual
 *  recognisable coastline — that needs real border coordinates. This bakes
 *  the Natural Earth country boundaries (public-domain data, bundled via
 *  the `world-atlas` package, at its lowest simplification level — this
 *  is a small decorative backdrop, not a navigable map) into a flat
 *  equirectangular canvas: land and ocean only, no outlines. A real
 *  satellite photo of the night side doesn't show political borders
 *  either — it shows terrain and city lights — so this earlier version's
 *  gold border strokes were the one thing making it read as a drawing
 *  rather than a photo. Wrapped onto the Earth backdrop sphere as an
 *  ordinary texture; the shader in buildEarthBackdrop.ts uses it purely
 *  as a land/ocean mask.
 * ========================================================================== */

import type { GeoJsonProperties, MultiPolygon, Polygon, Position } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
// The 50m (rather than 110m) simplification — finer coastline detail for a
// backdrop that's now bright and vivid enough for that detail to matter.
import worldAtlas from "world-atlas/countries-50m.json";
import * as THREE from "three";

const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1024;
/** Exported so buildEarthBackdrop.ts's shader can match this exactly —
 *  it needs the identical ocean colour to tell land from water in the
 *  sampled texture. A vivid blue rather than a near-black navy: the
 *  reference photo's ocean is bright, not dark. */
export const OCEAN = "#124A85";
export const LAND = "#140f1a";

function project(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * MAP_WIDTH, ((90 - lat) / 180) * MAP_HEIGHT];
}

/** A ring as a Path2D, breaking into a new sub-path wherever a point jumps
 *  more than half the map's width — the antimeridian seam a flat
 *  equirectangular projection can't otherwise avoid stretching a line
 *  across. Imperfect, but this is a stylised backdrop, not a navigable map. */
function ringToPath(ring: Position[]): Path2D {
  const path = new Path2D();
  let prevX: number | null = null;
  ring.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    if (i === 0 || (prevX !== null && Math.abs(x - prevX) > MAP_WIDTH * 0.5)) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
    prevX = x;
  });
  path.closePath();
  return path;
}

export function buildCountryMapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_WIDTH;
  canvas.height = MAP_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = OCEAN;
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  const topology = worldAtlas as unknown as Topology;
  const countriesObject = topology.objects.countries as GeometryCollection<GeoJsonProperties>;
  const countries = feature(topology, countriesObject);

  for (const country of countries.features) {
    const geom = country.geometry;
    if (!geom) continue;

    const polygons: Position[][][] =
      geom.type === "Polygon"
        ? [(geom as Polygon).coordinates]
        : geom.type === "MultiPolygon"
          ? (geom as MultiPolygon).coordinates
          : [];

    for (const rings of polygons) {
      rings.forEach((ring, i) => {
        const path = ringToPath(ring);
        // The outer ring is land; any ring after it is a hole (an
        // enclave like San Marino) punched back down to ocean colour.
        // Adjacent countries share the same fill, so no border shows
        // between them — just one continuous, accurately-shaped coastline.
        ctx.fillStyle = i === 0 ? LAND : OCEAN;
        ctx.fill(path);
      });
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
