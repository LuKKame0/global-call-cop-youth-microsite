import { notFound } from "next/navigation";

import { getOrgBySlug } from "@/lib/tenant/queries";
import { getCrossCountryComparison } from "@/lib/analytics/comparison";
import { ComparisonMatrix } from "@/components/analytics/comparison-matrix";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function ComparePage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const rows = await getCrossCountryComparison(org.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Cross-Country Comparison
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary, #888)" }}>
          Theme coverage, policy maturity, and implementation readiness across all submissions.
        </p>
      </div>
      <ComparisonMatrix rows={rows} />
    </div>
  );
}
