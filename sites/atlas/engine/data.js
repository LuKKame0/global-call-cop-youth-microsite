// Data adapters — the bridge between the map engine and the outside world.
// A dataset is rows keyed by country (iso2/iso3/ccn3) or by [lon, lat].
// Implemented: REST polling + static. Stubs documented: WebSocket, oracle.

export class StaticSource {
  constructor(rows) {
    this.rows = rows;
  }
  async fetch() {
    return this.rows;
  }
}

export class RestSource {
  // map: (json) => rows; pollMs: 0 = fetch once
  constructor(url, { map = (j) => j, pollMs = 0, headers = {} } = {}) {
    this.url = url;
    this.map = map;
    this.pollMs = pollMs;
    this.headers = headers;
    this._timer = null;
  }

  async fetch() {
    const res = await fetch(this.url, { headers: this.headers });
    if (!res.ok) throw new Error(`RestSource ${res.status}: ${this.url}`);
    return this.map(await res.json());
  }

  subscribe(onRows, onError = console.error) {
    const poll = () =>
      this.fetch()
        .then(onRows)
        .catch(onError);
    poll();
    if (this.pollMs > 0) this._timer = setInterval(poll, this.pollMs);
    return () => clearInterval(this._timer);
  }
}

// WebSocketSource — for live feeds. Implement when a feed exists:
//   constructor(url) → ws.onmessage → parse → onRows(delta)
// OracleSource — for on-chain data (Chainlink/Pyth style). Implement as a
//   RestSource against the oracle's HTTP gateway, or a contract read via a
//   wallet-less RPC provider; normalize to rows keyed by iso2.

// ── Joins ────────────────────────────────────────────────────────────
// Normalize rows onto the political layer's country ids (ccn3 strings).
// rows: [{ iso2|iso3|ccn3, value, ...rest }]
export function joinByCountry(rows, countryMeta, key = "iso2") {
  const index = new Map();
  for (const [ccn3, meta] of Object.entries(countryMeta)) {
    const k = key === "iso2" ? meta[1] : key === "iso3" ? meta[2] : ccn3;
    index.set(k, ccn3);
  }
  const values = new Map();
  for (const row of rows) {
    const ccn3 = index.get(row[key]);
    if (ccn3 != null) values.set(ccn3, row);
  }
  return values; // Map<ccn3, row>
}

// Linear color ramp between brand-style stops for choropleths.
export function colorRamp(stops) {
  const parsed = stops.map((hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]);
  return (v) => {
    const t = Math.max(0, Math.min(1, v)) * (parsed.length - 1);
    const i = Math.min(Math.floor(t), parsed.length - 2);
    const f = t - i;
    const c = parsed[i].map((a, k) => Math.round(a + (parsed[i + 1][k] - a) * f));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };
}

// Deterministic pseudo-random per key — for honest demo/simulated datasets.
export function seededValue(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}
