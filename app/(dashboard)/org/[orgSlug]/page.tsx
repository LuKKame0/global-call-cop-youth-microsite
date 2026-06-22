import { eq, count, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, ragChunks, userOrgRoles } from "@/lib/db/schema";
import { getOrgBySlug } from "@/lib/tenant/queries";
import { getSubmissionMapData, getCountryCoverage } from "@/lib/geo/queries";
import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards";
import { SubmissionMap } from "@/components/dashboard/submission-map";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgOverviewPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const [submissionCount] = await db
    .select({ count: count() })
    .from(submissions)
    .where(eq(submissions.organizationId, org.id));

  const [chunkCount] = await db
    .select({ count: count() })
    .from(ragChunks)
    .where(eq(ragChunks.organizationId, org.id));

  const [memberCount] = await db
    .select({ count: count() })
    .from(userOrgRoles)
    .where(eq(userOrgRoles.organizationId, org.id));

  const [countryCount] = await db
    .select({ count: sql<number>`count(distinct ${submissions.countryCode})` })
    .from(submissions)
    .where(eq(submissions.organizationId, org.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {org.name}
        </h1>
        {org.description && (
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary, #888)" }}>
            {org.description}
          </p>
        )}
      </div>

      <StatsGrid>
        <StatCard
          label="Submissions"
          value={submissionCount.count}
          accent="var(--brand-green)"
        />
        <StatCard
          label="Countries"
          value={countryCount.count}
          accent="var(--brand-blue)"
        />
        <StatCard
          label="RAG Chunks"
          value={chunkCount.count}
          accent="var(--brand-orange)"
        />
        <StatCard
          label="Members"
          value={memberCount.count}
          accent="var(--brand-pink)"
        />
      </StatsGrid>

      <MapSection orgId={org.id} />
    </div>
  );
}

async function MapSection({ orgId }: { orgId: string }) {
  const [mapData, coverage] = await Promise.all([
    getSubmissionMapData(orgId),
    getCountryCoverage(orgId),
  ]);

  return <SubmissionMap points={mapData} coverage={coverage} />;
}
