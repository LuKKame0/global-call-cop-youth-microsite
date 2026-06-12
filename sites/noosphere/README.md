# NOOSPHERE — generative universe (Sensei substrate)

A navigable generative universe for exploring Lucas's projects and ideas.
Documents and ideas are **particles** in a field governed by quasi-physical
laws; thematic **clusters** (domains) emerge as gravitational wells. The goal
is an intermediate, interoperable layer over the file/window/folder metaphor —
a plastic surface for thought, with a HUD of data-art and AI microservices
(NVIDIA NIM, contract-ready) wired in.

> v0.1 prototype. Zero backend, zero build step, Three.js self-hosted
> (sovereign/offline). The public repo ships a **synthetic demo corpus**
> (`data/corpus.sample.js`); a real corpus generated from private documents
> stays local and gitignored.

## Run

```bash
npx serve sites/noosphere      # ES modules need HTTP, not file://
```

- `index.html` — the idea-universe (corpus of documents/ideas)
- `filespace.html` — **FILESPACE: fly through a real folder tree in 3D**

## FILESPACE — 3D file navigator

Navigate a real directory tree as a 3D constellation. Click **OPEN A FOLDER**,
grant read permission, and the chosen folder is read locally in your browser —
**nothing is uploaded, no backend** (File System Access API; Chrome/Edge).

- The current directory is the anchor core; its children orbit it — folders on
  an inner ring (large, blue), files on an outer ring (colored by type:
  doc/data/code/media/archive)
- **Double-click a folder** (or select → ENTER FOLDER) to fly inside; the field
  rebuilds with that folder's contents
- **Breadcrumb** at the top + **↑ UP** to ascend; click any crumb to jump
- **Select a document → a full preview panel opens** (right side): Markdown is
  rendered formatted (headings, lists, code, quotes, links), source code and
  text shown monospace, **images** and **PDFs** displayed inline; binaries get a
  type/size note. Markdown is escaped before rendering (no HTML injection).
  Esc or ✕ closes. Files are read locally; image/PDF object URLs are revoked on close.

`engine/filesystem.js` (lazy DirNode reader) + `engine/filespace.js` (level →
field) + `filespace-app.js`. Reuses the same Renderer, nebulae, labels and
calm physics as the idea-universe — the first concrete step of the
"intermediate layer over the OS".

Drag = orbit · wheel = zoom · click a body = inspect. Tools (V/N/L):
**NAV** navigate · **FORGE** create an idea-body (AI proposes its domain) ·
**LINK** bind two bodies.

## The laws (quasi-physical substrate)

The field is not decoration — these laws actually lay out the universe
(`engine/field.js`). Each body carries thermodynamic properties derived from
its source text at ingest:

| Property | Derived from | Effect |
|---|---|---|
| **MASS** | document size | gravitational pull, inertia |
| **ENERGY** | recency (decays with age) | emission / glow; resists settling |
| **ENTROPY** | topical spread across domains | repulsion strength |
| **TEMPERATURE** | energy / mass | hot = active+small (wanders), cold = settled+large (falls into its well) |

Named forces:

- **LEY I · Gravedad semántica** — related bodies attract along edges (shared terms + domain affinity)
- **LEY II · Presión de entropía** — universal pairwise repulsion (anti-collapse)
- **LEY III · Deriva de dominio** — five domain wells on a ring; bodies fall toward theirs (colder = harder)
- **LEY IV · Disipación** — medium viscosity damps velocity
- **LEY V · Conservación** — kinetic energy `E_k` and system entropy `S` are tracked and shown in the HUD

This vocabulary is the seed of the "leyes cuasi-físicas / termodinámicas"
nomenclature — extend it as the inter-agent code language grows.

## Legibility & data-art (v0.1.1)

The field is read as a **map of dream-regions**, not a drifting point cloud:

- **Domain nebulae** — each domain is a procedural fbm-noise cloud (generative
  shader, animated) anchored at its well: legible color-coded regions
- **Always-on labels** — domain titles act as cardinal markers; every body
  shows its name as a projected DOM label with distance-of-field fade (near
  crisp, far dissolving — the dreamlike depth)
- **Calm physics** — heavier viscosity + tighter domain cohesion + golden-angle
  seeding so constellations hold shape; clamped orbit tilt so navigation never
  induces vertigo
- **Ambient starfield** — procedural shell for depth and haze

## Architecture

```
engine/
  field.js     thermodynamic n-body simulation (the laws)
  renderer.js  Three.js data-art: bodies as glow-shader points (size=mass,
               glow=energy, whiteness=temperature), additive edges, domain rings
  ai.js        AIService contract — MockAIService now; NIMService stubbed.
               embed() · generate() · classify(). Swap to real NIM = one class.
data/
  corpus.sample.js  synthetic demo corpus (public, fictional bodies)
  corpus.json       optional real corpus (gitignored) — app prefers it if present
tools/noosphere-ingest.js   node script: research/*.md → corpus.json
                            (derives thermodynamic props from text; keep output local)
vendor/        three.js r180 (self-hosted; keeps CSP script-src 'self')
app.js         orchestrator: field + renderer + ai + HUD + tools
```

## Connecting NVIDIA NIM (next)

`engine/ai.js` already defines the interface and the `NIMService` target:

- `embed(text)` → replace the mock hash-projection with real `nv-embedqa-e5`
  embeddings; feed them into edge weights (semantic gravity becomes true
  semantic distance) and clustering
- `generate(prompt)` → `llama-3.1` synthesis on a selected body or sub-graph
- `classify(text, labels)` → domain assignment when forging

Secrets are injected via a config object (never in code); add the NIM origin to
the host CSP `connect-src` when going live. See the marketing `next.config.ts`
CSP for the pattern.

## Roadmap toward the digital substrate

- [ ] Real NIM embeddings → semantic layout (replace keyword classifier)
- [ ] Ingest beyond `research/`: projects, files, agent outputs (the "layer over the OS")
- [ ] Persistence: serialize forged bodies + links → reload the universe
- [ ] Sub-graph synthesis: select a region → NIM writes a thesis over it
- [ ] Inter-agent protocol: bodies as addressable nodes agents can read/write
- [ ] Sonification of `E_k` / entropy; temporal scrubber (watch the field evolve)
- [ ] Formalize the law vocabulary as a shared inter-agentic spec
```
