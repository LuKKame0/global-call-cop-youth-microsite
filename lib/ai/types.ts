export interface EmbeddingResult {
  embedding: number[];
  model: string;
  tokenCount: number;
}

export interface GenerationResult {
  text: string;
  model: string;
  tokenCount: { input: number; output: number };
}

export interface InferenceProvider {
  embed(texts: string[]): Promise<EmbeddingResult[]>;
  generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult>;
  readonly name: string;
}

export interface GenerationOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}
