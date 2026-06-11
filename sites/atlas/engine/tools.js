// Pointer tooling: pan/zoom always available; the active tool decides what
// click/drag means (select country, paint brush, drop marker). Pinch-zoom
// supported via two pointers.

export class PointerManager {
  constructor(canvas, atlas) {
    this.canvas = canvas;
    this.atlas = atlas;
    this.tool = "select"; // select | brush | marker | pan
    this.brushOptions = { color: "#FF91FE", width: 3 };
    this.onSelect = null;
    this.onHover = null;
    this.onCursor = null;
    this.pointers = new Map();
    this.dragging = false;
    this.brushing = false;
    this.pinchDist = 0;
    this.moved = false;

    canvas.addEventListener("pointerdown", (e) => this._down(e));
    canvas.addEventListener("pointermove", (e) => this._move(e));
    canvas.addEventListener("pointerup", (e) => this._up(e));
    canvas.addEventListener("pointercancel", (e) => this._up(e));
    canvas.addEventListener("pointerleave", () => {
      if (this.onHover) this.onHover(null);
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.0015);
        this.atlas.viewZoomAt(e.offsetX, e.offsetY, factor);
        // settle to full-res after the wheel burst (3D raster)
        clearTimeout(this._wheelTimer);
        this._wheelTimer = setTimeout(() => this.atlas.viewEndInteraction(), 160);
      },
      { passive: false },
    );
  }

  setTool(tool) {
    this.tool = tool;
    this.canvas.style.cursor =
      tool === "brush" ? "crosshair" : tool === "marker" ? "copy" : "grab";
  }

  _down(e) {
    this.canvas.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, [e.offsetX, e.offsetY]);
    this.moved = false;
    if (this.pointers.size === 2) {
      this.pinchDist = this._pinchDistance();
      return;
    }
    if (this.tool === "brush") {
      const w = this.atlas.viewScreenToWorld(e.offsetX, e.offsetY);
      if (!w) return; // off the globe disc
      this.brushing = true;
      this.atlas.brush.begin(w[0], w[1], this.brushOptions);
      this.atlas.animator.invalidate();
    } else {
      this.dragging = true;
      this.canvas.style.cursor = "grabbing";
    }
  }

  _move(e) {
    const prev = this.pointers.get(e.pointerId);
    if (prev) {
      this.pointers.set(e.pointerId, [e.offsetX, e.offsetY]);
      this.moved = true;
    }

    if (this.pointers.size === 2) {
      const dist = this._pinchDistance();
      if (this.pinchDist > 0) {
        const [a, b] = [...this.pointers.values()];
        this.atlas.viewZoomAt(
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          dist / this.pinchDist,
        );
      }
      this.pinchDist = dist;
      return;
    }

    if (this.brushing) {
      const w = this.atlas.viewScreenToWorld(e.offsetX, e.offsetY);
      if (w) {
        this.atlas.brush.extend(w[0], w[1]);
        this.atlas.animator.invalidate();
      }
      return;
    }

    if (this.dragging && prev) {
      this.atlas.viewPanBy(e.offsetX - prev[0], e.offsetY - prev[1]);
      return;
    }

    // idle hover
    const w = this.atlas.viewScreenToWorld(e.offsetX, e.offsetY);
    if (!w) {
      if (this.atlas.political.hoverId != null) {
        this.atlas.political.hoverId = null;
        this.atlas.animator.invalidate();
        if (this.onHover) this.onHover(null);
      }
      return;
    }
    const [wx, wy] = w;
    if (this.onCursor) this.onCursor(wx, wy);
    const hit = this.atlas.hitCountry(wx, wy, e.offsetX, e.offsetY);
    const hitId = hit ? hit.id : null;
    if (hitId !== this.atlas.political.hoverId) {
      this.atlas.political.hoverId = hitId;
      this.atlas.animator.invalidate();
      if (this.onHover) this.onHover(hit);
    }
  }

  _up(e) {
    this.pointers.delete(e.pointerId);
    this.pinchDist = 0;

    if (this.brushing) {
      this.atlas.brush.end();
      this.brushing = false;
      return;
    }

    const wasDragging = this.dragging;
    this.dragging = false;
    this.setTool(this.tool); // restore cursor
    this.atlas.viewEndInteraction();

    if (wasDragging && !this.moved) {
      const w = this.atlas.viewScreenToWorld(e.offsetX, e.offsetY);
      if (!w) return;
      const [wx, wy] = w;
      if (this.tool === "marker") {
        this.atlas.markersUserAdd(wx, wy);
        return;
      }
      const hit = this.atlas.hitCountry(wx, wy, e.offsetX, e.offsetY);
      this.atlas.political.selectedId = hit ? hit.id : null;
      this.atlas.animator.invalidate();
      if (this.onSelect) this.onSelect(hit);
    }
  }

  _pinchDistance() {
    const [a, b] = [...this.pointers.values()];
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }
}
