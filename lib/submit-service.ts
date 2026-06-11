import "server-only";

import { writeBackupSnapshot } from "@/lib/backup-store";
import { sendConfirmationEmail, sendInternalNotification } from "@/lib/email";
import { sendSubmissionToGoogleSheets } from "@/lib/google-sheets";
import { submissionPayloadSchema } from "@/lib/schema";
import { createSubmissionArtifacts } from "@/lib/transformers";
import { persistToDatabase } from "@/lib/submit-db";
import type {
  SubmissionArtifacts,
  SubmissionRecord,
  SubmissionResponse,
} from "@/types/submission";

export interface SubmissionServiceDependencies {
  writeBackupSnapshot: (submission: SubmissionRecord) => Promise<unknown>;
  sendSubmissionToGoogleSheets: (artifacts: SubmissionArtifacts) => Promise<void>;
  sendConfirmationEmail: (submission: SubmissionRecord) => Promise<void>;
  sendInternalNotification: (submission: SubmissionRecord) => Promise<void>;
}

const defaultDependencies: SubmissionServiceDependencies = {
  writeBackupSnapshot,
  sendSubmissionToGoogleSheets,
  sendConfirmationEmail,
  sendInternalNotification,
};

const sheetsConfigured = () =>
  Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim());

const syncToSheets = () =>
  process.env.SYNC_TO_SHEETS !== "false";

export async function processSubmissionRequest(
  input: unknown,
  dependencies: SubmissionServiceDependencies = defaultDependencies,
): Promise<{ status: number; body: SubmissionResponse }> {
  const parsed = submissionPayloadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Please review the highlighted fields and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const artifacts = createSubmissionArtifacts(parsed.data);

  const warnings: string[] = [];

  // Primary store: Postgres (if configured)
  if (process.env.DATABASE_URL) {
    try {
      await persistToDatabase(artifacts);
    } catch (error) {
      warnings.push(`Database: ${getErrorMessage(error)}`);
      console.error("[db] failed to persist submission", {
        submissionId: artifacts.submission.metadata.submission_id,
        error: getErrorMessage(error),
      });
    }
  }

  // Legacy backup (filesystem / in-memory)
  try {
    await dependencies.writeBackupSnapshot(artifacts.submission);
  } catch (error) {
    console.error("[backup] failed to store submission snapshot", {
      submissionId: artifacts.submission.metadata.submission_id,
      error: getErrorMessage(error),
    });
  }

  // Optional Sheets sync
  if (sheetsConfigured() && syncToSheets()) {
    try {
      await dependencies.sendSubmissionToGoogleSheets(artifacts);
    } catch (error) {
      warnings.push(`Sheets: ${getErrorMessage(error)}`);
    }
  }

  try {
    await dependencies.sendInternalNotification(artifacts.submission);
  } catch (error) {
    warnings.push(`Internal notification: ${getErrorMessage(error)}`);
    console.error("[email] internal notification failed", {
      submissionId: artifacts.submission.metadata.submission_id,
      error: getErrorMessage(error),
    });
  }

  try {
    await dependencies.sendConfirmationEmail(artifacts.submission);
  } catch (error) {
    warnings.push(`Confirmation: ${getErrorMessage(error)}`);
  }

  const warning = warnings.length > 0 ? warnings.join(" | ") : undefined;

  return {
    status: 200,
    body: {
      ok: true,
      submissionId: artifacts.submission.metadata.submission_id,
      ragChunkCount: artifacts.ragRows.length,
      ...(warning ? { warning } : {}),
    },
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unknown error occurred.";
}
