import { z } from "zod";

export const narrativeFieldSchema = z
  .string()
  .trim()
  .min(40, "Please provide at least 40 characters.")
  .max(2000, "Please keep this response under 2000 characters.");

export const submissionPayloadSchema = z.object({
  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters.")
    .max(100, "Country must be under 100 characters."),
  youth_structure: z
    .string()
    .trim()
    .min(2, "Youth structure must be at least 2 characters.")
    .max(120, "Youth structure must be under 120 characters."),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name must be under 120 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(160, "Email must be under 160 characters."),
  themes: z.object({
    self: z.object({
      personal_barriers: narrativeFieldSchema,
      leadership_identity: narrativeFieldSchema,
      challenges_resilience: narrativeFieldSchema,
    }),
    community: z.object({
      team_mobilising: narrativeFieldSchema,
      local_codesign: narrativeFieldSchema,
      knowledge_sharing: narrativeFieldSchema,
    }),
    institutions: z.object({
      education_local_government: narrativeFieldSchema,
      sector_engagement: narrativeFieldSchema,
      global_branch: narrativeFieldSchema,
    }),
    systems: z.object({
      policy_transformation: narrativeFieldSchema,
      cultural_narratives: narrativeFieldSchema,
      digital_infrastructure: narrativeFieldSchema,
    }),
  }),
});

export const submissionResponseSchema = z.object({
  ok: z.boolean(),
  submissionId: z.string().optional(),
  ragChunkCount: z.number().int().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
  issues: z.record(z.string(), z.array(z.string()).optional()).optional(),
});

export type SubmissionPayloadInput = z.infer<typeof submissionPayloadSchema>;
