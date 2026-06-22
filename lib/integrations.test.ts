// @vitest-environment node

import { sendConfirmationEmail } from "@/lib/email";
import { sendSubmissionToGoogleSheets } from "@/lib/google-sheets";

import type { SubmissionArtifacts, SubmissionRecord } from "@/types/submission";

const submission: SubmissionRecord = {
  country: "Philippines",
  youth_structure: "Sangguniang Kabataan",
  name: "Maria Santos",
  email: "maria@example.com",
  themes: {
    self: {
      personal_barriers:
        "Young people often feel that action is not worth the risk because visible examples of change feel too distant from everyday life.",
      leadership_identity:
        "Leadership becomes real when youth see both informal organisers and elected representatives being trusted with concrete community responsibilities.",
      challenges_resilience:
        "Mental strain, underemployment, and political fatigue combine to shrink confidence unless peer support and practical opportunities are visible.",
    },
    community: {
      team_mobilising:
        "Youth groups organise through schools, barangay networks, and online channels, but they still struggle to sustain momentum across neighbourhood boundaries.",
      local_codesign:
        "Community initiatives are strongest when youth councils co-design programmes with local officials and civil society groups from the start.",
      knowledge_sharing:
        "There is no consistent peer-learning loop between councils, so lessons travel unevenly and successful models stay local.",
    },
    institutions: {
      education_local_government:
        "The immediate ask is to give youth councils a clearer role in school governance and municipal planning, with named officials accountable for follow-up.",
      sector_engagement:
        "Climate, health, and livelihoods each involve different ministries, yet youth engagement remains fragmented and usually consultative rather than decision-shaping.",
      global_branch:
        "National structures need a stronger bridge to UN youth processes and regional forums so local evidence travels into global agendas.",
    },
    systems: {
      policy_transformation:
        "A stronger youth fund and better institutional mandates would shift long-term conditions by making participation, employment, and climate action more durable.",
      cultural_narratives:
        "Youth need seats that come with response duties from institutions so participation is seen as consequential instead of symbolic.",
      digital_infrastructure:
        "A shared national platform for reporting, coordination, and public visibility would make youth implementation data easier to track and compare.",
    },
  },
  metadata: {
    timestamp: "2026-07-03T10:00:00.000Z",
    submission_id: "cop-123",
    region: "Asia and the Pacific Group",
    source: "web",
    version: "mvp-v1",
  },
};

const artifacts: SubmissionArtifacts = {
  submission,
  submissionRow: {
    submission_id: "cop-123",
    timestamp: "2026-07-03T10:00:00.000Z",
    region: "Asia and the Pacific Group",
    source: "web",
    version: "mvp-v1",
    country: "Philippines",
    youth_structure: "Sangguniang Kabataan",
    name: "Maria Santos",
    email: "maria@example.com",
  },
  ragRows: [],
};

describe("integration environment guards", () => {
  const originalSheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const originalEmailApiKey = process.env.EMAIL_API_KEY;
  const originalSenderEmail = process.env.SENDER_EMAIL;

  afterEach(() => {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = originalSheetsWebhook;
    process.env.EMAIL_API_KEY = originalEmailApiKey;
    process.env.SENDER_EMAIL = originalSenderEmail;
  });

  it("throws when the sheets webhook is missing", async () => {
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    await expect(sendSubmissionToGoogleSheets(artifacts)).rejects.toThrow(
      "GOOGLE_SHEETS_WEBHOOK_URL is not configured.",
    );
  });

  it("throws when email credentials are missing", async () => {
    delete process.env.EMAIL_API_KEY;
    delete process.env.MAILGUN_API_KEY;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    delete process.env.SENDER_EMAIL;

    await expect(sendConfirmationEmail(submission)).rejects.toThrow(
      /Email is not configured|SENDER_EMAIL is required/,
    );
  });
});
