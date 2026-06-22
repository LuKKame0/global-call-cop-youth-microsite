import { createSubmissionArtifacts } from "@/lib/transformers";
import { deriveRegionFromCountry } from "@/lib/region";

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

describe("deriveRegionFromCountry", () => {
  it("falls back to Unmapped when a country is unknown", () => {
    expect(deriveRegionFromCountry("Atlantis")).toBe("Unmapped");
  });
});

describe("createSubmissionArtifacts", () => {
  it("creates deterministic RAG chunks when timestamp and id are provided", () => {
    const artifacts = createSubmissionArtifacts(validPayload, {
      submissionId: "cop-fixed-id",
      timestamp: "2026-07-03T10:00:00.000Z",
    });

    expect(artifacts.submission.metadata.region).toBe(
      "Asia and the Pacific Group",
    );
    expect(artifacts.ragRows).toHaveLength(12);
    expect(artifacts.ragRows[0].chunk_id).toBe(
      "cop-fixed-id:self:personal_barriers",
    );
    expect(artifacts.submissionRow.theme_4_digital_infrastructure).toContain(
      "shared national platform",
    );
  });
});
