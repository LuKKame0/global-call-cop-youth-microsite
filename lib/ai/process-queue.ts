import { eq, and, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { processingQueue } from "@/lib/db/schema";
import { embedSubmission } from "./embed-pipeline";
import { classifySubmission, generateRegionalSummary } from "./enrichment";

type JobHandler = (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;

const handlers: Record<string, JobHandler> = {
  embed: async (payload) => {
    const result = await embedSubmission(payload.submissionId as string);
    return result;
  },
  classify: async (payload) => {
    const result = await classifySubmission(payload.submissionId as string);
    return result;
  },
  regional_summary: async (payload) => {
    const result = await generateRegionalSummary(
      payload.orgId as string,
      payload.region as string,
    );
    return result;
  },
};

export async function enqueueJob(
  orgId: string,
  type: string,
  payload: Record<string, unknown>,
) {
  await db.insert(processingQueue).values({
    organizationId: orgId,
    type,
    payload,
    status: "pending",
  });
}

export async function processNextJobs(limit = 10) {
  const jobs = await db
    .select()
    .from(processingQueue)
    .where(
      and(
        eq(processingQueue.status, "pending"),
        sql`${processingQueue.attempts} < 3`,
      ),
    )
    .orderBy(processingQueue.createdAt)
    .limit(limit);

  const results: { id: string; status: string; error?: string }[] = [];

  for (const job of jobs) {
    await db
      .update(processingQueue)
      .set({ status: "processing", attempts: job.attempts + 1 })
      .where(eq(processingQueue.id, job.id));

    const handler = handlers[job.type];
    if (!handler) {
      await db
        .update(processingQueue)
        .set({ status: "failed", result: { error: `Unknown job type: ${job.type}` } })
        .where(eq(processingQueue.id, job.id));
      results.push({ id: job.id, status: "failed", error: `Unknown job type: ${job.type}` });
      continue;
    }

    try {
      const result = await handler(job.payload as Record<string, unknown>);
      await db
        .update(processingQueue)
        .set({ status: "completed", result, processedAt: new Date() })
        .where(eq(processingQueue.id, job.id));
      results.push({ id: job.id, status: "completed" });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      await db
        .update(processingQueue)
        .set({
          status: job.attempts + 1 >= 3 ? "failed" : "pending",
          result: { error },
        })
        .where(eq(processingQueue.id, job.id));
      results.push({ id: job.id, status: "failed", error });
    }
  }

  return results;
}
