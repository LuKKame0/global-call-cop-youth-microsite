// Single rAF scheduler. The atlas only repaints when something is animating
// or a layer/camera marked the frame dirty — keeps idle CPU at zero.

export const easings = {
  linear: (t) => t,
  inOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
};

export class Animator {
  constructor(onFrame) {
    this.onFrame = onFrame;
    this.tasks = new Set();
    this.dirty = true;
    this.running = false;
    this.paused = false;
    this.last = 0;
    this.elapsed = 0;
    this._tick = this._tick.bind(this);
  }

  add(task) {
    this.tasks.add(task);
    this.wake();
    return () => this.tasks.delete(task);
  }

  tween({ duration = 600, ease = easings.inOutCubic, update, done }) {
    let t = 0;
    const remove = this.add({
      update: (dt) => {
        t = Math.min(1, t + dt / (duration / 1000));
        update(ease(t));
        if (t >= 1) {
          remove();
          if (done) done();
        }
      },
    });
    return remove;
  }

  invalidate() {
    this.dirty = true;
    this.wake();
  }

  wake() {
    if (!this.running && !this.paused) {
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame(this._tick);
    }
  }

  setPaused(paused) {
    this.paused = paused;
    if (!paused) this.wake();
  }

  _tick(now) {
    if (this.paused) {
      this.running = false;
      return;
    }
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.elapsed += dt;
    for (const task of this.tasks) task.update(dt, this.elapsed);
    if (this.dirty || this.tasks.size > 0) {
      this.onFrame(this.elapsed);
      this.dirty = false;
    }
    if (this.tasks.size > 0 || this.dirty) {
      requestAnimationFrame(this._tick);
    } else {
      this.running = false;
    }
  }
}
