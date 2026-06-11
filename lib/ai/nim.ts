import type {
  InferenceProvider,
  EmbeddingResult,
  GenerationResult,
  GenerationOptions,
} from "./types";

const NIM_BASE_URL = process.env.NIM_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
const NIM_API_KEY = () => {
  const key = process.env.NIM_API_KEY;
  if (!key) throw new Error("NIM_API_KEY is not set");
  return key;
};

const NIM_EMBED_MODEL = process.env.NIM_EMBED_MODEL ?? "nvidia/nv-embedqa-e5-v5";
const NIM_CHAT_MODEL = process.env.NIM_CHAT_MODEL ?? "meta/llama-3.1-70b-instruct";

async function nimFetch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${NIM_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NIM_API_KEY()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NIM API error ${res.status}: ${text}`);
  }

  return res.json();
}

export const nim: InferenceProvider = {
  name: "nvidia-nim",

  async embed(texts: string[]): Promise<EmbeddingResult[]> {
    const response = await nimFetch("/embeddings", {
      model: NIM_EMBED_MODEL,
      input: texts,
      input_type: "passage",
      encoding_format: "float",
    });

    return response.data.map((item: any, i: number) => ({
      embedding: item.embedding,
      model: NIM_EMBED_MODEL,
      tokenCount: response.usage?.total_tokens
        ? Math.ceil(response.usage.total_tokens / texts.length)
        : 0,
    }));
  },

  async generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult> {
    const messages: { role: string; content: string }[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await nimFetch("/chat/completions", {
      model: NIM_CHAT_MODEL,
      messages,
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.3,
    });

    const choice = response.choices[0];
    return {
      text: choice.message.content,
      model: NIM_CHAT_MODEL,
      tokenCount: {
        input: response.usage?.prompt_tokens ?? 0,
        output: response.usage?.completion_tokens ?? 0,
      },
    };
  },
};
