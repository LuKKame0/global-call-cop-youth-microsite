// ═══════════════════════════════════════════════════════════════════
// THE GLOBAL CALL — TERRITORIAL STRUCTURE (DIGITAL TWIN)
// ─────────────────────────────────────────────────────────────────────
// ⚠ PLACEHOLDER DATA. All names are FICTIONAL and all doctrine texts are
// ILLUSTRATIVE DRAFTS pending the official "fundamentos hemisféricos".
// Replace via a data adapter (engine/data.js) when the real registry
// exists — the shape below is the contract.
// ═══════════════════════════════════════════════════════════════════

export const GLOBAL_COMMAND = {
  title: "GLOBAL COORDINATION LAYER",
  doctrine:
    "DRAFT — The Global Call operates as one planetary coordination mesh: " +
    "commitments made in multilateral arenas are routed to the territories " +
    "that must implement them. The hemispheric thesis (to be defined) " +
    "balances North–South capability transfer with South–South solidarity " +
    "circuits, so that no region is a periphery of another.",
  leaders: [
    { role: "SECRETARY-GENERAL", name: "Amara Okonjo-Steiner", base: "New York HQ" },
    { role: "DEPUTY SG · IMPLEMENTATION", name: "Tomás Iriarte Vega", base: "Buenos Aires" },
    { role: "DEPUTY SG · MULTILATERAL AFFAIRS", name: "Mei-Lin Castellanos", base: "Geneva" },
    { role: "CHIEF DOCTRINE OFFICER", name: "Yusuf Banda-Krarup", base: "Nairobi" },
    { role: "HEAD OF NETWORK INTELLIGENCE", name: "Vera Lindqvist-Abubakar", base: "Singapore" },
  ],
};

export const REGIONS = {
  Americas: {
    title: "AMERICAS COMMAND",
    doctrine:
      "DRAFT — Western Hemisphere axis: connects the Pan-American youth " +
      "councils with hemispheric institutions (OAS, CELAC, IDB orbit). " +
      "Priority circuits: energy transition corridors, democratic " +
      "resilience, Amazonia compact.",
    leader: { role: "REGIONAL LEADER", name: "Lucía Ferreyra-Almeida", base: "Buenos Aires" },
    coordinators: [
      { role: "COORD · NORTH AMERICA", name: "Devon Whitfield", base: "Mexico City" },
      { role: "COORD · CENTRAL AM. & CARIBBEAN", name: "Maribel Santos-Clarke", base: "Panama City" },
      { role: "COORD · ANDEAN ARC", name: "Rodrigo Mamani Torres", base: "Lima" },
      { role: "COORD · SOUTHERN CONE", name: "Antonia Riquelme Duarte", base: "Santiago" },
    ],
  },
  Europe: {
    title: "EUROPE COMMAND",
    doctrine:
      "DRAFT — Institutional bridge hemisphere: translates The Global " +
      "Call's territorial signals into EU/CoE policy machinery and " +
      "redistributes regulatory expertise outward. Priority circuits: " +
      "green industrial policy, enlargement youth compacts, digital rights.",
    leader: { role: "REGIONAL LEADER", name: "Ingrid Vasilenko-Moreau", base: "Brussels" },
    coordinators: [
      { role: "COORD · WESTERN EUROPE", name: "Pierre-Adam Keller", base: "Paris" },
      { role: "COORD · NORDICS & BALTICS", name: "Saara Jokinen-Vilks", base: "Helsinki" },
      { role: "COORD · CENTRAL & BALKANS", name: "Mirela Stanković-Hahn", base: "Vienna" },
      { role: "COORD · EASTERN PARTNERSHIP", name: "Oleksandra Drahomanova", base: "Warsaw" },
    ],
  },
  Africa: {
    title: "AFRICA COMMAND",
    doctrine:
      "DRAFT — Demographic vanguard hemisphere: the youngest continent is " +
      "treated as the network's primary leadership pipeline, not a " +
      "beneficiary. Priority circuits: AfCFTA youth enterprise, Sahel " +
      "stabilization dialogues, critical-minerals governance.",
    leader: { role: "REGIONAL LEADER", name: "Kwame Ndiaye-Habtemariam", base: "Nairobi" },
    coordinators: [
      { role: "COORD · WEST AFRICA", name: "Fatoumata Kaba-Oyelaran", base: "Lagos" },
      { role: "COORD · EAST & HORN", name: "Selam Gebre-Okello", base: "Addis Ababa" },
      { role: "COORD · SOUTHERN AFRICA", name: "Thandiwe Maseko-Brandt", base: "Johannesburg" },
      { role: "COORD · NORTH AFRICA", name: "Yacine Benkhaled", base: "Tunis" },
    ],
  },
  Asia: {
    title: "ASIA COMMAND",
    doctrine:
      "DRAFT — Scale hemisphere: hosts the majority of the world's youth; " +
      "the doctrine emphasizes federated coordination across civilizational " +
      "plurality. Priority circuits: green manufacturing, digital public " +
      "infrastructure, Belt-adjacent connectivity dialogues.",
    leader: { role: "REGIONAL LEADER", name: "Priya Wickramasinghe-Tan", base: "Singapore" },
    coordinators: [
      { role: "COORD · SOUTH ASIA", name: "Arjun Mehta-Karunaratne", base: "New Delhi" },
      { role: "COORD · EAST ASIA", name: "Haruka Kobayashi-Wen", base: "Seoul" },
      { role: "COORD · SOUTHEAST ASIA", name: "Nguyen Thi Mai-Salim", base: "Jakarta" },
      { role: "COORD · CENTRAL & WEST ASIA", name: "Leyla Aliyeva-Demir", base: "Astana" },
    ],
  },
  Oceania: {
    title: "OCEANIA COMMAND",
    doctrine:
      "DRAFT — Blue continent hemisphere: ocean stewardship and climate " +
      "frontline testimony are Oceania's strategic exports to the network. " +
      "Priority circuits: Pacific resilience financing, ocean governance, " +
      "indigenous knowledge diplomacy.",
    leader: { role: "REGIONAL LEADER", name: "Moana Te Ariki-Fonoti", base: "Suva" },
    coordinators: [
      { role: "COORD · AUSTRALIA & NZ", name: "Bronte Callahan-Ngata", base: "Melbourne" },
      { role: "COORD · PACIFIC ISLANDS", name: "Iosefa Tuilagi-Marsh", base: "Apia" },
    ],
  },
  Antarctic: {
    title: "POLAR OBSERVATORY",
    doctrine:
      "DRAFT — Commons hemisphere: Antarctica is the network's reference " +
      "case for governing what belongs to everyone. Scientific youth " +
      "delegations observe Treaty consultative meetings.",
    leader: { role: "POLAR OBSERVER", name: "Dr. Sigrún Halvorsen-Páez", base: "Ushuaia Gateway" },
    coordinators: [],
  },
};

// ── National focal points ────────────────────────────────────────────
// Curated examples; every other country gets a deterministic fictional
// focal point from makeFocalPoint(iso2) so the twin is always complete.
export const FOCAL_POINTS = {
  "032": { name: "Joaquín Iturralde Paz", since: 2024, node: "Buenos Aires Ops" },
  "840": { name: "Imani Rodríguez-Hale", since: 2023, node: "NYC / Global Call HQ" },
  "076": { name: "Camila Souza-Andrade", since: 2024, node: "São Paulo Node" },
  "250": { name: "Élodie Marchand-Diallo", since: 2023, node: "Paris Node" },
  "566": { name: "Chinedu Adeyemi-Bello", since: 2024, node: "Lagos Node" },
  "356": { name: "Ananya Krishnan-Bose", since: 2023, node: "Delhi Node" },
};

const GIVEN = ["Aria", "Mateo", "Zara", "Kenji", "Nadia", "Tariq", "Ines", "Bayo", "Lina", "Ravi", "Sofia", "Emeka", "Maya", "Dario", "Amira", "Niko", "Talia", "Omar", "Vera", "Joon"];
const FAMILY = ["Castellan", "Okoye", "Vidal", "Haraldsen", "Mbeki", "Tanaka", "Reyes", "Novak", "Singh", "Almeida", "Kovač", "Diallo", "Marek", "Quispe", "Larsen", "Habib", "Moreno", "Petrov", "Naidoo", "Sato"];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// deterministic fictional focal point for any country (by ccn3 + name)
export function getFocalPoint(ccn3, countryName = "") {
  if (FOCAL_POINTS[ccn3]) return FOCAL_POINTS[ccn3];
  const h = hash(ccn3 + countryName);
  return {
    name: `${GIVEN[h % GIVEN.length]} ${FAMILY[(h >> 5) % FAMILY.length]}`,
    since: 2023 + (h % 3),
    node: `${countryName || "National"} Node`,
  };
}

// DRAFT national descriptions by region — placeholder doctrine text
export const NATIONAL_DOCTRINE = {
  Americas: "Node in the Western Hemisphere axis: feeds territorial implementation data into the Pan-American circuit.",
  Europe: "Node in the institutional bridge: links national youth councils to EU/CoE machinery.",
  Africa: "Node in the demographic vanguard: leadership pipeline and implementation testbed.",
  Asia: "Node in the scale hemisphere: federated coordination across the region's plurality.",
  Oceania: "Node in the blue continent: ocean stewardship and climate frontline testimony.",
  Antarctic: "Commons observatory: science diplomacy reference case.",
};
