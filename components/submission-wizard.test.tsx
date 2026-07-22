import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { SubmissionWizard } from "@/components/submission-wizard";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { loadDictionary } from "@/lib/i18n/dictionary-loaders";
import { LocaleProvider } from "@/lib/i18n/context";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

const renderWizard = async () => {
  const dictionary = await loadDictionary(DEFAULT_LOCALE);
  return render(
    <LocaleProvider locale={DEFAULT_LOCALE} dictionary={dictionary}>
      <SubmissionWizard />
    </LocaleProvider>,
  );
};

const fillBasicInfo = () => {
  fireEvent.change(screen.getByTestId("country-input"), {
    target: { value: "Philippines" },
  });
  fireEvent.change(screen.getByTestId("youth-structure-input"), {
    target: { value: "Sangguniang Kabataan" },
  });
  fireEvent.change(screen.getByLabelText(/your name/i), {
    target: { value: "Maria Santos" },
  });
  fireEvent.change(screen.getByLabelText(/contact email/i), {
    target: { value: "maria@example.com" },
  });
};

const fillThemeFields = async (themeKey: string, fieldKeys: string[]) => {
  await waitFor(() => {
    expect(screen.getByTestId(`${themeKey}-${fieldKeys[0]}`)).toBeInTheDocument();
  });

  for (const fieldKey of fieldKeys) {
    fireEvent.change(screen.getByTestId(`${themeKey}-${fieldKey}`), {
      target: {
        value:
          "This response is intentionally long enough to pass validation while staying readable for the test harness and the final review step.",
      },
    });
  }
};

describe("SubmissionWizard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("blocks progression until the current step is valid", async () => {
    await renderWizard();

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/country must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("restores a draft from localStorage", async () => {
    window.localStorage.setItem(
      "cop-youth-policy-implementation-draft:v1",
      JSON.stringify({
        values: {
          country: "Kenya",
          youth_structure: "National Youth Council",
          name: "Amina N",
          email: "amina@example.com",
        },
        savedAt: "2026-04-19T12:00:00.000Z",
      }),
    );

    await renderWizard();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Kenya")).toBeInTheDocument();
    });
  });

  it("saves draft progress while the user types", async () => {
    await renderWizard();
    fillBasicInfo();

    await waitFor(() => {
      expect(
        window.localStorage.getItem("cop-youth-policy-implementation-draft:v1"),
      ).toContain("Philippines");
    });
  });

  it("updates progress and clears the local draft after a successful submit", async () => {
    window.localStorage.setItem(
      "cop-youth-policy-implementation-draft:v1",
      JSON.stringify({
        values: {
          country: "Draft Country",
        },
      }),
    );

    const fetchMock = vi
      .spyOn(window, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: true,
            submissionId: "cop-123",
            ragChunkCount: 12,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    await renderWizard();

    fillBasicInfo();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/33% of the framework prepared/i),
      ).toBeInTheDocument();
    });

    await fillThemeFields("self", [
      "personal_barriers",
      "leadership_identity",
      "challenges_resilience",
    ]);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await fillThemeFields("community", [
      "team_mobilising",
      "local_codesign",
      "knowledge_sharing",
    ]);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await fillThemeFields("institutions", [
      "education_local_government",
      "sector_engagement",
      "global_branch",
    ]);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await fillThemeFields("systems", [
      "policy_transformation",
      "cultural_narratives",
      "digital_infrastructure",
    ]);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit framework/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /submit framework/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/your framework has been submitted/i),
      ).toBeInTheDocument();
    });

    expect(
      window.localStorage.getItem("cop-youth-policy-implementation-draft:v1"),
    ).toBeNull();

    fetchMock.mockRestore();
  });
});
