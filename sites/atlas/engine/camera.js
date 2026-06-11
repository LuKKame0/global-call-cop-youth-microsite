// Camera: world-space center + scale (screen px per world unit).
// Provides world↔screen mapping and animated flyTo.

import { WORLD, lonLatToWorld } from "./projection.js";
import { easings } from "./animator.js";

export class Camera {
  constructor(animator) {
    this.animator = animator;
    this.cx = WORLD / 2;
    this.cy = WORLD / 2;
    this.scale = 0.25;
    this.minScale = 0.05;
    this.maxScale = 64;
    this.viewWidth = 0;
    this.viewHeight = 0;
    this._flyCancel = null;
  }

  setViewport(width, height) {
    this.viewWidth = width;
    this.viewHeight = height;
    this.minScale = Math.min(width, height) / WORLD / 1.4;
  }

  applyTransform(ctx, dpr) {
    ctx.setTransform(
      dpr * this.scale,
      0,
      0,
      dpr * this.scale,
      dpr * (this.viewWidth / 2 - this.cx * this.scale),
      dpr * (this.viewHeight / 2 - this.cy * this.scale),
    );
  }

  screenToWorld(sx, sy) {
    return [
      this.cx + (sx - this.viewWidth / 2) / this.scale,
      this.cy + (sy - this.viewHeight / 2) / this.scale,
    ];
  }

  worldToScreen(wx, wy) {
    return [
      this.viewWidth / 2 + (wx - this.cx) * this.scale,
      this.viewHeight / 2 + (wy - this.cy) * this.scale,
    ];
  }

  panBy(dxScreen, dyScreen) {
    this.cx -= dxScreen / this.scale;
    this.cy -= dyScreen / this.scale;
    this._clamp();
    this.animator.invalidate();
  }

  // zoom keeping the world point under the cursor fixed
  zoomAt(sx, sy, factor) {
    const [wx, wy] = this.screenToWorld(sx, sy);
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    this.cx = wx - (sx - this.viewWidth / 2) / this.scale;
    this.cy = wy - (sy - this.viewHeight / 2) / this.scale;
    this._clamp();
    this.animator.invalidate();
  }

  flyTo({ lon, lat, scale, duration = 1100 }) {
    if (this._flyCancel) this._flyCancel();
    const [tx, ty] = lonLatToWorld(lon, lat);
    const targetScale = Math.max(this.minScale, Math.min(this.maxScale, scale ?? this.scale));
    const from = { cx: this.cx, cy: this.cy, scale: this.scale };
    this._flyCancel = this.animator.tween({
      duration,
      ease: easings.inOutCubic,
      update: (t) => {
        // interpolate scale logarithmically for a natural zoom feel
        this.scale = Math.exp(
          Math.log(from.scale) + (Math.log(targetScale) - Math.log(from.scale)) * t,
        );
        this.cx = from.cx + (tx - from.cx) * t;
        this.cy = from.cy + (ty - from.cy) * t;
        this._clamp();
        this.animator.invalidate();
      },
      done: () => {
        this._flyCancel = null;
      },
    });
  }

  _clamp() {
    const halfW = this.viewWidth / 2 / this.scale;
    const halfH = this.viewHeight / 2 / this.scale;
    const pad = WORLD * 0.45;
    this.cx = Math.max(halfW - pad, Math.min(WORLD - halfW + pad, this.cx));
    this.cy = Math.max(halfH - pad, Math.min(WORLD - halfH + pad, this.cy));
  }
}
