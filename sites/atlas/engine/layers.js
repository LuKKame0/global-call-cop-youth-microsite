// Layer system. Each layer: { id, visible, draw(ctx, camera, t) } and
// optionally hitTest(wx, wy). Geometry lives in world space (see projection),
// so drawing is a single canvas transform — no per-frame reprojection.

import { WORLD, lonLatToWorld, flowControlPoint } from "./projection.js";

// ── Graticule ────────────────────────────────────────────────────────
export class GraticuleLayer {
  constructor({ step = 15, color = "rgba(120,160,200,0.10)" } = {}) {
    this.id = "graticule";
    this.visible = true;
    this.color = color;
    this.path = new Path2D();
    for (let lon = -180; lon <= 180; lon += step) {
      for (let lat = -85; lat < 85; lat += 2) {
        const [x1, y1] = lonLatToWorld(lon, lat);
        const [x2, y2] = lonLatToWorld(lon, lat + 2);
        this.path.moveTo(x1, y1);
        this.path.lineTo(x2, y2);
      }
    }
    for (let lat = -75; lat <= 75; lat += step) {
      const [x0, y0] = lonLatToWorld(-180, lat);
      this.path.moveTo(x0, y0);
      for (let lon = -178; lon <= 180; lon += 2) {
        const [x, y] = lonLatToWorld(lon, lat);
        this.path.lineTo(x, y);
      }
    }
  }

  draw(ctx, camera) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1 / camera.scale;
    ctx.stroke(this.path);
  }
}

// ── Political base (countries) ───────────────────────────────────────
export class PoliticalLayer {
  constructor(features, meta = {}) {
    this.id = "political";
    this.visible = true;
    this.hoverId = null;
    this.selectedId = null;
    this.choropleth = null; // { values: Map<id, 0..1>, ramp: (v) => color }
    this.style = {
      fill: "#101820",
      stroke: "rgba(140,180,215,0.35)",
      hoverFill: "rgba(55,171,250,0.22)",
      selectedFill: "rgba(55,171,250,0.30)",
      selectedStroke: "#37ABFA",
    };
    this.countries = features
      .filter((f) => f.polygons.length)
      .map((f) => {
        const path = new Path2D();
        const bounds = [Infinity, Infinity, -Infinity, -Infinity];
        for (const polygon of f.polygons) {
          for (const ring of polygon) {
            // unwrap longitudes so antimeridian-crossing rings (Russia, Fiji)
            // stay continuous instead of streaking across the map
            let prevLon = null;
            ring.forEach(([lon, lat], i) => {
              if (prevLon != null) {
                while (lon - prevLon > 180) lon -= 360;
                while (lon - prevLon < -180) lon += 360;
              }
              prevLon = lon;
              const [x, y] = lonLatToWorld(lon, lat);
              if (i === 0) path.moveTo(x, y);
              else path.lineTo(x, y);
              bounds[0] = Math.min(bounds[0], x);
              bounds[1] = Math.min(bounds[1], y);
              bounds[2] = Math.max(bounds[2], x);
              bounds[3] = Math.max(bounds[3], y);
            });
            path.closePath();
          }
        }
        return { id: f.id, name: f.properties.name, meta: meta[f.id], path, bounds };
      });
    this.byId = new Map(this.countries.map((c) => [c.id, c]));
  }

  draw(ctx, camera) {
    const lw = 1 / camera.scale;
    for (const c of this.countries) {
      let fill = this.style.fill;
      if (this.choropleth?.values.has(c.id)) {
        fill = this.choropleth.ramp(this.choropleth.values.get(c.id));
      }
      ctx.fillStyle = fill;
      ctx.fill(c.path);
      ctx.strokeStyle = this.style.stroke;
      ctx.lineWidth = lw;
      ctx.stroke(c.path);
    }
    if (this.hoverId != null && this.hoverId !== this.selectedId) {
      const c = this.byId.get(this.hoverId);
      if (c) {
        ctx.fillStyle = this.style.hoverFill;
        ctx.fill(c.path);
      }
    }
    if (this.selectedId != null) {
      const c = this.byId.get(this.selectedId);
      if (c) {
        ctx.fillStyle = this.style.selectedFill;
        ctx.fill(c.path);
        ctx.strokeStyle = this.style.selectedStroke;
        ctx.lineWidth = 2 / camera.scale;
        ctx.stroke(c.path);
      }
    }
  }

  // isPointInPath tests the point in DEVICE space against the CTM-transformed
  // path, so we set the camera transform and pass device coordinates.
  hitTest(ctx, camera, dpr, wx, wy) {
    const [sx, sy] = camera.worldToScreen(wx, wy);
    const dx = sx * dpr;
    const dy = sy * dpr;
    camera.applyTransform(ctx, dpr);
    for (const c of this.countries) {
      if (wx < c.bounds[0] || wx > c.bounds[2] || wy < c.bounds[1] || wy > c.bounds[3]) {
        continue;
      }
      if (ctx.isPointInPath(c.path, dx, dy)) return c;
    }
    return null;
  }
}

// ── Flows (animated arcs between points — coordination/traffic/etc) ─
export class FlowLayer {
  constructor() {
    this.id = "flows";
    this.visible = true;
    this.flows = []; // { ax,ay,cx,cy,bx,by, color, phase, speed }
  }

  addFlow(lonA, latA, lonB, latB, { color = "#37ABFA", speed = 0.5 } = {}) {
    const [ax, ay] = lonLatToWorld(lonA, latA);
    const [bx, by] = lonLatToWorld(lonB, latB);
    const [cx, cy] = flowControlPoint(ax, ay, bx, by);
    this.flows.push({ ax, ay, cx, cy, bx, by, color, phase: Math.random(), speed });
  }

  clear() {
    this.flows = [];
  }

  draw(ctx, camera, t) {
    const lw = 1.4 / camera.scale;
    for (const f of this.flows) {
      const progress = (t * f.speed + f.phase) % 1;
      ctx.strokeStyle = f.color;
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(f.ax, f.ay);
      ctx.quadraticCurveTo(f.cx, f.cy, f.bx, f.by);
      ctx.stroke();
      // moving packet (quadratic bezier point at `progress`)
      const u = 1 - progress;
      const px = u * u * f.ax + 2 * u * progress * f.cx + progress * progress * f.bx;
      const py = u * u * f.ay + 2 * u * progress * f.cy + progress * progress * f.by;
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(px, py, 2.6 / camera.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

// ── Markers (pulsing geolocated points) ──────────────────────────────
export class MarkerLayer {
  constructor() {
    this.id = "markers";
    this.visible = true;
    this.markers = []; // { x, y, color, label, phase }
  }

  addMarker(lon, lat, { color = "#FF460D", label = "" } = {}) {
    const [x, y] = lonLatToWorld(lon, lat);
    this.markers.push({ x, y, color, label, phase: Math.random() * Math.PI * 2 });
  }

  clear() {
    this.markers = [];
  }

  draw(ctx, camera, t) {
    const base = 3 / camera.scale;
    for (const m of this.markers) {
      const pulse = (t * 1.1 + m.phase) % 1;
      ctx.strokeStyle = m.color;
      ctx.globalAlpha = (1 - pulse) * 0.6;
      ctx.lineWidth = 1.2 / camera.scale;
      ctx.beginPath();
      ctx.arc(m.x, m.y, base * (1 + pulse * 2.4), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(m.x, m.y, base, 0, Math.PI * 2);
      ctx.fill();
      if (m.label && camera.scale > 0.6) {
        ctx.font = `${11 / camera.scale}px ui-monospace, monospace`;
        ctx.fillStyle = "rgba(220,235,250,0.9)";
        ctx.fillText(m.label, m.x + base * 2, m.y - base);
      }
    }
  }
}

// ── Brush (freehand annotation strokes in world space) ──────────────
export class BrushLayer {
  constructor() {
    this.id = "brush";
    this.visible = true;
    this.strokes = []; // { points: [[x,y]...], color, width }
    this.active = null;
  }

  begin(wx, wy, { color = "#FF91FE", width = 3 } = {}) {
    this.active = { points: [[wx, wy]], color, width };
    this.strokes.push(this.active);
  }

  extend(wx, wy) {
    if (!this.active) return;
    const pts = this.active.points;
    const [lx, ly] = pts[pts.length - 1];
    // decimate: skip points closer than half a world unit
    if ((wx - lx) ** 2 + (wy - ly) ** 2 > 0.25) pts.push([wx, wy]);
  }

  end() {
    this.active = null;
  }

  undo() {
    this.strokes.pop();
  }

  clear() {
    this.strokes = [];
    this.active = null;
  }

  draw(ctx, camera) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of this.strokes) {
      if (s.points.length < 2) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width / camera.scale;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(s.points[0][0], s.points[0][1]);
      for (let i = 1; i < s.points.length; i += 1) {
        ctx.lineTo(s.points[i][0], s.points[i][1]);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}
