// NOOSPHERE — orchestrator. Wires field (physics) + renderer (data-art) +
// AI service (NIM contract) + HUD into one navigable, interoperable universe.

import * as THREE from "./vendor/three.module.min.js";
import { Field } from "./engine/field.js";
import { Renderer } from "./engine/renderer.js";
import { createAI } from "./engine/ai.js";
import { SAMPLE_CORPUS } from "./data/corpus.sample.js";

// Prefer a locally-generated real corpus (data/corpus.json, gitignored);
// fall back to the synthetic sample shipped in the public repo.
let corpus = SAMPLE_CORPUS;
try {
  const res = await fetch("./data/corpus.json");
  if (res.ok) corpus = await res.json();
} catch {
  /* sample corpus */
}
const field = new Field(corpus);
const canvas = document.getElementById("field");
const renderer = new Renderer(canvas, field);
const ai = createAI(); // MockAIService until a NIM config is injected

// ── HUD refs ─────────────────────────────────────────────────────────
const el = (id) => document.getElementById(id);
const mKe = el("m-ke"), mEntropy = el("m-entropy"), mBodies = el("m-bodies"), mDomains = el("m-domains");
const inspector = el("inspector");
const bCursor = el("b-cursor");

// ── Legend (domains, toggleable) ─────────────────────────────────────
const legend = el("legend");
const domainOff = new Set();
for (const [key, d] of Object.entries(corpus.domains)) {
  const row = document.createElement("div");
  row.className = "leg-row";
  row.innerHTML = `<span class="leg-dot" style="background:${d.color}"></span>${d.label}`;
  row.addEventListener("click", () => {
    row.classList.toggle("off");
    if (domainOff.has(key)) domainOff.delete(key);
    else domainOff.add(key);
  });
  legend.appendChild(row);
}

// ── Inspector ────────────────────────────────────────────────────────
function bar(v) { return `<div class="bar"><i style="width:${Math.round(v * 100)}%"></i></div>`; }
function showInspector(b) {
  renderer.selected = b;
  inspector.hidden = false;
  el("insp-domain").textContent = (corpus.domains[b.domain]?.label ?? b.domain).toUpperCase();
  el("insp-title").textContent = b.title ?? b.id;
  el("insp-props").innerHTML = [
    ["TEMP", b.temperature], ["ENERGY", b.energy], ["ENTROPY", b.entropy], ["MASS", b.mass],
  ].map(([k, v]) => `<div class="prop"><div class="pk">${k}</div><div class="pv">${(+v).toFixed(2)}</div>${bar(+v)}</div>`).join("");
  el("insp-terms").innerHTML = (b.terms ?? []).map((t) => `<span class="term">${t.term}</span>`).join("");
  el("insp-out").hidden = true;
  el("insp-out").textContent = "";
  renderer.focusOn(b);
}
el("insp-close").addEventListener("click", () => { inspector.hidden = true; renderer.selected = null; });
el("insp-synth").addEventListener("click", async () => {
  const b = renderer.selected;
  if (!b) return;
  const out = el("insp-out");
  out.hidden = false;
  out.textContent = "◍ querying NIM…";
  el("ai-status").textContent = "NIM · THINKING ◍";
  const text = await ai.generate(`${b.title}\nterms: ${(b.terms ?? []).map((t) => t.term).join(", ")}`);
  out.textContent = text;
  el("ai-status").textContent = "NIM · MOCK ◍";
});

// ── Tools ────────────────────────────────────────────────────────────
let tool = "navigate";
let linkSource = null;
const tools = document.querySelectorAll("[data-tool]");
function setTool(t) {
  tool = t;
  linkSource = null;
  tools.forEach((b) => b.classList.toggle("is-active", b.dataset.tool === t));
  bCursor.textContent =
    t === "forge" ? "click empty space to forge an idea-body"
    : t === "link" ? "click two bodies to bind them"
    : "drag orbit · wheel zoom · click body";
}
tools.forEach((b) => b.addEventListener("click", () => setTool(b.dataset.tool)));
setTool("navigate");

// ── Forge (create idea-bodies; AI proposes domain) ──────────────────
const forgePrompt = el("forge-prompt");
const forgeInput = el("forge-input");
let forgeAt = null;
function openForge(worldPos) {
  forgeAt = worldPos;
  forgePrompt.hidden = false;
  forgeInput.value = "";
  forgeInput.focus();
}
forgeInput.addEventListener("keydown", async (e) => {
  if (e.key === "Escape") { forgePrompt.hidden = true; return; }
  if (e.key !== "Enter" || !forgeInput.value.trim()) return;
  const title = forgeInput.value.trim();
  forgePrompt.hidden = true;
  const labels = Object.keys(corpus.domains);
  const { label } = await ai.classify(title, labels);
  const id = "forged-" + Date.now();
  const body = field.addBody({
    id, title, domain: label,
    mass: 0.25, energy: 1, entropy: 0.6, temperature: 0.95,
    terms: title.toLowerCase().split(/\s+/).slice(0, 4).map((term) => ({ term, count: 1 })),
  });
  if (forgeAt) { body.x = forgeAt.x; body.y = forgeAt.y; body.z = forgeAt.z; }
  // gravitate toward existing bodies in the same domain
  for (const other of field.bodies) {
    if (other !== body && other.domain === label) field.linkBodies(id, other.id, 0.45);
  }
  rebuild();
  showInspector(body);
});

// rebuild GPU buffers after topology change (forge/link)
function rebuild() {
  renderer.scene.remove(renderer.bodyPoints, renderer.edgeLines);
  renderer._buildBodies();
  renderer._buildEdges();
}

// ── Pointer: orbit / pick / forge / link ────────────────────────────
let dragging = false, moved = false, last = [0, 0];
canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = false; last = [e.offsetX, e.offsetY]; });
canvas.addEventListener("pointermove", (e) => {
  if (dragging) {
    const dx = e.offsetX - last[0], dy = e.offsetY - last[1];
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    if (tool === "navigate") renderer.orbitBy(dx * 0.005, -dy * 0.005);
    last = [e.offsetX, e.offsetY];
  } else {
    const hit = renderer.screenToRayHit(e.offsetX, e.offsetY);
    canvas.style.cursor = hit ? "pointer" : "grab";
  }
});
canvas.addEventListener("pointerup", (e) => {
  dragging = false;
  if (moved) return;
  const hit = renderer.screenToRayHit(e.offsetX, e.offsetY);
  if (tool === "link") {
    if (hit && linkSource && hit !== linkSource) {
      field.linkBodies(linkSource.id, hit.id, 0.6);
      rebuild();
      linkSource = null;
      bCursor.textContent = "bound · click two bodies to bind them";
    } else if (hit) {
      linkSource = hit;
      bCursor.textContent = `linking from ${hit.title?.slice(0, 24)}… pick target`;
    }
    return;
  }
  if (tool === "forge" && !hit) {
    // forge on the focal plane at the field center
    const ndc = new THREE.Vector3(
      (e.offsetX / canvas.clientWidth) * 2 - 1,
      -(e.offsetY / canvas.clientHeight) * 2 + 1, 0.5,
    ).unproject(renderer.camera);
    const dir = ndc.sub(renderer.camera.position).normalize();
    const dist = -renderer.camera.position.z / dir.z;
    openForge(renderer.camera.position.clone().add(dir.multiplyScalar(dist)));
    return;
  }
  if (hit) showInspector(hit);
});
canvas.addEventListener("wheel", (e) => { e.preventDefault(); renderer.zoomBy(Math.exp(e.deltaY * 0.0012)); }, { passive: false });

window.addEventListener("keydown", (e) => {
  const map = { v: "navigate", n: "forge", l: "link" };
  if (map[e.key]) setTool(map[e.key]);
});

// ── Loop ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let settle = 0;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.resize(window.innerWidth, window.innerHeight, dpr);
}
window.addEventListener("resize", resize);
resize();

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  // keep simulating until the field cools, then idle-tick lightly
  const ke = field.step(dt);
  settle = ke < 0.002 ? Math.min(settle + dt, 2) : 0;
  renderer.render(clock.elapsedTime);
  mKe.textContent = ke.toFixed(3);
  mEntropy.textContent = field.systemEntropy.toFixed(2);
  mBodies.textContent = String(field.bodies.length);
  mDomains.textContent = String(Object.keys(corpus.domains).length - domainOff.size);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) clock.getDelta(); });
frame();

window.__noo = { field, renderer, ai };
