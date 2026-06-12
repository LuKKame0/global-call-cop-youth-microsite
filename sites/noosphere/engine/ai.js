// AI microservice contract for the noosphere.
//
// The universe talks to generative intelligence through ONE interface,
// AIService. Today it runs as a deterministic MOCK (no network, fully
// sovereign/offline). Swapping in real NVIDIA NIM is a single class that
// implements the same three methods — nothing else in the engine changes.
//
//   embed(text)          → Float32Array (semantic vector)   [clustering, gravity]
//   generate(prompt, ctx)→ async string  (completion)        [synthesis, naming]
//   classify(text, labels)→ {label, scores}                  [domain assignment]

export class AIService {
  async embed(text) { throw new Error("not implemented"); }
  async generate(prompt, ctx) { throw new Error("not implemented"); }
  async classify(text, labels) { throw new Error("not implemented"); }
}

// ── MOCK: deterministic, offline, instant ───────────────────────────
// Embeddings are a hashed bag-of-chars projection — not real semantics,
// but stable and good enough to drive layout/gravity in the prototype.
export class MockAIService extends AIService {
  constructor(dims = 48) {
    super();
    this.dims = dims;
  }

  async embed(text) {
    const v = new Float32Array(this.dims);
    const tokens = text.toLowerCase().match(/[a-záéíóúñ]{3,}/g) || [];
    for (const tok of tokens) {
      let h = 2166136261;
      for (let i = 0; i < tok.length; i += 1) {
        h ^= tok.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      v[(h >>> 0) % this.dims] += 1;
    }
    let norm = 0;
    for (const x of v) norm += x * x;
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < v.length; i += 1) v[i] /= norm;
    return v;
  }

  async generate(prompt) {
    // canned synthesis with a thinking delay, so the HUD shows real latency
    await new Promise((r) => setTimeout(r, 280 + Math.random() * 320));
    const seed = prompt.slice(0, 64);
    return (
      `⟦SYNTHESIS · mock⟧ ${seed.trim()}…\n` +
      `→ This node sits at the confluence of your active domains. ` +
      `Connect it to adjacent high-energy bodies to lower local entropy ` +
      `and crystallize a thesis. (NIM will write the real synthesis.)`
    );
  }

  async classify(text, labels) {
    const lower = text.toLowerCase();
    const scores = {};
    for (const label of labels) {
      scores[label] = (lower.split(label.toLowerCase()).length - 1) / (text.length / 500 + 1);
    }
    const label = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? labels[0];
    return { label, scores };
  }
}

// ── NIM: real NVIDIA NIM. Wire when a key + endpoint exist. ──────────
// Kept here as the implementation target, intentionally inert until then.
//
// export class NIMService extends AIService {
//   constructor({ baseUrl, apiKey, embedModel, chatModel }) { ... }
//   async embed(text)  { POST {baseUrl}/embeddings  model=embedModel  → data[0].embedding }
//   async generate(p)  { POST {baseUrl}/chat/completions model=chatModel → choices[0]... }
//   async classify(t,l){ generate() with a JSON-mode rubric, or embed+cosine vs label anchors }
// }
// Secrets never live in code: read from an injected config object that the
// host loads from env / a vault. The marketing CSP already restricts
// connect-src — add the NIM origin there when going live.

export function createAI(config = {}) {
  // if (config.nim?.apiKey) return new NIMService(config.nim);
  return new MockAIService();
}
