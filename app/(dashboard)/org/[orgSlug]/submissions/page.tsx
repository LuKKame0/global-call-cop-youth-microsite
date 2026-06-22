import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { getOrgBySlug } from "@/lib/tenant/queries";
import { SubmissionTable, type SubmissionRow } from "@/components/dashboard/submission-table";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function SubmissionsPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const rows = await db
    .select({
      id: submissions.id,
      countryCode: submissions.countryCode,
      region: submissions.region,
      respondentName: submissions.respondentName,
      respondentEmail: submissions.respondentEmail,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .where(eq(submissions.organizationId, org.id))
    .orderBy(desc(submissions.createdAt))
    .limit(100);

  const tableRows: SubmissionRow[] = rows.map((r) => ({
    ...r,
    submittedAt: r.submittedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Submissions
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Click a row to open the full framework inputs.
      </p>
      <SubmissionTable rows={tableRows} />
    </div>
  );
}
