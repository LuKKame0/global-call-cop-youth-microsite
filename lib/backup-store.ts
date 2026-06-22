import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { SubmissionRecord } from "@/types/submission";

const inMemorySnapshots: SubmissionRecord[] = [];

export async function writeBackupSnapshot(submission: SubmissionRecord) {
  inMemorySnapshots.unshift(submission);

  if (process.env.VERCEL) {
    console.info("[backup] stored submission in memory", {
      submissionId: submission.metadata.submission_id,
      mode: "memory",
    });
    return { mode: "memory" as const };
  }

  const backupDir = join(process.cwd(), "data", "backups");
  const filePath = join(
    backupDir,
    `${submission.metadata.submission_id}.submission.json`,
  );

  await mkdir(backupDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(submission, null, 2), "utf8");

  console.info("[backup] stored submission on disk", {
    submissionId: submission.metadata.submission_id,
    mode: "filesystem",
    filePath,
  });

  return { mode: "filesystem" as const, filePath };
}

export function getInMemorySnapshots() {
  return [...inMemorySnapshots];
}
