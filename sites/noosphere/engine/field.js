// THE FIELD — quasi-physical substrate of the noosphere.
//
// Bodies (documents/ideas) move under named laws. This is the "cuasi-físico
// / termodinámico" layer: not decoration, it actually governs the layout.
//
//   LEY I  · GRAVEDAD SEMÁNTICA  — related bodies attract (edge weight + domain)
//   LEY II · PRESIÓN DE ENTROPÍA — every body repels every other (anti-collapse)
//   LEY III· DERIVA DE DOMINIO   — each domain has an attractor well; bodies fall toward theirs
//   LEY IV · DISIPACIÓN          — velocity decays (the medium has viscosity)
//   LEY V  · CONSERVACIÓN        — total kinetic energy is tracked (HUD reads it)
//
// Energy/temperature/entropy come from the corpus and modulate emission and
// glow in the renderer; here they bias motion (hot bodies drift more freely).

const TWO_PI = Math.PI * 2;

export class Field {
  constructor(corpus, { radius = 60 } = {}) {
    this.radius = radius;
    this.domains = corpus.domains;
    this.domainKeys = Object.keys(corpus.domains);

    // domain wells = cardinal constellations on a gently-domed plane (LEY III).
    // Mostly flat (small z) so the space reads like a map of dream-regions
    // rather than a disorienting 3D cloud.
    this.wells = {};
    this.domainKeys.forEach((key, i) => {
      const a = (i / this.domainKeys.length) * TWO_PI - Math.PI / 2;
      this.wells[key] = {
        x: Math.cos(a) * radius * 0.66,
        y: Math.sin(a) * radius * 0.66,
        z: Math.sin(a * 2) * 4, // subtle dome, keeps depth cues without chaos
        angle: a,
      };
    });

    // bodies seeded in a tight disc around their well (deterministic spread,
    // so each domain reads as a constellation, not a scatter)
    const perDomain = {};
    this.bodies = corpus.bodies.map((b) => {
      const w = this.wells[b.domain] ?? { x: 0, y: 0, z: 0 };
      const k = (perDomain[b.domain] = (perDomain[b.domain] ?? 0) + 1);
      const a = k * 2.3999; // golden-angle phyllotaxis around the well
      const r = 3 + Math.sqrt(k) * 3.2;
      return {
        ...b,
        x: w.x + Math.cos(a) * r,
        y: w.y + Math.sin(a) * r,
        z: w.z + Math.sin(a * 1.7) * 2,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: 0.6 + b.mass * 1.8,
        pinned: false,
      };
    });
    this.byId = new Map(this.bodies.map((b) => [b.id, b]));

    this.edges = corpus.edges
      .map((e) => ({ a: this.byId.get(e.a), b: this.byId.get(e.b), w: e.w }))
      .filter((e) => e.a && e.b);

    this.kineticEnergy = 0;
    this.systemEntropy = 0;
  }

  addBody(body) {
    const b = {
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      vx: 0, vy: 0, vz: 0,
      mass: 0.3, energy: 1, entropy: 0.5, temperature: 0.9,
      radius: 0.9, pinned: false,
      domain: this.domainKeys[0],
      terms: [],
      ...body,
    };
    this.bodies.push(b);
    this.byId.set(b.id, b);
    return b;
  }

  linkBodies(idA, idB, w = 0.6) {
    const a = this.byId.get(idA);
    const b = this.byId.get(idB);
    if (a && b) this.edges.push({ a, b, w });
  }

  step(dt) {
    const bodies = this.bodies;
    const n = bodies.length;
    const k = Math.min(dt, 0.05);

    // LEY II — entropy pressure: pairwise repulsion (O(n²), fine for ~hundreds)
    for (let i = 0; i < n; i += 1) {
      const a = bodies[i];
      for (let j = i + 1; j < n; j += 1) {
        const b = bodies[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        let d2 = dx * dx + dy * dy + dz * dz + 0.01;
        // softer, shorter-range repulsion → bodies settle into legible spacing
        if (d2 > 400) continue;
        const rep = (4 / d2) * (1 + (a.entropy + b.entropy) * 0.4);
        const inv = 1 / Math.sqrt(d2);
        dx *= inv; dy *= inv; dz *= inv;
        a.vx += dx * rep * k; a.vy += dy * rep * k; a.vz += dz * rep * k;
        b.vx -= dx * rep * k; b.vy -= dy * rep * k; b.vz -= dz * rep * k;
      }
    }

    // LEY I — semantic gravity: edges pull, slack proportional to weight
    for (const e of this.edges) {
      const { a, b, w } = e;
      let dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
      const rest = 14 - w * 8;
      const force = (d - rest) * 0.06 * w;
      dx /= d; dy /= d; dz /= d;
      a.vx += dx * force * k; a.vy += dy * force * k; a.vz += dz * force * k;
      b.vx -= dx * force * k; b.vy -= dy * force * k; b.vz -= dz * force * k;
    }

    // LEY III — domain drift + LEY IV dissipation + integrate
    let ke = 0;
    for (const a of bodies) {
      if (!a.pinned) {
        const w = this.wells[a.domain];
        if (w) {
          // stronger cohesion so constellations hold their shape
          const pull = 0.08 * (1.2 - a.temperature * 0.6);
          a.vx += (w.x - a.x) * pull * k;
          a.vy += (w.y - a.y) * pull * k;
          a.vz += (w.z - a.z) * pull * k;
        }
        // heavier viscosity → calm, dream-like drift instead of jitter
        const damp = 1 - (1.8 + a.temperature * 0.3) * k;
        a.vx *= Math.max(0, damp); a.vy *= Math.max(0, damp); a.vz *= Math.max(0, damp);
        a.x += a.vx * k * 8; a.y += a.vy * k * 8; a.z += a.vz * k * 8;
      }
      ke += a.vx * a.vx + a.vy * a.vy + a.vz * a.vz;
    }

    // LEY V — conservation readout (HUD)
    this.kineticEnergy = ke / n;
    // system entropy proxy: mean pairwise spread vs ideal packing
    this.systemEntropy = Math.min(1, this.kineticEnergy * 2 + 0.2);
    return this.kineticEnergy;
  }

  nearest(x, y, z, maxDist = 4) {
    let best = null;
    let bestD = maxDist * maxDist;
    for (const b of this.bodies) {
      const dx = b.x - x, dy = b.y - y, dz = b.z - z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < bestD) { bestD = d2; best = b; }
    }
    return best;
  }
}
