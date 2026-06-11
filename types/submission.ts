export type ThemeKey = "self" | "community" | "institutions" | "systems";

export interface ThemeFieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  helper: string;
  tags: string[];
}

export interface ThemeDefinition {
  key: ThemeKey;
  number: number;
  shortLabel: string;
  title: string;
  fullLabel: string;
  accentToken: string;
  tagline: string;
  scale: string;
  actionHint: string;
  expandedBody: readonly string[];
  fields: readonly ThemeFieldDefinition[];
}

export interface StepDefinition {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
}

export interface SelfThemeSubmission {
  personal_barriers: string;
  leadership_identity: string;
  challenges_resilience: string;
}

export interface CommunityThemeSubmission {
  team_mobilising: string;
  local_codesign: string;
  knowledge_sharing: string;
}

export interface InstitutionsThemeSubmission {
  education_local_government: string;
  sector_engagement: string;
  global_branch: string;
}

export interface SystemsThemeSubmission {
  policy_transformation: string;
  cultural_narratives: string;
  digital_infrastructure: string;
}

export interface SubmissionPayload {
  country: string;
  youth_structure: string;
  name: string;
  email: string;
  themes: {
    self: SelfThemeSubmission;
    community: CommunityThemeSubmission;
    institutions: InstitutionsThemeSubmission;
    systems: SystemsThemeSubmission;
  };
}

export type SubmissionTheme = SubmissionPayload["themes"][ThemeKey];

export interface SubmissionMetadata {
  timestamp: string;
  submission_id: string;
  region: string;
  source: "web";
  version: "mvp-v1";
}

export interface SubmissionRecord extends SubmissionPayload {
  metadata: SubmissionMetadata;
}

export interface RagChunkRecord {
  chunk_id: string;
  submission_id: string;
  country: string;
  region: string;
  theme_key: ThemeKey;
  theme_label: string;
  question_key: string;
  question_label: string;
  content: string;
  tags: string[];
  timestamp: string;
}

export type FlatSubmissionRow = Record<string, string>;

export interface SubmissionArtifacts {
  submission: SubmissionRecord;
  ragRows: RagChunkRecord[];
  submissionRow: FlatSubmissionRow;
}

export interface SubmissionResponse {
  ok: boolean;
  submissionId?: string;
  ragChunkCount?: number;
  warning?: string;
  error?: string;
  issues?: Record<string, string[] | undefined>;
}

export interface ExampleFramework {
  country: string;
  youthStructure: string;
  profile: string;
  themeHighlights: Record<ThemeKey, string>;
}

export interface ProcessStage {
  id: string;
  title: string;
  detail: string;
}

export interface StoryBeat {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  accentToken: string;
  expandedBody: readonly string[];
}

export interface StoryMetric {
  label: string;
  value: string;
  detail: string;
  expandedBody: readonly string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FrameworkGuide {
  title: string;
  detail: string;
}
