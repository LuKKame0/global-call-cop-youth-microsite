import Link from "next/link";

import { listMarketingLeads } from "@/lib/leads/persist";
import { LEAD_TYPES, type LeadType } from "@/lib/leads/types";
import { LeadsExportButtons } from "@/components/admin/leads-export-buttons";
import { LeadsTable } from "@/components/admin/leads-table";

const TYPE_LABELS: Record<LeadType, string> = {
  apply: "Apply to Join",
  partner: "Partnership",
  coordination: "Build the Future",
  focal_point: "National Focal Point",
};

function parseType(value?: string): LeadType | undefined {
  if (value && LEAD_TYPES.includes(value as LeadType)) {
    return value as LeadType;
  }
  return undefined;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType = parseType(params.type);
  const allLeads = await listMarketingLeads(undefined, 1000);
  const leads = activeType
    ? allLeads.filter((lead) => lead.type === activeType)
    : allLeads;

  const counts = {
    apply: allLeads.filter((lead) => lead.type === "apply").length,
    partner: allLeads.filter((lead) => lead.type === "partner").length,
    coordination: allLeads.filter((lead) => lead.type === "coordination").length,
    focal_point: allLeads.filter((lead) => lead.type === "focal_point").length,
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
            CRM
          </p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Marketing Leads
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Click any row to open the full submission in a popup. Export JSON by segment or all
            leads at once.
          </p>
        </div>
        <LeadsExportButtons />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {LEAD_TYPES.map((type) => (
          <Link
            key={type}
            href={`/admin/leads?type=${type}`}
            className={`glass-panel rounded-xl p-4 transition ${
              activeType === type ? "ring-1 ring-[var(--brand-blue)]" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
              {TYPE_LABELS[type]}
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              {counts[type]}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            !activeType
              ? "bg-[var(--brand-blue)] text-white"
              : "border border-[var(--glass-border)] text-[var(--text-primary)]"
          }`}
        >
          All
        </Link>
        {LEAD_TYPES.map((type) => (
          <Link
            key={type}
            href={`/admin/leads?type=${type}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeType === type
                ? "bg-[var(--brand-blue)] text-white"
                : "border border-[var(--glass-border)] text-[var(--text-primary)]"
            }`}
          >
            {TYPE_LABELS[type]}
          </Link>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
