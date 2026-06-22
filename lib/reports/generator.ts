import { eq, and, count, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, ragChunks, enrichments } from "@/lib/db/schema";
import { THEME_DEFINITIONS } from "@/lib/content";

export interface ReportData {
  orgId: string;
  orgName: string;
  scope: "org" | "region" | "country";
  scopeValue?: string;
  generatedAt: string;
  summary: {
    totalSubmissions: number;
    totalCountries: number;
    totalChunks: number;
    regionBreakdown: { region: string; count: number }[];
  };
  themes: {
    key: string;
    label: string;
    chunkCount: number;
    topCountries: { country: string; count: number }[];
  }[];
  submissions: {
    country: string;
    region: string;
    respondent: string | null;
    submittedAt: string | null;
  }[];
  enrichmentSummary?: {
    classificationsCount: number;
    regionalSummariesCount: number;
    avgReadiness?: number;
    topSdgs?: number[];
  };
}

export type ReportScope =
  | { type: "org" }
  | { type: "region"; region: string }
  | { type: "country"; countryCode: string };

export async function generateReport(
  orgId: string,
  orgName: string,
  scope: ReportScope = { type: "org" },
): Promise<ReportData> {
  const baseCondition = eq(submissions.organizationId, orgId);
  const scopeCondition =
    scope.type === "region"
      ? and(baseCondition, eq(submissions.region, scope.region))
      : scope.type === "country"
        ? and(baseCondition, eq(submissions.countryCode, scope.countryCode))
        : baseCondition;

  const chunkBase = eq(ragChunks.organizationId, orgId);
  const chunkScope =
    scope.type === "region"
      ? and(chunkBase, eq(ragChunks.region, scope.region))
      : scope.type === "country"
        ? and(chunkBase, eq(ragChunks.countryCode, scope.countryCode))
        : chunkBase;

  const [totalSubs] = await db
    .select({ count: count() })
    .from(submissions)
    .where(scopeCondition);

  const [totalCountries] = await db
    .select({ count: sql<number>`count(distinct ${submissions.countryCode})` })
    .from(submissions)
    .where(scopeCondition);

  const [totalChunks] = await db
    .select({ count: count() })
    .from(ragChunks)
    .where(chunkScope);

  const regionBreakdown = await db
    .select({ region: submissions.region, count: count() })
    .from(submissions)
    .where(scopeCondition)
    .groupBy(submissions.region);

  const themes = await Promise.all(
    THEME_DEFINITIONS.map(async (theme) => {
      const themeCondition = and(chunkScope, eq(ragChunks.themeKey, theme.key));

      const [chunkCount] = await db
        .select({ count: count() })
        .from(ragChunks)
        .where(themeCondition);

      const topCountries = await db
        .select({ country: ragChunks.countryCode, count: count() })
        .from(ragChunks)
        .where(themeCondition)
        .groupBy(ragChunks.countryCode)
        .orderBy(sql`count(*) desc`)
        .limit(5);

      return {
        key: theme.key,
        label: theme.fullLabel,
        chunkCount: chunkCount.count,
        topCountries,
      };
    }),
  );

  const allSubmissions = await db
    .select({
      country: submissions.countryCode,
      region: submissions.region,
      respondent: submissions.respondentName,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .where(scopeCondition)
    .orderBy(submissions.countryCode);

  // Gather enrichment stats
  const enrichmentSummary = await getEnrichmentSummary(orgId);

  return {
    orgId,
    orgName,
    scope: scope.type,
    scopeValue:
      scope.type === "region"
        ? scope.region
        : scope.type === "country"
          ? scope.countryCode
          : undefined,
    generatedAt: new Date().toISOString(),
    summary: {
      totalSubmissions: totalSubs.count,
      totalCountries: totalCountries.count,
      totalChunks: totalChunks.count,
      regionBreakdown,
    },
    themes,
    submissions: allSubmissions.map((s) => ({
      ...s,
      submittedAt: s.submittedAt?.toISOString() ?? null,
    })),
    enrichmentSummary,
  };
}

async function getEnrichmentSummary(orgId: string) {
  const [classCount] = await db
    .select({ count: count() })
    .from(enrichments)
    .where(
      and(
        eq(enrichments.organizationId, orgId),
        eq(enrichments.enrichmentType, "classification"),
      ),
    );

  const [summaryCount] = await db
    .select({ count: count() })
    .from(enrichments)
    .where(
      and(
        eq(enrichments.organizationId, orgId),
        eq(enrichments.enrichmentType, "regional_summary"),
      ),
    );

  return {
    classificationsCount: classCount.count,
    regionalSummariesCount: summaryCount.count,
  };
}
