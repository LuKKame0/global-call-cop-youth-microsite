import { eq, sql, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { ragChunks, embeddings, submissions } from "@/lib/db/schema";
import { getProvider } from "@/lib/ai";

export interface SearchResult {
  chunkId: string;
  submissionId: string;
  countryCode: string;
  region: string;
  themeKey: string;
  fieldKey: string;
  content: string;
  similarity: number;
}

export async function semanticSearch(
  query: string,
  orgId: string,
  options?: {
    limit?: number;
    themeFilter?: string;
    regionFilter?: string;
    minSimilarity?: number;
  },
): Promise<SearchResult[]> {
  const provider = getProvider();
  const [queryEmbedding] = await provider.embed([query]);

  const vectorLiteral = `[${queryEmbedding.embedding.join(",")}]`;
  const limit = options?.limit ?? 20;
  const minSim = options?.minSimilarity ?? 0.5;

  const conditions = [eq(embeddings.organizationId, orgId)];
  if (options?.themeFilter) {
    conditions.push(eq(ragChunks.themeKey, options.themeFilter));
  }
  if (options?.regionFilter) {
    conditions.push(eq(ragChunks.region, options.regionFilter));
  }

  const results = await db
    .select({
      chunkId: ragChunks.id,
      submissionId: ragChunks.submissionId,
      countryCode: ragChunks.countryCode,
      region: ragChunks.region,
      themeKey: ragChunks.themeKey,
      fieldKey: ragChunks.fieldKey,
      content: ragChunks.content,
      similarity: sql<number>`1 - (${embeddings.embedding} <=> ${vectorLiteral}::vector)`,
    })
    .from(embeddings)
    .innerJoin(ragChunks, eq(embeddings.ragChunkId, ragChunks.id))
    .where(and(...conditions))
    .orderBy(sql`${embeddings.embedding} <=> ${vectorLiteral}::vector`)
    .limit(limit);

  return results.filter((r) => r.similarity >= minSim);
}
