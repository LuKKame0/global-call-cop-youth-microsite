// Web Mercator projection into a square "world space" of WORLD x WORLD units.
// All layers store geometry in world space; the camera maps world → screen.

export const WORLD = 4096;
const MAX_LAT = 85.05112878;
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export function lonLatToWorld(lon, lat) {
  const clamped = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const x = ((lon + 180) / 360) * WORLD;
  const sin = Math.sin(clamped * D2R);
  const y =
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * WORLD;
  return [x, y];
}

export function worldToLonLat(x, y) {
  const lon = (x / WORLD) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / WORLD;
  const lat = R2D * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

// great-circle midpoint elevated control for flow curves (world space approx)
export function flowControlPoint(ax, ay, bx, by, bend = 0.22) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  return [mx - dy * bend, my + dx * bend];
}
