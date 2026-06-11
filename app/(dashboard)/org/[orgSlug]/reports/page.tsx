import { notFound } from "next/navigation";

import { getOrgBySlug } from "@/lib/tenant/queries";
import { ReportActions } from "@/components/dashboard/report-actions";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function ReportsPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Reports
        </h1>
        <ReportActions orgId={org.id} orgName={org.name} />
      </div>
      <div className="glass-panel rounded-xl p-6">
        <p className="text-sm" style={{ color: "var(--text-secondary, #888)" }}>
          Generate an institutional report with aggregated submission data, theme analysis,
          and regional breakdowns. Reports are generated as JSON and can be exported to PDF.
        </p>
      </div>
    </div>
  );
}
