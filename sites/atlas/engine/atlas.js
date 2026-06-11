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
} from "./layers.js";
import { PointerManager } from "./tools.js";

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
    this.layers = [this.graticule, this.political, this.flows, this.markers, this.brush];

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

  hitCountry(wx, wy) {
    return this.political.hitTest(this.ctx, this.camera, this.dpr, wx, wy);
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
    this.camera.applyTransform(ctx, dpr);
    for (const layer of this.layers) {
      if (layer.visible) layer.draw(ctx, this.camera, t);
    }
  }

  destroy() {
    window.removeEventListener("resize", this._resize);
  }
}
