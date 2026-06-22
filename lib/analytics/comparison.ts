import { eq, and, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, ragChunks, enrichments } from "@/lib/db/schema";
import { THEME_DEFINITIONS } from "@/lib/content";

export interface ComparisonRow {
  countryCode: string;
  region: string;
  respondent: string | null;
  themes: Record<
    string,
    {
      fieldCount: number;
      avgLength: number;
      hasContent: boolean;
    }
  >;
  classification?: {
    policyMaturity?: string;
    implementationReadiness?: number;
    sdgAlignment?: number[];
    keyThemes?: string[];
  };
}

export async function getCrossCountryComparison(orgId: string): Promise<ComparisonRow[]> {
  const subs = await db
    .select({
      id: submissions.id,
      countryCode: submissions.countryCode,
      region: submissions.region,
      respondent: submissions.respondentName,
      themeResponses: submissions.themeResponses,
    })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .orderBy(submissions.countryCode);

  const classifications = await db
    .select({
      sourceId: enrichments.sourceId,
      result: enrichments.result,
    })
    .from(enrichments)
    .where(
      and(
        eq(enrichments.organizationId, orgId),
        eq(enrichments.enrichmentType, "classification"),
      ),
    );

  const classMap = new Map(classifications.map((c) => [c.sourceId, c.result as Record<string, unknown>]));

  return subs.map((sub) => {
    const themes: ComparisonRow["themes"] = {};
    const responses = sub.themeResponses as Record<string, Record<string, string>>;

    for (const theme of THEME_DEFINITIONS) {
      const themeData = responses[theme.key] ?? {};
      const fields = theme.fields.map((f) => themeData[f.key] ?? "");
      const filledFields = fields.filter((f) => f.length > 0);

      themes[theme.key] = {
        fieldCount: filledFields.length,
        avgLength: filledFields.length > 0
          ? Math.round(filledFields.reduce((sum, f) => sum + f.length, 0) / filledFields.length)
          : 0,
        hasContent: filledFields.length > 0,
      };
    }

    const cls = classMap.get(sub.id);

    return {
      countryCode: sub.countryCode,
      region: sub.region,
      respondent: sub.respondent,
      themes,
      classification: cls
        ? {
            policyMaturity: cls.policy_maturity as string | undefined,
            implementationReadiness: cls.implementation_readiness as number | undefined,
            sdgAlignment: cls.sdg_alignment as number[] | undefined,
            keyThemes: cls.key_themes as string[] | undefined,
          }
        : undefined,
    };
  });
}
