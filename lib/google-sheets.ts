import "server-only";

import type { SubmissionArtifacts } from "@/types/submission";

export async function sendSubmissionToGoogleSheets(
  artifacts: SubmissionArtifacts,
) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.");
  }

  const payload = {
    sheetTabs: {
      submission: "Submissions",
      rag: "RAG Chunks",
    },
    submissionRow: artifacts.submissionRow,
    ragRows: artifacts.ragRows,
    submission: artifacts.submission,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `Google Sheets webhook failed with status ${response.status}: ${responseText || "No response body."}`,
    );
  }

  console.info("[sheets] delivered submission", {
    submissionId: artifacts.submission.metadata.submission_id,
    ragChunkCount: artifacts.ragRows.length,
  });
}
