// Orthographic globe renderer — 3D mode without WebGL or dependencies.
//
// Country fills are rasterized per pixel from an equirectangular "id map"
// (one Uint16 country index per pixel, built once). Per frame:
//   1. mapping pass  — globe pixel → id-map index (only when rotation/zoom
//                      changes; half-res while dragging, full-res on idle)
//   2. color pass    — palette lookup + 1px border detection (cheap, runs
//                      when hover/selection/choropleth/segment changes)
// Vector overlays (graticule, flows, markers, labels, brush) are forward-
// projected with hemisphere culling. Hit-testing is an O(1) id-map lookup.

import { WORLD, worldToLonLat } from "./projection.js";
import { easings } from "./animator.js";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const IDW = 2048; // id-map resolution (equirectangular)
const IDH = 1024;

export class GlobeRenderer {
  constructor(atlas) {
    this.atlas = atlas;
    this.lon0 = 0;
    this.lat0 = 20;
    this.radius = 300; // screen px
    this.minRadius = 120;
    this.maxRadius = 4000;
    this.interacting = false;
    this._flyCancel = null;

    this._idMap = null; // Uint16Array [IDW*IDH], 0 = ocean, i+1 = country index
    this._mapping = null; // Int32Array globe px → id-map idx (-1 outside disc)
    this._mappingKey = "";
    this._image = null;
    this._imageSize = 0;
    this._colorCache = new Map();
    this._parserCtx = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    });

    this._buildIdMap();
  }

  // ── id map: rasterize countries once in equirectangular space ──────
  _buildIdMap() {
    const canvas = document.createElement("canvas");
    canvas.width = IDW;
    canvas.height = IDH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const countries = this.atlas.political.countries;
    countries.forEach((c, i) => {
      const index = i + 1;
      ctx.fillStyle = `rgb(${index & 255},${(index >> 8) & 255},0)`;
      ctx.beginPath();
      for (const ring of c.rings) {
        ring.forEach(([lon, lat], k) => {
          const x = ((lon + 180) / 360) * IDW;
          const y = ((90 - lat) / 180) * IDH;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
      ctx.fill();
    });
    const data = ctx.getImageData(0, 0, IDW, IDH).data;
    this._idMap = new Uint16Array(IDW * IDH);
    for (let i = 0; i < IDW * IDH; i += 1) {
      this._idMap[i] = data[i * 4] | (data[i * 4 + 1] << 8);
    }
  }

  // ── projection ──────────────────────────────────────────────────────
  // forward: lon/lat → [sx, sy, visible]
  project(lon, lat, cx, cy) {
    const φ = lat * D2R;
    const λ = (lon - this.lon0) * D2R;
    const φ0 = this.lat0 * D2R;
    const cosφ = Math.cos(φ);
    const x = cosφ * Math.sin(λ);
    const y = Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * cosφ * Math.cos(λ);
    const z = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * cosφ * Math.cos(λ);
    return [cx + x * this.radius, cy - y * this.radius, z > 0];
  }

  // inverse: screen → [lon, lat] | null (outside the disc)
  invert(sx, sy, cx, cy) {
    const x = (sx - cx) / this.radius;
    const y = (cy - sy) / this.radius;
    const d2 = x * x + y * y;
    if (d2 > 1) return null;
    const z = Math.sqrt(1 - d2);
    const φ0 = this.lat0 * D2R;
    const lat = Math.asin(z * Math.sin(φ0) + y * Math.cos(φ0)) * R2D;
    const lon =
      this.lon0 + Math.atan2(x, z * Math.cos(φ0) - y * Math.sin(φ0)) * R2D;
    return [((lon + 540) % 360) - 180, lat];
  }

  center() {
    return [this.atlas.camera.viewWidth / 2, this.atlas.camera.viewHeight / 2];
  }

  // mercator-equivalent scale, so labels/widths match 2D behavior
  eqScale() {
    return (2 * Math.PI * this.radius) / WORLD;
  }

  // ── interaction ─────────────────────────────────────────────────────
  // drag-to-rotate: content follows the cursor like a 2D pan
  rotateBy(dxScreen, dyScreen) {
    const degPerPx = 60 / this.radius;
    this.lon0 = ((this.lon0 - dxScreen * degPerPx + 540) % 360) - 180;
    this.lat0 = Math.max(-89, Math.min(89, this.lat0 + dyScreen * degPerPx));
    this.interacting = true;
    this.atlas.animator.invalidate();
  }

  zoomBy(factor) {
    this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.radius * factor));
    this.interacting = true;
    this.atlas.animator.invalidate();
  }

  endInteraction() {
    this.interacting = false;
    this.atlas.animator.invalidate(); // full-res repaint
  }

  flyTo({ lon, lat, scale, duration = 1100 }) {
    if (this._flyCancel) this._flyCancel();
    const targetR = scale
      ? Math.max(this.minRadius, Math.min(this.maxRadius, (scale * WORLD) / (2 * Math.PI)))
      : this.radius;
    const from = { lon: this.lon0, lat: this.lat0, r: this.radius };
    let dLon = lon - from.lon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    this._flyCancel = this.atlas.animator.tween({
      duration,
      ease: easings.inOutCubic,
      update: (t) => {
        this.lon0 = from.lon + dLon * t;
        this.lat0 = from.lat + (lat - from.lat) * t;
        this.radius = Math.exp(Math.log(from.r) + (Math.log(targetR) - Math.log(from.r)) * t);
        this.interacting = t < 1;
        this.atlas.animator.invalidate();
      },
      done: () => {
        this._flyCancel = null;
      },
    });
  }

  hitCountry(sx, sy) {
    const [cx, cy] = this.center();
    const ll = this.invert(sx, sy, cx, cy);
    if (!ll) return null;
    const ix = Math.min(IDW - 1, Math.floor(((ll[0] + 180) / 360) * IDW));
    const iy = Math.min(IDH - 1, Math.floor(((90 - ll[1]) / 180) * IDH));
    const index = this._idMap[iy * IDW + ix];
    return index ? this.atlas.political.countries[index - 1] : null;
  }

  // ── palette (final fill color per country index) ────────────────────
  _color(css) {
    let c = this._colorCache.get(css);
    if (!c) {
      this._parserCtx.fillStyle = css;
      this._parserCtx.fillRect(0, 0, 1, 1);
      c = [...this._parserCtx.getImageData(0, 0, 1, 1).data];
      this._colorCache.set(css, c);
    }
    return c;
  }

  _blend(base, over) {
    const a = over[3] / 255;
    return [
      Math.round(base[0] * (1 - a) + over[0] * a),
      Math.round(base[1] * (1 - a) + over[1] * a),
      Math.round(base[2] * (1 - a) + over[2] * a),
      255,
    ];
  }

  _pack([r, g, b]) {
    return (255 << 24) | (b << 16) | (g << 8) | r;
  }

  _buildPalette() {
    const pol = this.atlas.political;
    const n = pol.countries.length;
    const fills = new Uint32Array(n + 1);
    const active = new Uint8Array(n + 1);
    pol.countries.forEach((c, i) => {
      const isActive = pol.inRegion(c);
      active[i + 1] = isActive ? 1 : 0;
      let fill = this._color(isActive ? pol.style.fill : pol.style.dimFill);
      if (isActive && pol.choropleth?.values.has(c.id)) {
        fill = this._color(pol.choropleth.ramp(pol.choropleth.values.get(c.id)));
      }
      if (c.id === pol.hoverId && c.id !== pol.selectedId) {
        fill = this._blend(fill, this._color(pol.style.hoverFill));
      }
      if (c.id === pol.selectedId) {
        fill = this._blend(fill, this._color(pol.style.selectedFill));
      }
      fills[i + 1] = this._pack(fill);
    });
    return { fills, active };
  }

  // ── raster ──────────────────────────────────────────────────────────
  _ensureBuffers(size) {
    if (this._imageSize !== size) {
      this._image = new ImageData(size, size);
      this._mapping = new Int32Array(size * size);
      this._imageSize = size;
      this._mappingKey = "";
    }
  }

  _computeMapping(size, step) {
    // globe pixel → id-map index; step>1 = low-res (fill blocks) while dragging
    const m = this._mapping;
    const half = size / 2;
    const φ0 = this.lat0 * D2R;
    const sinφ0 = Math.sin(φ0);
    const cosφ0 = Math.cos(φ0);
    const lonOff = this.lon0;
    for (let py = 0; py < size; py += step) {
      const y = (half - py) / half;
      for (let px = 0; px < size; px += step) {
        const x = (px - half) / half;
        const d2 = x * x + y * y;
        let v = -1;
        if (d2 <= 1) {
          const z = Math.sqrt(1 - d2);
          const lat = Math.asin(z * sinφ0 + y * cosφ0) * R2D;
          const lon = lonOff + Math.atan2(x, z * cosφ0 - y * sinφ0) * R2D;
          const ix = Math.floor((((lon + 540) % 360) / 360) * IDW);
          const iy = Math.min(IDH - 1, Math.floor(((90 - lat) / 180) * IDH));
          v = iy * IDW + ix;
        }
        for (let by = 0; by < step && py + by < size; by += 1) {
          const row = (py + by) * size + px;
          for (let bx = 0; bx < step && px + bx < size; bx += 1) {
            m[row + bx] = v;
          }
        }
      }
    }
  }

  render(ctx, t) {
    const atlas = this.atlas;
    const dpr = atlas.dpr;
    const [cx, cy] = this.center();
    const rasterDpr = Math.min(dpr, 1.5);
    const size = Math.min(4096, Math.ceil(this.radius * 2 * rasterDpr));
    this._ensureBuffers(size);

    const step = this.interacting ? 2 : 1;
    const key = `${this.lon0.toFixed(3)}|${this.lat0.toFixed(3)}|${size}|${step}`;
    if (key !== this._mappingKey) {
      this._computeMapping(size, step);
      this._mappingKey = key;
    }

    // color + border pass
    const { fills, active } = this._buildPalette();
    const idMap = this._idMap;
    const mapping = this._mapping;
    const out = new Uint32Array(this._image.data.buffer);
    const borderActive = this._pack(this._color("rgba(140,180,215,255)"));
    const borderDim = this._pack(this._color("rgba(60,80,100,255)"));
    const ocean = this._pack(this._color("#0a1018"));
    for (let i = 0; i < mapping.length; i += 1) {
      const mi = mapping[i];
      if (mi < 0) {
        out[i] = 0;
        continue;
      }
      const id = idMap[mi];
      out[i] = id ? fills[id] : ocean;
    }
    // 1px borders where neighbors differ (skip while dragging low-res)
    if (step === 1) {
      for (let i = 0; i < mapping.length - size - 1; i += 1) {
        const mi = mapping[i];
        if (mi < 0) continue;
        const id = idMap[mi];
        const mr = mapping[i + 1];
        const md = mapping[i + size];
        const idr = mr < 0 ? id : idMap[mr];
        const idd = md < 0 ? id : idMap[md];
        if (id !== idr || id !== idd) {
          const anyActive = active[id] || active[idr] || active[idd];
          out[i] = anyActive ? borderActive : borderDim;
        }
      }
    }

    // composite: atmosphere → raster disc → horizon → vector overlays
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const glow = ctx.createRadialGradient(cx, cy, this.radius * 0.95, cx, cy, this.radius * 1.12);
    glow.addColorStop(0, "rgba(55,171,250,0.16)");
    glow.addColorStop(1, "rgba(55,171,250,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, this.radius * 1.12, 0, Math.PI * 2);
    ctx.fill();

    const scratch = GlobeRenderer._scratch(size);
    scratch.ctx.putImageData(this._image, 0, 0);
    ctx.drawImage(scratch.canvas, cx - this.radius, cy - this.radius, this.radius * 2, this.radius * 2);

    ctx.strokeStyle = "rgba(140,180,215,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    this._drawOverlays(ctx, cx, cy, t);
  }

  static _scratch(size) {
    if (!this.__scratch || this.__scratch.canvas.width !== size) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      this.__scratch = { canvas, ctx: canvas.getContext("2d") };
    }
    return this.__scratch;
  }

  // ── vector overlays (hemisphere-culled forward projection) ─────────
  _polyline(ctx, points, cx, cy) {
    // points: array of [lon, lat]; breaks the stroke when it goes behind
    let pen = false;
    for (const [lon, lat] of points) {
      const [sx, sy, vis] = this.project(lon, lat, cx, cy);
      if (!vis) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(sx, sy);
      else ctx.moveTo(sx, sy);
      pen = true;
    }
  }

  _drawOverlays(ctx, cx, cy, t) {
    const atlas = this.atlas;

    if (atlas.graticule.visible) {
      ctx.strokeStyle = atlas.graticule.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let lon = -180; lon < 180; lon += 15) {
        const line = [];
        for (let lat = -85; lat <= 85; lat += 3) line.push([lon, lat]);
        this._polyline(ctx, line, cx, cy);
      }
      for (let lat = -75; lat <= 75; lat += 15) {
        const line = [];
        for (let lon = -180; lon <= 180; lon += 3) line.push([lon, lat]);
        this._polyline(ctx, line, cx, cy);
      }
      ctx.stroke();
    }

    if (atlas.flows.visible) {
      for (const f of atlas.flows.flows) {
        const samples = [];
        for (let s = 0; s <= 40; s += 1) {
          const u = s / 40;
          const v = 1 - u;
          const wx = v * v * f.ax + 2 * v * u * f.cx + u * u * f.bx;
          const wy = v * v * f.ay + 2 * v * u * f.cy + u * u * f.by;
          samples.push(worldToLonLat(wx, wy));
        }
        ctx.strokeStyle = f.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        this._polyline(ctx, samples, cx, cy);
        ctx.stroke();
        const progress = (t * f.speed + f.phase) % 1;
        const [plon, plat] = samples[Math.round(progress * 40)];
        const [sx, sy, vis] = this.project(plon, plat, cx, cy);
        if (vis) {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    if (atlas.markers.visible) {
      for (const m of atlas.markers.markers) {
        const [lon, lat] = worldToLonLat(m.x, m.y);
        const [sx, sy, vis] = this.project(lon, lat, cx, cy);
        if (!vis) continue;
        const pulse = (t * 1.1 + m.phase) % 1;
        ctx.strokeStyle = m.color;
        ctx.globalAlpha = (1 - pulse) * 0.6;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 * (1 + pulse * 2.4), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
        if (m.label) {
          ctx.font = "10px ui-monospace, monospace";
          ctx.textAlign = "left";
          ctx.fillStyle = "rgba(220,235,250,0.9)";
          ctx.fillText(m.label, sx + 7, sy - 4);
        }
      }
    }

    if (atlas.labels.visible) {
      ctx.font = "10px ui-monospace, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const eqScale = this.eqScale();
      const placed = [];
      let shown = 0;
      const pol = atlas.political;
      for (const l of atlas.labels.items) {
        if (shown >= 90) break;
        if (l.area * eqScale * eqScale < 2200) continue;
        const [lon, lat] = worldToLonLat(l.x, l.y);
        const [sx, sy, vis] = this.project(lon, lat, cx, cy);
        if (!vis) continue;
        const w = l.name.length * 6.2 + 8;
        const rect = [sx - w / 2, sy - 8, sx + w / 2, sy + 8];
        if (placed.some((r) => rect[0] < r[2] && rect[2] > r[0] && rect[1] < r[3] && rect[3] > r[1])) {
          continue;
        }
        placed.push(rect);
        shown += 1;
        const isActive = !pol.regionFilter || pol.byId.get(l.id)?.meta?.[5] === pol.regionFilter;
        ctx.fillStyle =
          pol.selectedId === l.id
            ? "rgba(55,171,250,0.95)"
            : isActive
              ? "rgba(205,222,238,0.72)"
              : "rgba(205,222,238,0.16)";
        ctx.fillText(l.name, sx, sy);
      }
    }

    if (atlas.brush.visible) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const s of atlas.brush.strokes) {
        if (s.points.length < 2) continue;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        this._polyline(
          ctx,
          s.points.map(([wx, wy]) => worldToLonLat(wx, wy)),
          cx,
          cy,
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}
