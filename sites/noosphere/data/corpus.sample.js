// Synthetic demo corpus for the public repo. Mirrors the shape produced by
// the real ingest (tools/ingest.js) but uses fictional bodies — so the public
// prototype runs without exposing any private/legal source material.
//
// To run on YOUR real corpus locally, generate data/corpus.json with the
// ingest script (see README) — app.js prefers corpus.json when present and
// falls back to this sample.
export const SAMPLE_CORPUS = {
  generated: "demo",
  domains: {
    political: { label: "POLÍTICA / MOVIMIENTO", color: "#37ABFA", hue: 205 },
    capital: { label: "CAPITAL / NEGOCIOS", color: "#61C879", hue: 140 },
    institutional: { label: "INSTITUCIONAL", color: "#FF91FE", hue: 300 },
    legal: { label: "JURÍDICO / COMPLIANCE", color: "#FF460D", hue: 14 },
    research: { label: "INVESTIGACIÓN / IA", color: "#FFD27A", hue: 40 },
  },
  bodies: [
    body("manifiesto-desarrollismo", "Manifiesto · Desarrollismo Inteligente", "political", 0.9, 0.7, 0.6, 0.42, ["desarrollismo", "soberanía", "industria", "educación"]),
    body("estrategia-electoral-2027", "Estrategia electoral 2027", "political", 0.6, 0.9, 0.4, 0.78, ["frente", "territorio", "narrativa", "juventud"]),
    body("tesis-capital-energia", "Tesis · Capital y energía limpia", "capital", 0.8, 0.5, 0.8, 0.3, ["energía", "inversión", "blockchain", "industria"]),
    body("arbitraje-mercados", "Nota · Arbitraje de mercados predictivos", "capital", 0.5, 0.6, 0.6, 0.6, ["mercados", "arbitraje", "señales", "datos"]),
    body("marco-giar", "Marco institucional GIAR", "institutional", 0.9, 0.4, 1.0, 0.25, ["giar", "robótica", "alianzas", "ia"]),
    body("brief-gobernanza-ia", "Brief · Gobernanza global de IA", "institutional", 0.7, 0.8, 0.8, 0.55, ["gobernanza", "stakeholder", "estándares", "multilateral"]),
    body("protocolo-conocimiento", "Protocolo · Prueba de conocimiento", "research", 0.9, 0.5, 1.0, 0.32, ["protocolo", "conocimiento", "tokens", "incentivos"]),
    body("nota-data-workers", "Nota · Trabajo de datos y dignidad", "research", 0.6, 0.9, 0.8, 0.7, ["datos", "trabajo", "ética", "ia"]),
    body("compliance-internacional", "Informe · Compliance internacional", "legal", 0.9, 0.6, 0.8, 0.36, ["compliance", "estándares", "derechos", "auditoría"]),
    body("vias-juridicas", "Análisis · Vías jurídicas alternativas", "legal", 0.8, 0.7, 0.6, 0.45, ["jurídico", "proceso", "garantías", "ultima ratio"]),
  ],
  edges: [
    edge("manifiesto-desarrollismo", "estrategia-electoral-2027", 0.7),
    edge("manifiesto-desarrollismo", "tesis-capital-energia", 0.45),
    edge("tesis-capital-energia", "arbitraje-mercados", 0.5),
    edge("marco-giar", "brief-gobernanza-ia", 0.6),
    edge("brief-gobernanza-ia", "protocolo-conocimiento", 0.5),
    edge("protocolo-conocimiento", "nota-data-workers", 0.55),
    edge("nota-data-workers", "compliance-internacional", 0.4),
    edge("compliance-internacional", "vias-juridicas", 0.7),
    edge("marco-giar", "manifiesto-desarrollismo", 0.4),
    edge("brief-gobernanza-ia", "compliance-internacional", 0.45),
  ],
  note: "Synthetic demo corpus — fictional bodies, safe for the public repo.",
};

function body(id, title, domain, mass, energy, entropy, temperature, terms) {
  return {
    id, title, domain, mass, energy, entropy, temperature,
    words: Math.round(mass * 5000), date: null,
    affinity: { [domain]: 1 },
    terms: terms.map((term) => ({ term, count: 3 })),
  };
}
function edge(a, b, w) { return { a, b, w }; }
