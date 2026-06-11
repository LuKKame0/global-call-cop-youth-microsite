"use client";

import { THEME_DEFINITIONS } from "@/lib/content";

import { DetailFields, DetailSection, JsonPreview } from "@/components/dashboard/detail-fields";

export type SubmissionDetailData = {
  id: string;
  countryCode: string;
  region: string;
  respondentName: string | null;
  respondentEmail: string | null;
  youthStructure: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  themeResponses: Record<string, Record<string, string>>;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ragChunkCount: number;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function SubmissionDetailView({ submission }: { submission: SubmissionDetailData }) {
  return (
    <div className="space-y-5">
      <DetailSection title="Basic information">
        <DetailFields
          fields={[
            { label: "Country", value: submission.countryCode },
            { label: "Region", value: submission.region },
            { label: "Youth structure", value: submission.youthStructure },
            { label: "Respondent name", value: submission.respondentName },
            { label: "Contact email", value: submission.respondentEmail },
            { label: "Status", value: submission.status },
            { label: "Submitted at", value: formatDate(submission.submittedAt) },
            { label: "Submission ID", value: submission.id },
          ]}
        />
      </DetailSection>

      {THEME_DEFINITIONS.map((theme) => {
        const themeData = submission.themeResponses[theme.key];
        if (!themeData) return null;

        return (
          <DetailSection key={theme.key} title={theme.fullLabel}>
            <DetailFields
              fields={theme.fields.map((field) => ({
                label: field.label,
                value: themeData[field.key] ?? "",
                multiline: true,
              }))}
            />
          </DetailSection>
        );
      })}

      {submission.metadata && Object.keys(submission.metadata).length > 0 ? (
        <DetailSection title="Metadata">
          <JsonPreview value={submission.metadata} />
        </DetailSection>
      ) : null}

      <p className="text-xs text-[var(--text-faint)]">
        {submission.ragChunkCount} RAG chunks · Updated {formatDate(submission.updatedAt)}
      </p>
    </div>
  );
}
