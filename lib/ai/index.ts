import type { InferenceProvider } from "./types";
import { nim } from "./nim";

export type { InferenceProvider, EmbeddingResult, GenerationResult, GenerationOptions } from "./types";

const providers: Record<string, InferenceProvider> = {
  "nvidia-nim": nim,
};

export function getProvider(name?: string): InferenceProvider {
  const providerName = name ?? process.env.AI_PROVIDER ?? "nvidia-nim";
  const provider = providers[providerName];
  if (!provider) throw new Error(`Unknown AI provider: ${providerName}`);
  return provider;
}
