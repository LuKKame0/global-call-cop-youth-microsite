// Ingest Lucas's research corpus → noosphere particles.
// Each document becomes a "body"; salient terms become orbiting "motes".
// Thermodynamic properties are derived from the text itself (see below),
// so the field has real structure on first load instead of random noise.

const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
const OUT = process.argv[3];

// universe taxonomy — domains of the Lucas ecosystem (clusters/attractors)
const DOMAINS = {
  political: { label: "POLÍTICA / MOVIMIENTO", color: "#37ABFA", hue: 205 },
  capital: { label: "CAPITAL / NEGOCIOS", color: "#61C879", hue: 140 },
  institutional: { label: "INSTITUCIONAL", color: "#FF91FE", hue: 300 },
  legal: { label: "JURÍDICO / COMPLIANCE", color: "#FF460D", hue: 14 },
  research: { label: "INVESTIGACIÓN / IA", color: "#FFD27A", hue: 40 },
};

// keyword → domain weighting (cheap classifier; NIM replaces this later)
const SIGNALS = {
  political: ["pol", "movimiento", "frente", "electoral", "gonzález", "desarrollismo", "estado", "soberan"],
  capital: ["capital", "invers", "arbitrage", "polymarket", "deal", "venture", "token", "mercado"],
  institutional: ["onu", "cop", "giar", "prompt", "institucional", "global call", "stakeholder", "gobernanza"],
  legal: ["compliance", "jurídico", "penal", "defensoría", "vulnerac", "ratio", "derecho", "denuncia"],
  research: ["research", "protocol", "pok", "knowledge", "ia ", " ai ", "data", "intel", "whitepaper"],
};

const STOP = new Set("de la el en y a los las que un una por con para del se su al como más este esta o e the of and to in is are for on with — · de los para una".split(/\s+/));

function classify(text) {
  const lower = text.toLowerCase();
  const scores = {};
  let total = 0;
  for (const [domain, words] of Object.entries(SIGNALS)) {
    let s = 0;
    for (const w of words) {
      const m = lower.split(w).length - 1;
      s += m;
    }
    scores[domain] = s;
    total += s;
  }
  const primary = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return { primary, scores, total };
}

// salient terms: frequency-ranked content words
function salientTerms(text, n = 6) {
  const freq = {};
  for (const raw of text.toLowerCase().match(/[a-záéíóúñ]{4,}/g) || []) {
    if (STOP.has(raw)) continue;
    freq[raw] = (freq[raw] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term, count]) => ({ term, count }));
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md"));
const bodies = [];
const now = Date.now();

for (const file of files) {
  const text = fs.readFileSync(path.join(SRC, file), "utf8");
  const words = (text.match(/\S+/g) || []).length;
  const cls = classify(text);
  const date = (file.match(/\d{4}-\d{2}-\d{2}/) || [null])[0];
  const ageDays = date ? (now - new Date(date).getTime()) / 86400000 : 90;
  const title =
    (text.match(/^#\s+(.+)$/m) || [null, file.replace(/\.md$/, "")])[1].slice(0, 70);

  // ── THERMODYNAMIC PROPERTIES (the laws of this universe) ──────────
  // mass     ∝ size (gravitational pull, inertia)
  // energy   ∝ recency (attention; decays with age) — drives emission
  // entropy  ∝ topical spread (how many domains it touches / structure)
  // temperature = energy / mass (hot = active+small, cold = settled+large)
  const mass = Math.min(1, Math.log10(words + 10) / 4);
  const energy = Math.max(0.05, Math.exp(-ageDays / 45));
  const domainSpread = Object.values(cls.scores).filter((s) => s > 0).length;
  const entropy = Math.min(1, domainSpread / 5);
  const temperature = Math.min(1, energy / (mass + 0.3));

  bodies.push({
    id: file.replace(/\.md$/, ""),
    title,
    file,
    domain: cls.primary,
    words,
    date,
    mass: +mass.toFixed(3),
    energy: +energy.toFixed(3),
    entropy: +entropy.toFixed(3),
    temperature: +temperature.toFixed(3),
    affinity: Object.fromEntries(
      Object.entries(cls.scores).map(([k, v]) => [k, cls.total ? +(v / cls.total).toFixed(2) : 0]),
    ),
    terms: salientTerms(text),
  });
}

// edges: documents sharing a domain or salient terms → semantic gravity
const edges = [];
for (let i = 0; i < bodies.length; i += 1) {
  for (let j = i + 1; j < bodies.length; j += 1) {
    const a = bodies[i];
    const b = bodies[j];
    const sharedTerms = a.terms.filter((t) => b.terms.some((u) => u.term === t.term)).length;
    let w = sharedTerms * 0.25;
    if (a.domain === b.domain) w += 0.4;
    // affinity dot product
    for (const k of Object.keys(DOMAINS)) w += (a.affinity[k] || 0) * (b.affinity[k] || 0) * 0.5;
    if (w > 0.35) edges.push({ a: a.id, b: b.id, w: +Math.min(1, w).toFixed(2) });
  }
}

const out = {
  generated: new Date().toISOString(),
  domains: DOMAINS,
  bodies,
  edges,
  note: "Seeded from Lucas's research corpus. Thermodynamic props derived from text; classifier is keyword-based until NIM embeddings replace it.",
};
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "corpus.json"), JSON.stringify(out, null, 0));
console.log(`${bodies.length} bodies, ${edges.length} edges`);
for (const b of bodies) {
  console.log(`  ${b.domain.padEnd(13)} T=${b.temperature} E=${b.energy} S=${b.entropy} M=${b.mass}  ${b.title.slice(0, 50)}`);
}
