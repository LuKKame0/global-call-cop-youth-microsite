// TGC ATLAS demo console — wires the engine to the UI with a simulated
// "coordination index" dataset (deterministic, honestly labeled as such).

import { Atlas } from "./engine/atlas.js";
import { COUNTRY_META } from "./data/country-meta.js";
import { colorRamp, seededValue } from "./engine/data.js";

const canvas = document.getElementById("map");
const atlas = await Atlas.create(canvas, {
  topologyUrl: "./data/countries-110m.json",
  meta: COUNTRY_META,
  exclude: ["010"], // Antarctica distorts into a band under Mercator
});

// ── Demo dataset: simulated coordination index per country ──────────
const ramp = colorRamp(["#0c1622", "#123a5c", "#1b6ea8", "#37abfa"]);
const values = new Map();
for (const c of atlas.political.countries) {
  values.set(c.id, seededValue(String(c.id)));
}
atlas.political.choropleth = { values, ramp };

// ── Demo flows: coordination routes between regional hubs ───────────
const HUBS = {
  "840": null, "076": null, "032": null, // US, Brazil, Argentina
  "566": null, "710": null,             // Nigeria, South Africa
  "250": null, "276": null,             // France, Germany
  "356": null, "392": null, "036": null, // India, Japan, Australia
};
for (const ccn3 of Object.keys(HUBS)) HUBS[ccn3] = COUNTRY_META[ccn3];
const PALETTE = ["#37ABFA", "#61C879", "#FF91FE", "#FF460D"];
const hubList = Object.values(HUBS).filter(Boolean);
let f = 0;
for (let i = 0; i < hubList.length; i += 1) {
  for (let j = i + 1; j < hubList.length; j += 1) {
    if ((i + j) % 3 !== 0) continue; // sparse mesh, not full graph
    const a = hubList[i];
    const b = hubList[j];
    atlas.flows.addFlow(a[4], a[3], b[4], b[3], {
      color: PALETTE[f++ % PALETTE.length],
      speed: 0.25 + (f % 5) * 0.06,
    });
  }
}

// ── Demo operations markers ──────────────────────────────────────────
[
  ["032", "BUENOS AIRES OPS"],
  ["840", "NYC / GLOBAL CALL HQ"],
  ["566", "LAGOS NODE"],
  ["356", "DELHI NODE"],
].forEach(([ccn3, label]) => {
  const m = COUNTRY_META[ccn3];
  if (m) atlas.markers.addMarker(m[4], m[3], { color: "#FF460D", label });
});
atlas._syncPulse();

// ── Intel panel ──────────────────────────────────────────────────────
const intel = document.getElementById("intel");
const statusSel = document.getElementById("status-sel");

function renderIntel(country) {
  if (!country) {
    intel.innerHTML =
      '<p class="muted">Hover a country. Click to lock.<br />Scroll to zoom · drag to pan.</p>';
    return;
  }
  const meta = country.meta;
  const v = values.get(country.id) ?? 0;
  const rows = [
    ["INDEX", v.toFixed(3)],
    ["ISO", meta ? `${meta[1]} / ${meta[2]} / ${country.id}` : country.id],
    ["REGION", meta ? meta[5] : "—"],
    ["CENTROID", meta ? `${meta[3]}°, ${meta[4]}°` : "—"],
    ["STATUS", meta && meta[6] ? "SOVEREIGN" : "TERRITORY"],
  ];
  intel.innerHTML =
    `<p class="intel-name">${country.name ?? (meta && meta[0]) ?? "UNKNOWN"}</p>` +
    rows
      .map(
        ([k, val]) =>
          `<div class="intel-row"><span class="k">${k}</span><span class="v">${val}</span></div>`,
      )
      .join("") +
    `<div class="intel-bar" style="--v:${v}"><i></i></div>`;
}

atlas.pointer.onHover = (c) => {
  if (atlas.political.selectedId == null) renderIntel(c);
};
atlas.pointer.onSelect = (c) => {
  renderIntel(c);
  statusSel.textContent = c
    ? `SEL ${(c.name ?? "").toUpperCase()}`
    : "NO SELECTION";
  if (c && c.meta) {
    atlas.camera.flyTo({ lon: c.meta[4], lat: c.meta[3], scale: Math.max(atlas.camera.scale, 1.4) });
  }
};

// ── Status bar ───────────────────────────────────────────────────────
const statusCursor = document.getElementById("status-cursor");
const statusZoom = document.getElementById("status-zoom");
atlas.pointer.onCursor = (wx, wy) => {
  const [lon, lat] = atlas.cursorLonLat(wx, wy);
  statusCursor.textContent = `${lat.toFixed(2)}° · ${lon.toFixed(2)}°`;
  statusZoom.textContent = `Z ${atlas.camera.scale.toFixed(2)}`;
};

// ── Tool rail ────────────────────────────────────────────────────────
document.querySelectorAll("[data-tool]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-tool]").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    atlas.pointer.setTool(btn.dataset.tool);
  });
});
document.querySelector('[data-action="undo"]').addEventListener("click", () => {
  atlas.brush.undo();
  atlas.animator.invalidate();
});
document.querySelector('[data-action="clear"]').addEventListener("click", () => {
  atlas.brush.clear();
  atlas.animator.invalidate();
});
document.querySelectorAll(".swatch").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    atlas.pointer.brushOptions.color = btn.dataset.color;
    atlas.markerOptions = { color: btn.dataset.color };
  });
});
window.addEventListener("keydown", (e) => {
  const tool = { v: "select", b: "brush", m: "marker" }[e.key.toLowerCase()];
  if (tool) document.querySelector(`[data-tool="${tool}"]`).click();
});

// ── Layer toggles (choropleth is a political-layer mode) ────────────
document.querySelectorAll("[data-layer]").forEach((box) => {
  box.addEventListener("change", () => {
    const id = box.dataset.layer;
    if (id === "choropleth") {
      atlas.political.choropleth = box.checked ? { values, ramp } : null;
      atlas.animator.invalidate();
    } else {
      atlas.setLayerVisible(id, box.checked);
    }
  });
});

// ── Region navigation + segmentation ────────────────────────────────
// Flying to a region also segments it: the region is outlined and the
// rest of the map is dimmed. WORLD clears the segment.
const VIEWS = {
  americas: { lon: -75, lat: 8, scale: 0.55 },
  europe: { lon: 15, lat: 50, scale: 1.1 },
  africa: { lon: 18, lat: 2, scale: 0.7 },
  asia: { lon: 95, lat: 25, scale: 0.6 },
  oceania: { lon: 140, lat: -22, scale: 0.7 },
  world: { lon: 0, lat: 20, scale: 0.28 },
};
const flyButtons = document.querySelectorAll("[data-fly]");
flyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    flyButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    atlas.setRegion(btn.dataset.region ?? null);
    atlas.camera.flyTo(VIEWS[btn.dataset.fly]);
  });
});

// initial framing
atlas.camera.flyTo({ ...VIEWS.world, duration: 1600 });
