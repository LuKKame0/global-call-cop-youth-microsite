import { eq, sql, count, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, ragChunks } from "@/lib/db/schema";

export async function getSubmissionsByRegion(orgId: string) {
  return db
    .select({
      region: submissions.region,
      count: count(),
    })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .groupBy(submissions.region)
    .orderBy(desc(count()));
}

export async function getSubmissionsByCountry(orgId: string) {
  return db
    .select({
      country: submissions.countryCode,
      region: submissions.region,
      count: count(),
    })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .groupBy(submissions.countryCode, submissions.region)
    .orderBy(desc(count()));
}

export async function getSubmissionsByStatus(orgId: string) {
  return db
    .select({
      status: submissions.status,
      count: count(),
    })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .groupBy(submissions.status);
}

export async function getThemeCoverage(orgId: string) {
  return db
    .select({
      themeKey: ragChunks.themeKey,
      count: count(),
    })
    .from(ragChunks)
    .where(eq(ragChunks.organizationId, orgId))
    .groupBy(ragChunks.themeKey)
    .orderBy(ragChunks.themeKey);
}

export async function getSubmissionsOverTime(orgId: string) {
  return db
    .select({
      date: sql<string>`to_char(${submissions.submittedAt}, 'YYYY-MM-DD')`,
      count: count(),
    })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .groupBy(sql`to_char(${submissions.submittedAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${submissions.submittedAt}, 'YYYY-MM-DD')`);
}
