// @vitest-environment node

import { POST } from "@/app/api/submit/route";
import * as submitService from "@/lib/submit-service";

import type { SubmissionPayload } from "@/types/submission";

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

describe("POST /api/submit", () => {
  it("returns a successful response body", async () => {
    vi.spyOn(submitService, "processSubmissionRequest").mockResolvedValueOnce({
      status: 200,
      body: {
        ok: true,
        submissionId: "cop-123",
        ragChunkCount: 12,
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/submit", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.ragChunkCount).toBe(12);
  });

  it("returns a bad request for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/submit", {
        method: "POST",
        body: "{",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });
});
