# TGC ATLAS — Map Engine & Geospatial Console

Custom-built vector map engine. Zero dependencies, no build step, ~150 KB total
(105 KB of that is the world topology). Palantir-style tactical aesthetic.

## Run

```bash
npx serve sites/atlas        # or any static HTTP server (ES modules need HTTP)
```

## What it does (v0.3)

- **Digital twin of The Global Call** — a three-tier dossier that follows the
  view: whole globe → **GLOBAL COMMAND** (global leadership), segmented
  continent → **REGIONAL COMMAND** (regional leader + coordinators), selected
  country → **NATIONAL NODE** (national focal point, who it reports to, capital).
  Expandable structure card with draft hemispheric doctrine per tier. All names
  and texts are **fictional placeholders** (`data/tgc-structure.js`) — every
  country resolves to a deterministic focal point so the twin is always complete
- **Capitals** — national capitals appear when a continent is segmented; on
  country select, provincial/state capitals appear too (gold markers, NE 50m)
- **Internal political map** — selecting a country lazy-loads its admin-1
  boundaries (provinces/states) where available (AR, BR, US, FR, NG, IN);
  renders in both 2D and on the 3D globe
- **2D / 3D toggle** — Mercator map or orthographic globe (keyboard F / G),
  same layers, tools and data in both; view carries over when switching

- **Political base** — 178 polygons (Natural Earth 110m TopoJSON, decoded by
  our own ~60-line decoder) including Antarctica and polar territories, hover +
  click-to-select with country intel (ISO codes, region, centroid, sovereignty;
  territories show their sovereign state) joined from `data/country-meta.js`
- **Navigation** — drag pan, wheel zoom-to-cursor, pinch zoom, animated `flyTo`
  with logarithmic zoom easing; region buttons in the top bar fly AND segment:
  the region is outlined, everything else dims (`atlas.setRegion("Europe")`,
  WORLD clears)
- **Country labels** — zoom-progressive (big countries first), screen-space
  crisp text with collision avoidance, dims outside the segmented region,
  toggleable layer
- **Data visualization** — choropleth (color ramp over any `Map<id, value>`),
  animated flow arcs between coordinates, pulsing geolocated markers with labels
- **Brush tools** — freehand annotation strokes in world space (survive
  pan/zoom), 4 brand colors, undo/clear; marker-drop tool; keyboard: V/B/M
- **Geolocation readout** — live cursor lat/lon + zoom in the status bar

## Architecture

```
engine/
  projection.js   Web Mercator ↔ world space (4096-unit square); flow curves
  topojson.js     Minimal TopoJSON decoder (arcs → rings)
  camera.js       center+scale, world↔screen, clamped pan/zoom, animated flyTo
  animator.js     single rAF scheduler — repaints ONLY when dirty or animating
  layers.js       Graticule · Political · Flows · Markers · Labels · Brush
  globe.js        3D orthographic renderer: per-pixel raster from an equirect
                  id-map (palette recolor ≪ remap; half-res while dragging),
                  1px border detection, hemisphere-culled vector overlays,
                  O(1) id-map hit-testing
  tools.js        PointerManager: pan/zoom always on; active tool = click intent
                  (in 3D, drag rotates and wheel zooms the globe)
  data.js         adapters (Static, REST-polling) + joins + color ramps
  atlas.js        facade wiring everything; Atlas.create(canvas, options)
data/
  countries-110m.json   world-atlas@2.0.2 TopoJSON (Natural Earth, public domain)
  country-meta.js       ccn3 → [name, iso2, iso3, lat, lon, region, independent]
  capitals.js           ccn3 → [name, lat, lon] (NE 50m, 194 national capitals)
  tgc-structure.js      ⚠ PLACEHOLDER org hierarchy: global/regional/national,
                        fictional names + draft doctrine (replace via adapter)
  admin1/<ISO3>.json    lazy-loaded provinces/states + admin capitals (NE 10m/50m)
index.html / atlas.css / app.js   demo console (simulated dataset, labeled)
```

### Why it's fast

Geometry is projected **once** into world space and baked into `Path2D`
objects. Each frame is a single canvas transform — no per-frame reprojection.
The animator stops the rAF loop entirely when nothing animates and nothing is
dirty (idle CPU ≈ 0). Hit-testing pre-filters by bounding box before exact
`isPointInPath`. Antimeridian-crossing rings (Russia, Fiji) are unwrapped at
build time.

## Connecting real data (next phase)

Everything joins by country id (ISO 3166-1 numeric, as string) or `[lon, lat]`:

```js
import { RestSource, joinByCountry, colorRamp } from "./engine/data.js";

const source = new RestSource("https://api.example.org/indicators", {
  map: (json) => json.rows,          // → [{ iso2: "AR", value: 0.7 }, ...]
  pollMs: 30_000,
});
source.subscribe((rows) => {
  const joined = joinByCountry(rows, COUNTRY_META, "iso2");
  const values = new Map([...joined].map(([id, r]) => [id, r.value]));
  atlas.political.choropleth = { values, ramp: colorRamp(["#0c1622", "#37abfa"]) };
  atlas.animator.invalidate();
});
```

- **REST** — implemented (`RestSource`, optional polling)
- **WebSocket** — stub documented in `data.js`; push deltas → `invalidate()`
- **Oracles / on-chain** — treat the oracle HTTP gateway as a `RestSource`, or
  read contracts via an RPC provider and normalize to rows keyed by iso2

## Roadmap

- [x] Orthographic (globe) projection toggle
- [x] Admin-1 boundaries (Natural Earth 50m/10m, lazy-loaded per country)
- [x] Label engine (zoom-dependent country labels, collision avoidance)
- [ ] Replace `tgc-structure.js` placeholders with the real registry via adapter
- [ ] Admin-1 for all countries (currently 6 demo countries)
- [ ] Timeline scrubber for temporal datasets
- [ ] Vector tile support if 10m detail is ever needed
- [ ] Persist annotations (serialize brush strokes → JSON → DB)
