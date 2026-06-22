import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { processSubmissionRequest } from "@/lib/submit-service";

import type {
  SubmissionArtifacts,
  SubmissionPayload,
  SubmissionRecord,
} from "@/types/submission";

const validPayload: SubmissionPayload = {
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
};

const baseDeps = () => ({
  writeBackupSnapshot: vi.fn<(submission: SubmissionRecord) => Promise<unknown>>(
    async () => undefined,
  ),
  sendSubmissionToGoogleSheets: vi.fn<
    (artifacts: SubmissionArtifacts) => Promise<void>
  >(async () => undefined),
  sendConfirmationEmail: vi.fn<(submission: SubmissionRecord) => Promise<void>>(
    async () => undefined,
  ),
  sendInternalNotification: vi.fn<
    (submission: SubmissionRecord) => Promise<void>
  >(async () => undefined),
});

describe("processSubmissionRequest", () => {
  const previousSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  beforeEach(() => {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://example.test/webhook";
  });

  afterEach(() => {
    if (previousSheetsUrl === undefined) {
      delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    } else {
      process.env.GOOGLE_SHEETS_WEBHOOK_URL = previousSheetsUrl;
    }
  });

  it("returns success when all sinks succeed", async () => {
    const deps = baseDeps();
    const result = await processSubmissionRequest(validPayload, deps);

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(result.body.ragChunkCount).toBe(12);
    expect(deps.writeBackupSnapshot).toHaveBeenCalledOnce();
    expect(deps.sendSubmissionToGoogleSheets).toHaveBeenCalledOnce();
    expect(deps.sendInternalNotification).toHaveBeenCalledOnce();
    expect(deps.sendConfirmationEmail).toHaveBeenCalledOnce();
    expect(result.body.warning).toBeUndefined();
  });

  it("treats Sheets failure as a soft warning instead of blocking submit", async () => {
    const deps = baseDeps();
    deps.sendSubmissionToGoogleSheets = vi.fn(async () => {
      throw new Error("Webhook unavailable");
    });

    const result = await processSubmissionRequest(validPayload, deps);

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(result.body.warning).toContain("Webhook unavailable");
    expect(deps.sendInternalNotification).toHaveBeenCalledOnce();
  });

  it("skips Sheets entirely when GOOGLE_SHEETS_WEBHOOK_URL is not set", async () => {
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const deps = baseDeps();

    const result = await processSubmissionRequest(validPayload, deps);

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(deps.sendSubmissionToGoogleSheets).not.toHaveBeenCalled();
    expect(deps.sendInternalNotification).toHaveBeenCalledOnce();
  });

  it("returns success with a warning when internal notification fails", async () => {
    const deps = baseDeps();
    deps.sendInternalNotification = vi.fn(async () => {
      throw new Error("Email integration is not configured.");
    });

    const result = await processSubmissionRequest(validPayload, deps);

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(result.body.warning).toContain("Email integration is not configured.");
  });

  it("returns success with a warning when confirmation email fails", async () => {
    const deps = baseDeps();
    deps.sendConfirmationEmail = vi.fn(async () => {
      throw new Error("Confirmation send failed");
    });

    const result = await processSubmissionRequest(validPayload, deps);

    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(result.body.warning).toContain("Confirmation send failed");
  });
});
