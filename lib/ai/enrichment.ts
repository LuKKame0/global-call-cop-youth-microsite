import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, ragChunks, enrichments } from "@/lib/db/schema";
import { getProvider } from "@/lib/ai";
import { THEME_DEFINITIONS } from "@/lib/content";

export async function classifySubmission(submissionId: string) {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  const chunks = await db
    .select()
    .from(ragChunks)
    .where(eq(ragChunks.submissionId, submissionId));

  const provider = getProvider();
  const themeTexts = THEME_DEFINITIONS.map((theme) => {
    const themeChunks = chunks.filter((c) => c.themeKey === theme.key);
    return `## ${theme.fullLabel}\n${themeChunks.map((c) => c.content).join("\n\n")}`;
  }).join("\n\n---\n\n");

  const result = await provider.generate(
    `Analyze this youth policy implementation framework submission from ${submission.countryCode} (${submission.region}).\n\n${themeTexts}`,
    {
      systemPrompt: `You are a policy analyst for the COP Youth Policy Implementation program. Classify this submission and return a JSON object with:
- "sdg_alignment": array of SDG numbers (1-17) that this submission most closely aligns with
- "policy_maturity": "emerging" | "developing" | "established" | "advanced"
- "key_themes": array of 3-5 key theme tags extracted from the content
- "implementation_readiness": number 1-10
- "cross_country_relevance": array of regions that could benefit from this approach
- "summary": 2-3 sentence executive summary

Return ONLY valid JSON, no markdown.`,
      temperature: 0.2,
      maxTokens: 1024,
    },
  );

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    parsed = { raw: result.text, parseError: true };
  }

  await db.insert(enrichments).values({
    organizationId: submission.organizationId,
    sourceType: "submission",
    sourceId: submissionId,
    enrichmentType: "classification",
    result: parsed,
    model: result.model,
    confidence: parsed.parseError ? 0 : 0.85,
  });

  return { submissionId, classification: parsed };
}

export async function generateRegionalSummary(orgId: string, region: string) {
  const regionSubmissions = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.organizationId, orgId), eq(submissions.region, region)));

  if (regionSubmissions.length === 0) {
    return { region, summary: "No submissions in this region yet." };
  }

  const chunks = await db
    .select()
    .from(ragChunks)
    .where(and(eq(ragChunks.organizationId, orgId), eq(ragChunks.region, region)));

  const provider = getProvider();

  const countrySummaries = regionSubmissions.map((s) => {
    const countryChunks = chunks.filter((c) => c.countryCode === s.countryCode);
    return `### ${s.countryCode}\n${countryChunks.slice(0, 4).map((c) => `- [${c.themeKey}/${c.fieldKey}]: ${c.content.slice(0, 200)}`).join("\n")}`;
  }).join("\n\n");

  const result = await provider.generate(
    `Synthesize a regional policy intelligence summary for the ${region} region based on these ${regionSubmissions.length} country submissions:\n\n${countrySummaries}`,
    {
      systemPrompt: `You are a multilateral policy analyst. Produce a structured regional summary with:
1. Regional Overview (2-3 sentences)
2. Common Themes (bullet points)
3. Divergences (where countries differ)
4. Recommended Cross-Country Collaboration Opportunities
5. Risks and Gaps

Write in clear institutional English suitable for a COP briefing document.`,
      temperature: 0.3,
      maxTokens: 2048,
    },
  );

  await db.insert(enrichments).values({
    organizationId: orgId,
    sourceType: "region",
    sourceId: orgId,
    enrichmentType: "regional_summary",
    result: { region, text: result.text, submissionCount: regionSubmissions.length },
    model: result.model,
    confidence: 0.8,
  });

  return { region, summary: result.text, submissionCount: regionSubmissions.length };
}
