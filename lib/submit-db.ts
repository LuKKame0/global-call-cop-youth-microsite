import "server-only";

import { db } from "@/lib/db";
import { submissions, ragChunks, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { enqueueJob } from "@/lib/ai/process-queue";
import { sanitizeText, sanitizeRecord } from "@/lib/security/sanitize";
import type { SubmissionArtifacts } from "@/types/submission";

const DEFAULT_ORG_SLUG = "global-call-cop";

export async function persistToDatabase(
  artifacts: SubmissionArtifacts,
  organizationId?: string,
) {
  const orgId = organizationId ?? (await getDefaultOrgId());
  if (!orgId) {
    throw new Error("No organization found for submission persistence");
  }

  const { submission, ragRows } = artifacts;
  const meta = submission.metadata;

  const [row] = await db
    .insert(submissions)
    .values({
      organizationId: orgId,
      countryCode: sanitizeText(submission.country),
      region: sanitizeText(meta.region),
      respondentName: submission.name ? sanitizeText(submission.name) : null,
      respondentEmail: submission.email ? sanitizeText(submission.email) : null,
      youthStructure: submission.youth_structure ? sanitizeText(submission.youth_structure) : null,
      themeResponses: sanitizeRecord(submission.themes as Record<string, unknown>),
      status: "submitted",
      metadata: {
        submission_id: meta.submission_id,
        source: meta.source,
        version: meta.version,
      },
      submittedAt: new Date(meta.timestamp),
    })
    .returning({ id: submissions.id });

  if (ragRows.length > 0) {
    await db.insert(ragChunks).values(
      ragRows.map((chunk) => ({
        submissionId: row.id,
        organizationId: orgId,
        themeKey: chunk.theme_key,
        fieldKey: chunk.question_key,
        content: sanitizeText(chunk.content),
        countryCode: chunk.country,
        region: chunk.region,
        metadata: {
          chunk_id: chunk.chunk_id,
          theme_label: chunk.theme_label,
          question_label: chunk.question_label,
          tags: chunk.tags,
        },
      })),
    );
  }

  // Enqueue AI processing jobs (non-blocking, soft-fail)
  try {
    await enqueueJob(orgId, "embed", { submissionId: row.id });
    await enqueueJob(orgId, "classify", { submissionId: row.id });
  } catch {
    console.error("[ai] failed to enqueue processing jobs for", row.id);
  }

  return row.id;
}

let cachedDefaultOrgId: string | null = null;

async function getDefaultOrgId(): Promise<string | null> {
  if (cachedDefaultOrgId) return cachedDefaultOrgId;
  const [org] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, DEFAULT_ORG_SLUG))
    .limit(1);
  cachedDefaultOrgId = org?.id ?? null;
  return cachedDefaultOrgId;
}
