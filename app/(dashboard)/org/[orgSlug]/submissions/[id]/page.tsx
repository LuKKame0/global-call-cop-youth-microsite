import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { submissions, ragChunks } from "@/lib/db/schema";
import { THEME_DEFINITIONS } from "@/lib/content";

interface Props {
  params: Promise<{ orgSlug: string; id: string }>;
}

export default async function SubmissionDetailPage({ params }: Props) {
  const { id } = await params;

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!submission) notFound();

  const chunks = await db
    .select()
    .from(ragChunks)
    .where(eq(ragChunks.submissionId, id));

  const themes = submission.themeResponses as Record<string, Record<string, string>>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {submission.countryCode}
        </h1>
        <div className="flex gap-4 mt-2 text-sm" style={{ color: "var(--text-secondary, #888)" }}>
          <span>Region: {submission.region}</span>
          <span>Status: {submission.status}</span>
          {submission.respondentName && <span>By: {submission.respondentName}</span>}
          {submission.submittedAt && (
            <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {THEME_DEFINITIONS.map((theme) => {
        const themeData = themes[theme.key];
        if (!themeData) return null;

        const accentVar = `var(--theme-${theme.key})`;

        return (
          <section key={theme.key} className="glass-panel rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold" style={{ color: accentVar }}>
              {theme.fullLabel}
            </h2>
            {theme.fields.map((field) => (
              <div key={field.key}>
                <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary, #888)" }}>
                  {field.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {themeData[field.key] || "—"}
                </p>
              </div>
            ))}
          </section>
        );
      })}

      <div className="glass-panel rounded-xl p-4">
        <p className="text-xs" style={{ color: "var(--text-secondary, #666)" }}>
          {chunks.length} RAG chunks generated · ID: {submission.id}
        </p>
      </div>
    </div>
  );
}
