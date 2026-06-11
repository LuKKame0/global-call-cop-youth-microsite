import { nanoid } from "nanoid";

import { APP_VERSION, THEME_DEFINITIONS } from "@/lib/content";
import { deriveRegionFromCountry } from "@/lib/region";
import { submissionPayloadSchema } from "@/lib/schema";
import type {
  FlatSubmissionRow,
  RagChunkRecord,
  SubmissionArtifacts,
  SubmissionPayload,
  SubmissionRecord,
} from "@/types/submission";

interface CreateSubmissionArtifactsOptions {
  submissionId?: string;
  timestamp?: string;
}

export function createSubmissionArtifacts(
  payload: SubmissionPayload,
  options: CreateSubmissionArtifactsOptions = {},
): SubmissionArtifacts {
  const validatedPayload = submissionPayloadSchema.parse(payload);
  const submissionId = options.submissionId ?? `cop-${nanoid(10)}`;
  const timestamp = options.timestamp ?? new Date().toISOString();
  const region = deriveRegionFromCountry(validatedPayload.country);

  const submission: SubmissionRecord = {
    ...validatedPayload,
    metadata: {
      timestamp,
      submission_id: submissionId,
      region,
      source: "web",
      version: APP_VERSION,
    },
  };

  const ragRows = THEME_DEFINITIONS.flatMap((theme) => {
    const themeResponses = submission.themes[theme.key] as unknown as Record<
      string,
      string
    >;

    return theme.fields.map<RagChunkRecord>((field) => ({
      chunk_id: `${submissionId}:${theme.key}:${field.key}`,
      submission_id: submissionId,
      country: submission.country,
      region,
      theme_key: theme.key,
      theme_label: theme.fullLabel,
      question_key: field.key,
      question_label: field.label,
      content: themeResponses[field.key],
      tags: field.tags,
      timestamp,
    }));
  });

  return {
    submission,
    ragRows,
    submissionRow: buildSubmissionRow(submission, ragRows.length),
  };
}

function buildSubmissionRow(
  submission: SubmissionRecord,
  ragChunkCount: number,
): FlatSubmissionRow {
  return {
    submission_id: submission.metadata.submission_id,
    timestamp: submission.metadata.timestamp,
    region: submission.metadata.region,
    source: submission.metadata.source,
    version: submission.metadata.version,
    country: submission.country,
    youth_structure: submission.youth_structure,
    name: submission.name,
    email: submission.email,
    theme_1_personal_barriers: submission.themes.self.personal_barriers,
    theme_1_leadership_identity: submission.themes.self.leadership_identity,
    theme_1_challenges_resilience:
      submission.themes.self.challenges_resilience,
    theme_2_team_mobilising: submission.themes.community.team_mobilising,
    theme_2_local_codesign: submission.themes.community.local_codesign,
    theme_2_knowledge_sharing: submission.themes.community.knowledge_sharing,
    theme_3_education_local_government:
      submission.themes.institutions.education_local_government,
    theme_3_sector_engagement: submission.themes.institutions.sector_engagement,
    theme_3_global_branch: submission.themes.institutions.global_branch,
    theme_4_policy_transformation:
      submission.themes.systems.policy_transformation,
    theme_4_cultural_narratives:
      submission.themes.systems.cultural_narratives,
    theme_4_digital_infrastructure:
      submission.themes.systems.digital_infrastructure,
    rag_chunk_count: String(ragChunkCount),
  };
}
