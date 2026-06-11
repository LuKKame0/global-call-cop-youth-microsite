// TGC ATLAS demo console — wires the engine to the UI with a simulated
// "coordination index" dataset (deterministic, honestly labeled as such).

import { Atlas } from "./engine/atlas.js";
import { COUNTRY_META } from "./data/country-meta.js";
import { CAPITALS } from "./data/capitals.js";
import { colorRamp, seededValue } from "./engine/data.js";
import {
  GLOBAL_COMMAND,
  REGIONS,
  getFocalPoint,
  NATIONAL_DOCTRINE,
} from "./data/tgc-structure.js";

const canvas = document.getElementById("map");
const atlas = await Atlas.create(canvas, {
  topologyUrl: "./data/countries-110m.json",
  meta: COUNTRY_META,
});

// Sovereignty of non-independent polar/overseas territories (NE 110m set)
const SOVEREIGN_OF = {
  "010": "ANTARCTIC TREATY (claims suspended)",
  "304": "DENMARK (Greenland)",
  "260": "FRANCE (TAAF)",
  "540": "FRANCE (New Caledonia)",
  "238": "UNITED KINGDOM (disputed: AR)",
  "630": "UNITED STATES (Puerto Rico)",
  "732": "DISPUTED (Western Sahara)",
};

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
  if (SOVEREIGN_OF[country.id]) rows.push(["UNDER", SOVEREIGN_OF[country.id]]);
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
  if (c) {
    showNationalDossier(c);
    loadCountryDetail(c);
    if (c.meta) {
      const current = atlas.mode === "3d" ? atlas.globe.eqScale() : atlas.camera.scale;
      atlas.flyTo({ lon: c.meta[4], lat: c.meta[3], scale: Math.max(current, 2.2) });
    }
  } else {
    // deselect → back to region or global dossier
    atlas.admin1.clear();
    const region = atlas.political.regionFilter;
    if (region) {
      showRegionDossier(region);
      showRegionCapitals(region);
    } else {
      showGlobalDossier();
      atlas.capitals.clear();
    }
    atlas.animator.invalidate();
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
    const region = btn.dataset.region ?? null;
    atlas.setRegion(region);
    atlas.political.selectedId = null;
    atlas.admin1.clear();
    statusSel.textContent = "NO SELECTION";
    if (region) {
      showRegionDossier(region);
      showRegionCapitals(region);
    } else {
      showGlobalDossier();
      atlas.capitals.clear();
    }
    atlas.flyTo(VIEWS[btn.dataset.fly]);
  });
});

// ═══ DIGITAL TWIN: dossier (global → regional → national) ═══════════
const dossierTier = document.getElementById("dossier-tier");
const dossierName = document.getElementById("dossier-name");
const dossierSub = document.getElementById("dossier-sub");
const dossierBody = document.getElementById("dossier-body");
const dossierToggle = document.getElementById("dossier-toggle");

dossierToggle.addEventListener("click", () => {
  const open = dossierBody.classList.toggle("collapsed") === false;
  dossierToggle.setAttribute("aria-expanded", String(open));
});

function person(p) {
  return `<div class="person"><div class="role">${p.role}</div><div class="pname">${p.name}</div><div class="pbase">${p.base}</div></div>`;
}

function showGlobalDossier() {
  dossierTier.textContent = "GLOBAL COMMAND";
  dossierName.textContent = "The Global Call";
  dossierSub.textContent = GLOBAL_COMMAND.title;
  dossierBody.innerHTML =
    `<p class="dossier-doctrine">${GLOBAL_COMMAND.doctrine}</p>` +
    `<div class="dossier-group-title">GLOBAL LEADERSHIP</div>` +
    GLOBAL_COMMAND.leaders.map(person).join("");
}

function showRegionDossier(region) {
  const r = REGIONS[region];
  if (!r) return showGlobalDossier();
  dossierTier.textContent = "REGIONAL COMMAND";
  dossierName.textContent = r.title;
  dossierSub.textContent = `${region} · hemispheric circuit`;
  dossierBody.innerHTML =
    `<p class="dossier-doctrine">${r.doctrine}</p>` +
    `<div class="dossier-group-title">REGIONAL LEADER</div>` +
    person(r.leader) +
    (r.coordinators.length
      ? `<div class="dossier-group-title">REGIONAL COORDINATORS</div>` +
        r.coordinators.map(person).join("")
      : "");
}

function showNationalDossier(country) {
  const meta = country.meta;
  const region = meta ? meta[5] : "Americas";
  const fp = getFocalPoint(country.id, country.name);
  dossierTier.textContent = "NATIONAL NODE";
  dossierName.textContent = (country.name ?? "—").toUpperCase();
  dossierSub.textContent = `${region} command · ${meta ? meta[2] : country.id}`;
  const cap = CAPITALS[country.id];
  dossierBody.innerHTML =
    `<p class="dossier-doctrine">${NATIONAL_DOCTRINE[region] ?? NATIONAL_DOCTRINE.Americas}</p>` +
    `<div class="dossier-group-title">NATIONAL FOCAL POINT</div>` +
    person({ role: `FOCAL POINT · since ${fp.since}`, name: fp.name, base: fp.node }) +
    `<div class="dossier-group-title">REPORTS TO</div>` +
    person({ ...REGIONS[region]?.leader, role: `${region} REGIONAL LEADER` }) +
    (cap
      ? `<div class="dossier-group-title">CAPITAL</div>` +
        `<div class="person"><div class="pname">${cap[0]}</div><div class="pbase">${cap[1]}°, ${cap[2]}°</div></div>`
      : "");
}

// ── Capitals for a region / selection; admin-1 lazy-load ────────────
function showRegionCapitals(region) {
  const pts = [];
  for (const c of atlas.political.countries) {
    if (c.meta && c.meta[5] === region && CAPITALS[c.id]) {
      const cap = CAPITALS[c.id];
      pts.push({ name: cap[0], lat: cap[1], lon: cap[2], kind: "national" });
    }
  }
  atlas.capitals.set(pts);
  atlas.animator.invalidate();
}

const ADMIN_AVAILABLE = { "032": "ARG", "076": "BRA", "840": "USA", "250": "FRA", "566": "NGA", "356": "IND" };
const adminCache = new Map();

async function loadCountryDetail(country) {
  const iso3 = ADMIN_AVAILABLE[country.id];
  const caps = [];
  if (CAPITALS[country.id]) {
    const c = CAPITALS[country.id];
    caps.push({ name: c[0], lat: c[1], lon: c[2], kind: "national" });
  }
  if (!iso3) {
    atlas.admin1.clear();
    atlas.capitals.set(caps);
    atlas.animator.invalidate();
    return;
  }
  let geo = adminCache.get(iso3);
  if (!geo) {
    try {
      geo = await (await fetch(`./data/admin1/${iso3}.json`)).json();
      adminCache.set(iso3, geo);
    } catch {
      geo = { units: [], capitals: [] };
    }
  }
  // ignore if the user already moved on to another country
  if (atlas.political.selectedId !== country.id) return;
  atlas.admin1.set(geo);
  for (const [name, lat, lon] of geo.capitals) {
    caps.push({ name, lat, lon, kind: "admin" });
  }
  atlas.capitals.set(caps);
  atlas.animator.invalidate();
}

// ── 2D / 3D projection toggle ────────────────────────────────────────
const modeButtons = document.querySelectorAll("[data-mode]");
const statusProj = document.getElementById("status-proj");
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    atlas.setMode(btn.dataset.mode);
    statusProj.textContent =
      (btn.dataset.mode === "3d" ? "ORTHOGRAPHIC" : "MERCATOR") +
      " · NE 110m · 178 POLYGONS";
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key === "g") document.querySelector('[data-mode="3d"]').click();
  if (e.key === "f") document.querySelector('[data-mode="2d"]').click();
});

// expose for debugging / external control
window.__atlas = atlas;
window.__selectCountry = (ccn3) => {
  const c = atlas.political.byId.get(ccn3);
  if (c) {
    atlas.political.selectedId = ccn3;
    atlas.pointer.onSelect(c);
  }
  return !!c;
};

// initial framing + global dossier
showGlobalDossier();
atlas.flyTo({ ...VIEWS.world, duration: 1600 });
