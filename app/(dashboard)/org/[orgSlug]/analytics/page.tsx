import { notFound } from "next/navigation";
import { count, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { getOrgBySlug } from "@/lib/tenant/queries";
import {
  getSubmissionsByRegion,
  getThemeCoverage,
  getSubmissionsOverTime,
  getSubmissionsByStatus,
} from "@/lib/analytics/queries";
import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards";
import { RegionChart } from "@/components/analytics/region-chart";
import { ThemeChart } from "@/components/analytics/theme-chart";
import { TimelineChart } from "@/components/analytics/timeline-chart";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function AnalyticsPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const [byRegion, themeCoverage, overTime, byStatus, [totalCount]] = await Promise.all([
    getSubmissionsByRegion(org.id),
    getThemeCoverage(org.id),
    getSubmissionsOverTime(org.id),
    getSubmissionsByStatus(org.id),
    db.select({ count: count() }).from(submissions).where(eq(submissions.organizationId, org.id)),
  ]);

  const submitted = byStatus.find((s) => s.status === "submitted")?.count ?? 0;
  const reviewed = byStatus.find((s) => s.status === "reviewed")?.count ?? 0;
  const drafts = byStatus.find((s) => s.status === "draft")?.count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Analytics
      </h1>

      <StatsGrid>
        <StatCard label="Total Submissions" value={totalCount.count} accent="var(--brand-green)" />
        <StatCard label="Submitted" value={submitted} accent="var(--brand-blue)" />
        <StatCard label="Reviewed" value={reviewed} accent="var(--brand-orange)" />
        <StatCard label="Drafts" value={drafts} accent="var(--text-secondary, #888)" />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionChart data={byRegion} />
        <ThemeChart data={themeCoverage} />
      </div>

      <TimelineChart data={overTime} />
    </div>
  );
}
