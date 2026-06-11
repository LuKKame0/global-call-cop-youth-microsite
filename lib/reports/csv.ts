import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { THEME_DEFINITIONS } from "@/lib/content";

function escapeCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function generateSubmissionsCsv(orgId: string): Promise<string> {
  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.organizationId, orgId))
    .orderBy(desc(submissions.createdAt));

  const themeHeaders = THEME_DEFINITIONS.flatMap((t) =>
    t.fields.map((f) => `${t.key}_${f.key}`),
  );

  const headers = [
    "country",
    "region",
    "respondent_name",
    "respondent_email",
    "youth_structure",
    "status",
    "submitted_at",
    ...themeHeaders,
  ];

  const csvRows = rows.map((row) => {
    const themes = row.themeResponses as Record<string, Record<string, string>>;
    const themeValues = THEME_DEFINITIONS.flatMap((t) =>
      t.fields.map((f) => escapeCell(themes[t.key]?.[f.key] ?? "")),
    );

    return [
      escapeCell(row.countryCode),
      escapeCell(row.region),
      escapeCell(row.respondentName ?? ""),
      escapeCell(row.respondentEmail ?? ""),
      escapeCell(row.youthStructure ?? ""),
      row.status,
      row.submittedAt?.toISOString() ?? "",
      ...themeValues,
    ].join(",");
  });

  return [headers.join(","), ...csvRows].join("\n");
}
