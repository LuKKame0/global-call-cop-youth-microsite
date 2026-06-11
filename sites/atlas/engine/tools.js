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
        this.atlas.camera.zoomAt(e.offsetX, e.offsetY, factor);
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
      this.brushing = true;
      const [wx, wy] = this.atlas.camera.screenToWorld(e.offsetX, e.offsetY);
      this.atlas.brush.begin(wx, wy, this.brushOptions);
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
        this.atlas.camera.zoomAt(
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          dist / this.pinchDist,
        );
      }
      this.pinchDist = dist;
      return;
    }

    if (this.brushing) {
      const [wx, wy] = this.atlas.camera.screenToWorld(e.offsetX, e.offsetY);
      this.atlas.brush.extend(wx, wy);
      this.atlas.animator.invalidate();
      return;
    }

    if (this.dragging && prev) {
      this.atlas.camera.panBy(e.offsetX - prev[0], e.offsetY - prev[1]);
      return;
    }

    // idle hover
    const [wx, wy] = this.atlas.camera.screenToWorld(e.offsetX, e.offsetY);
    if (this.onCursor) this.onCursor(wx, wy);
    const hit = this.atlas.hitCountry(wx, wy);
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

    if (wasDragging && !this.moved) {
      const [wx, wy] = this.atlas.camera.screenToWorld(e.offsetX, e.offsetY);
      if (this.tool === "marker") {
        this.atlas.markersUserAdd(wx, wy);
        return;
      }
      const hit = this.atlas.hitCountry(wx, wy);
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
