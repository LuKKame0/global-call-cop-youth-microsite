// Atlas — facade that wires canvas, camera, animator, layers and tools.
//
//   const atlas = await Atlas.create(canvas, {
//     topologyUrl: "./data/countries-110m.json",
//     meta: COUNTRY_META,
//   });
//   atlas.political.choropleth = { values, ramp };
//   atlas.flows.addFlow(lonA, latA, lonB, latB, { color });
//   atlas.camera.flyTo({ lon, lat, scale: 2 });

import { Animator } from "./animator.js";
import { Camera } from "./camera.js";
import { decodeTopology } from "./topojson.js";
import { worldToLonLat } from "./projection.js";
import {
  GraticuleLayer,
  PoliticalLayer,
  FlowLayer,
  MarkerLayer,
  BrushLayer,
  LabelLayer,
} from "./layers.js";
import { PointerManager } from "./tools.js";
import { GlobeRenderer } from "./globe.js";
import { WORLD, lonLatToWorld } from "./projection.js";

export class Atlas {
  static async create(canvas, options) {
    const res = await fetch(options.topologyUrl);
    if (!res.ok) throw new Error(`topology fetch failed: ${res.status}`);
    const topology = await res.json();
    const exclude = new Set(options.exclude ?? []);
    const features = decodeTopology(topology, options.object ?? "countries").filter(
      (f) => !exclude.has(f.id),
    );
    return new Atlas(canvas, features, options);
  }

  constructor(canvas, features, { meta = {}, background = "#070b10" } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.background = background;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.animator = new Animator((t) => this._render(t));
    this.camera = new Camera(this.animator);

    this.graticule = new GraticuleLayer();
    this.political = new PoliticalLayer(features, meta);
    this.flows = new FlowLayer();
    this.markers = new MarkerLayer();
    this.brush = new BrushLayer();
    this.labels = new LabelLayer(this.political);
    this.layers = [
      this.graticule,
      this.political,
      this.flows,
      this.markers,
      this.labels,
      this.brush,
    ];

    this.mode = "2d"; // "2d" mercator | "3d" orthographic globe
    this.globe = new GlobeRenderer(this);

    this.pointer = new PointerManager(canvas, this);
    this.markerOptions = { color: "#FF460D" };

    this._resize = this._resize.bind(this);
    window.addEventListener("resize", this._resize);
    this._resize();

    document.addEventListener("visibilitychange", () => {
      this.animator.setPaused(document.hidden);
    });

    // continuous time only while animated layers have content
    this._pulseTask = null;
    this._syncPulse();
  }

  // keep rAF running only when flows/markers need continuous animation
  _syncPulse() {
    const needsPulse =
      (this.flows.visible && this.flows.flows.length > 0) ||
      (this.markers.visible && this.markers.markers.length > 0);
    if (needsPulse && !this._pulseTask) {
      this._pulseTask = this.animator.add({ update: () => {} });
    } else if (!needsPulse && this._pulseTask) {
      this._pulseTask();
      this._pulseTask = null;
    }
    this.animator.invalidate();
  }

  markersUserAdd(wx, wy) {
    const [lon, lat] = worldToLonLat(wx, wy);
    this.markers.addMarker(lon, lat, this.markerOptions);
    this._syncPulse();
  }

  setLayerVisible(id, visible) {
    const layer = this.layers.find((l) => l.id === id);
    if (layer) layer.visible = visible;
    this._syncPulse();
  }

  cursorLonLat(wx, wy) {
    return worldToLonLat(wx, wy);
  }

  // ── projection-agnostic view interface (PointerManager + app use this) ──
  setMode(mode) {
    if (mode === this.mode) return;
    if (mode === "3d") {
      // carry the current view over: scale ↔ globe radius, center ↔ rotation
      const [lon, lat] = worldToLonLat(this.camera.cx, this.camera.cy);
      this.globe.lon0 = lon;
      this.globe.lat0 = Math.max(-89, Math.min(89, lat));
      this.globe.radius = Math.max(
        this.globe.minRadius,
        Math.min(this.globe.maxRadius, (this.camera.scale * WORLD) / (2 * Math.PI)),
      );
      this.globe.endInteraction();
    } else {
      const [wx, wy] = lonLatToWorld(this.globe.lon0, this.globe.lat0);
      this.camera.cx = wx;
      this.camera.cy = wy;
      this.camera.scale = Math.max(
        this.camera.minScale,
        Math.min(this.camera.maxScale, (this.globe.radius * 2 * Math.PI) / WORLD),
      );
    }
    this.mode = mode;
    this.animator.invalidate();
  }

  viewPanBy(dx, dy) {
    if (this.mode === "3d") this.globe.rotateBy(dx, dy);
    else this.camera.panBy(dx, dy);
  }

  viewZoomAt(sx, sy, factor) {
    if (this.mode === "3d") this.globe.zoomBy(factor);
    else this.camera.zoomAt(sx, sy, factor);
  }

  viewEndInteraction() {
    if (this.mode === "3d") this.globe.endInteraction();
  }

  // returns world coords or null (3D: cursor off the globe disc)
  viewScreenToWorld(sx, sy) {
    if (this.mode === "3d") {
      const [cx, cy] = this.globe.center();
      const ll = this.globe.invert(sx, sy, cx, cy);
      return ll ? lonLatToWorld(ll[0], ll[1]) : null;
    }
    return this.camera.screenToWorld(sx, sy);
  }

  flyTo(view) {
    if (this.mode === "3d") this.globe.flyTo(view);
    else this.camera.flyTo(view);
  }

  hitCountry(wx, wy, sx, sy) {
    if (this.mode === "3d") return this.globe.hitCountry(sx, sy);
    return this.political.hitTest(this.ctx, this.camera, this.dpr, wx, wy);
  }

  // segment a region: highlight it, dim the rest; null clears
  setRegion(region) {
    this.political.regionFilter = region;
    this.animator.invalidate();
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.camera.setViewport(rect.width, rect.height);
    this.animator.invalidate();
  }

  _render(t) {
    const { ctx, dpr } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.mode === "3d") {
      this.globe.render(ctx, t);
      return;
    }
    this.camera.applyTransform(ctx, dpr);
    for (const layer of this.layers) {
      if (layer.visible) layer.draw(ctx, this.camera, t, dpr);
    }
  }

  destroy() {
    window.removeEventListener("resize", this._resize);
  }
}
