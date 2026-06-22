import { notFound } from "next/navigation";

import { getOrgBySlug } from "@/lib/tenant/queries";
import { SemanticSearchPanel } from "@/components/dashboard/semantic-search";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function SearchPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Semantic Search
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary, #888)" }}>
          Search across all submissions using natural language. Results are ranked by semantic similarity.
        </p>
      </div>
      <SemanticSearchPanel />
    </div>
  );
}
