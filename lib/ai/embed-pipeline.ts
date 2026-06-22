import { eq, and, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { ragChunks, embeddings } from "@/lib/db/schema";
import { getProvider } from "@/lib/ai";

const BATCH_SIZE = 32;

export async function embedRagChunks(ragChunkIds: string[]) {
  if (ragChunkIds.length === 0) return { embedded: 0 };

  const provider = getProvider();
  let embedded = 0;

  for (let i = 0; i < ragChunkIds.length; i += BATCH_SIZE) {
    const batchIds = ragChunkIds.slice(i, i + BATCH_SIZE);

    const chunks = await db
      .select({ id: ragChunks.id, content: ragChunks.content, organizationId: ragChunks.organizationId })
      .from(ragChunks)
      .where(sql`${ragChunks.id} = ANY(${batchIds})`);

    if (chunks.length === 0) continue;

    const texts = chunks.map((c) => c.content);
    const results = await provider.embed(texts);

    const rows = chunks.map((chunk, idx) => ({
      ragChunkId: chunk.id,
      organizationId: chunk.organizationId,
      embedding: results[idx].embedding,
      model: results[idx].model,
    }));

    await db.insert(embeddings).values(rows).onConflictDoNothing();
    embedded += rows.length;
  }

  return { embedded };
}

export async function embedUnprocessedChunks(orgId?: string, limit = 200) {
  const condition = orgId
    ? and(isNull(embeddings.id), eq(ragChunks.organizationId, orgId))
    : isNull(embeddings.id);

  const unprocessed = await db
    .select({ id: ragChunks.id })
    .from(ragChunks)
    .leftJoin(embeddings, eq(ragChunks.id, embeddings.ragChunkId))
    .where(condition)
    .limit(limit);

  const ids = unprocessed.map((r) => r.id);
  return embedRagChunks(ids);
}

export async function embedSubmission(submissionId: string) {
  const chunks = await db
    .select({ id: ragChunks.id })
    .from(ragChunks)
    .where(eq(ragChunks.submissionId, submissionId));

  return embedRagChunks(chunks.map((c) => c.id));
}
