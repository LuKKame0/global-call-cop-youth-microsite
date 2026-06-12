// FileSpace — turns one directory level into a navigable 3D constellation
// using the existing Field + Renderer. The current dir is the origin star;
// children orbit it. Folders are large blue cores you can fly into.

import { Field } from "./field.js";
import { KIND_DEF } from "./filesystem.js";

// build a single-level corpus { domains, bodies, edges } from a DirNode's
// children, so Field/Renderer render it like any other universe
export function levelCorpus(dirNode, entries) {
  const domains = {};
  for (const [key, def] of Object.entries(KIND_DEF)) {
    domains[key] = { label: def.label, color: def.color };
  }

  const bodies = [];
  const edges = [];

  // the directory itself — the anchor at the center
  bodies.push({
    id: "__self__",
    title: dirNode.name + "/",
    domain: "folder",
    mass: 1,
    energy: 0.2,
    entropy: 0.2,
    temperature: 0.1,
    isSelf: true,
    isDir: true,
    terms: [],
    _entry: null,
  });

  entries.forEach((e, i) => {
    const sizeMass = e.isDir ? 0.7 : Math.min(0.7, Math.log10((e.size || 1) + 10) / 6);
    bodies.push({
      id: "e" + i,
      title: e.name,
      domain: e.kind,
      mass: 0.25 + sizeMass,
      energy: e.isDir ? 0.5 : 0.35,
      entropy: e.isDir ? 0.4 : 0.55,
      temperature: e.isDir ? 0.5 : 0.7,
      isDir: e.isDir,
      size: e.size || 0,
      terms: [],
      _entry: e,
    });
    // tether every child to the directory core (semantic gravity = containment)
    edges.push({ a: "__self__", b: "e" + i, w: e.isDir ? 0.5 : 0.35 });
  });

  return { domains, bodies, edges };
}

// Field tuned for hierarchy: the self-node is pinned at the origin, children
// arrange in a shell around it (folders inner ring, files outer).
export function buildLevelField(corpus) {
  const field = new Field(corpus, { radius: 46 });
  const self = field.byId.get("__self__");
  if (self) {
    self.x = self.y = self.z = 0;
    self.vx = self.vy = self.vz = 0;
    self.pinned = true;
  }
  // re-seed children: folders on an inner ring, files on an outer ring
  const dirs = field.bodies.filter((b) => b.isDir && !b.isSelf);
  const files = field.bodies.filter((b) => !b.isDir);
  placeRing(dirs, 22, 0);
  placeRing(files, 38, 0.4);
  return field;
}

function placeRing(bodies, radius, zJitter) {
  bodies.forEach((b, i) => {
    const a = i * 2.3999; // golden angle
    const r = radius + (i % 3) * 4;
    b.x = Math.cos(a) * r;
    b.y = Math.sin(a) * r;
    b.z = Math.sin(a * 1.7) * 6 * zJitter;
    b.vx = b.vy = b.vz = 0;
  });
}
