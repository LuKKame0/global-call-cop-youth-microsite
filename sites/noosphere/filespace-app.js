// FILESPACE — fly through a real directory tree in 3D.
// Reuses the noosphere Renderer (data-art) + projected DOM labels, but drives
// it with a hierarchical navigator instead of a static universe.

import * as THREE from "./vendor/three.module.min.js";
import { Renderer } from "./engine/renderer.js";
import { supported, pickRoot, readPreview } from "./engine/filesystem.js";
import { levelCorpus, buildLevelField } from "./engine/filespace.js";

const el = (id) => document.getElementById(id);
const canvas = el("field");
const labelLayer = el("labels");

let renderer = null;
let field = null;
let current = null; // DirNode
let labels = []; // { body, node }
let domains = {};

// ── Mount gate ───────────────────────────────────────────────────────
if (!supported()) {
  el("gate-hint").textContent = "This browser lacks the File System Access API. Use Chrome or Edge.";
  el("open-btn").disabled = true;
}
el("open-btn").addEventListener("click", async () => {
  try {
    const root = await pickRoot();
    el("gate").style.display = "none";
    await navigateTo(root, { initial: true });
  } catch (e) {
    if (e?.name !== "AbortError") el("gate-hint").textContent = "Could not open folder: " + e.message;
  }
});

// ── Navigate into a directory (drill-down rebuilds the field) ────────
async function navigateTo(dirNode, { initial = false } = {}) {
  el("b-cursor").textContent = `reading ${dirNode.name}/ …`;
  const entries = await dirNode.read();
  current = dirNode;

  const corpus = levelCorpus(dirNode, entries);
  domains = corpus.domains;
  field = buildLevelField(corpus);

  if (!renderer) {
    renderer = new Renderer(canvas, field);
    resize();
    startLoop();
  } else {
    swapField(field, corpus);
  }
  // gentle fly-in: start close on the core, pull back to frame the level
  renderer.orbit.dist = 30;
  renderer.orbit.distT = 96;
  renderer.target.set(0, 0, 0);

  buildLabels();
  buildLegend();
  buildBreadcrumb();
  el("up-btn").hidden = !dirNode.parent;
  const dirs = entries.filter((e) => e.isDir).length;
  el("counts").textContent = `${dirs} folders · ${entries.length - dirs} files`;
  el("b-cursor").textContent = "drag orbit · wheel zoom · click folder to enter";
  el("inspector").hidden = true;
}

// rebuild renderer scene objects for a new level
function swapField(newField, corpus) {
  renderer.scene.remove(renderer.bodyPoints, renderer.edgeLines, renderer.wellGroup, renderer.nebulaGroup);
  renderer.field = newField;
  renderer._buildNebulae();
  renderer._buildWells();
  renderer._buildEdges();
  renderer._buildBodies();
}

// ── Projected DOM labels (folders bigger/brighter) ──────────────────
function buildLabels() {
  for (const l of labels) l.node.remove();
  labels = field.bodies.map((b) => {
    const node = document.createElement("div");
    node.className = "lbl lbl-body" + (b.isDir ? " lbl-dir" : "");
    node.style.setProperty("--lc", domains[b.domain]?.color ?? "#fff");
    node.textContent = b.isSelf ? b.title : b.title + (b.isDir ? "/" : "");
    labelLayer.appendChild(node);
    return { body: b, node };
  });
}

function updateLabels() {
  for (const l of labels) {
    const b = l.body;
    const p = renderer.project(b.x, b.y, b.z);
    if (!p.visible) { l.node.style.opacity = "0"; continue; }
    const sel = renderer.selected === b;
    l.node.classList.toggle("sel", sel);
    const base = b.isSelf ? 1 : b.isDir ? 0.95 : Math.max(0.18, Math.min(1, (200 - p.dist) / 110));
    l.node.style.opacity = String(sel ? 1 : base);
    l.node.style.transform = `translate(-50%,-50%) translate(${p.x + 9}px,${p.y}px)`;
  }
}

// ── Legend + breadcrumb ──────────────────────────────────────────────
function buildLegend() {
  const legend = el("legend");
  legend.innerHTML = "";
  const present = new Set(field.bodies.map((b) => b.domain));
  for (const [key, d] of Object.entries(domains)) {
    if (!present.has(key)) continue;
    const row = document.createElement("div");
    row.className = "leg-row";
    row.innerHTML = `<span class="leg-dot" style="background:${d.color}"></span>${d.label}`;
    legend.appendChild(row);
  }
}

function buildBreadcrumb() {
  const bc = el("breadcrumb");
  bc.innerHTML = "";
  const chain = [];
  let n = current;
  while (n) { chain.unshift(n); n = n.parent; }
  chain.forEach((node, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "crumb-sep";
      sep.textContent = "/";
      bc.appendChild(sep);
    }
    const c = document.createElement("span");
    c.className = "crumb" + (node === current ? " here" : "");
    c.textContent = node.name;
    c.addEventListener("click", () => { if (node !== current) navigateTo(node); });
    bc.appendChild(c);
  });
}

el("up-btn").addEventListener("click", () => { if (current?.parent) navigateTo(current.parent); });

// ── Inspector + enter-folder ─────────────────────────────────────────
function bar(v) { return `<div class="bar"><i style="width:${Math.round(v * 100)}%"></i></div>`; }
async function inspect(b) {
  if (b.isSelf) return;
  renderer.selected = b;
  renderer.focusOn(b);
  const insp = el("inspector");
  insp.hidden = false;
  el("insp-domain").textContent = (domains[b.domain]?.label ?? b.domain).toUpperCase();
  el("insp-title").textContent = b.title;
  const fmtSize = b.size ? (b.size < 1024 ? b.size + " B" : b.size < 1e6 ? (b.size / 1024).toFixed(1) + " KB" : (b.size / 1e6).toFixed(1) + " MB") : "—";
  el("insp-props").innerHTML = [
    ["TYPE", b.isDir ? "FOLDER" : (domains[b.domain]?.label ?? "FILE")],
    ["SIZE", fmtSize],
  ].map(([k, v]) => `<div class="prop"><div class="pk">${k}</div><div class="pv">${v}</div></div>`).join("");
  const out = el("insp-out");
  const enter = el("enter-btn");
  if (b.isDir) {
    enter.hidden = false;
    out.hidden = true;
    enter.onclick = () => navigateTo(current.childDir(b._entry));
  } else {
    enter.hidden = true;
    out.hidden = false;
    out.textContent = "◍ reading…";
    out.textContent = await readPreview(b._entry.handle);
  }
}
el("insp-close").addEventListener("click", () => { el("inspector").hidden = true; renderer.selected = null; });

// ── Pointer: orbit + pick + double-click to enter ───────────────────
let dragging = false, moved = false, last = [0, 0], lastClick = 0;
canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = false; last = [e.offsetX, e.offsetY]; });
canvas.addEventListener("pointermove", (e) => {
  if (!renderer) return;
  if (dragging) {
    const dx = e.offsetX - last[0], dy = e.offsetY - last[1];
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    renderer.orbitBy(dx * 0.003, -dy * 0.003);
    last = [e.offsetX, e.offsetY];
  } else {
    canvas.style.cursor = renderer.screenToRayHit(e.offsetX, e.offsetY) ? "pointer" : "grab";
  }
});
canvas.addEventListener("pointerup", (e) => {
  dragging = false;
  if (moved || !renderer) return;
  const hit = renderer.screenToRayHit(e.offsetX, e.offsetY);
  if (!hit || hit.isSelf) return;
  const now = performance.now();
  const dbl = now - lastClick < 350 && renderer.selected === hit;
  lastClick = now;
  if (hit.isDir && dbl) { navigateTo(current.childDir(hit._entry)); return; }
  inspect(hit);
});
canvas.addEventListener("wheel", (e) => { e.preventDefault(); if (renderer) renderer.zoomBy(Math.exp(e.deltaY * 0.0012)); }, { passive: false });

// ── Loop ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (renderer) renderer.resize(window.innerWidth, window.innerHeight, dpr);
}
window.addEventListener("resize", resize);
function startLoop() {
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    field.step(dt);
    renderer.render(clock.elapsedTime);
    updateLabels();
  }
  frame();
}

window.__fs = { get current() { return current; }, get field() { return field; }, get renderer() { return renderer; } };
