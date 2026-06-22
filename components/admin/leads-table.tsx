"use client";

import { useMemo, useState } from "react";

import { LeadDetailView } from "@/components/admin/lead-detail-view";
import { RecordDetailModal } from "@/components/dashboard/record-detail-modal";
import type { LeadRecord, LeadType } from "@/lib/leads/types";

const TYPE_LABELS: Record<LeadType, string> = {
  apply: "Apply to Join",
  partner: "Partnership",
  coordination: "Build the Future",
  focal_point: "National Focal Point",
};

const STATUS_COLORS: Record<string, string> = {
  new: "var(--brand-blue)",
  contacted: "var(--brand-green)",
  qualified: "var(--brand-pink)",
  declined: "var(--brand-orange)",
  archived: "var(--text-faint)",
};

type LeadsTableProps = {
  leads: LeadRecord[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? null,
    [leads, selectedId],
  );

  return (
    <>
      <div className="glass-panel flex h-full min-h-0 flex-col overflow-hidden rounded-xl">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Email</Th>
              <Th>Organization</Th>
              <Th>Country</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[var(--text-muted)]">
                  No leads yet for this segment.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer border-b border-[var(--glass-border)] transition hover:bg-black/[0.03]"
                  onClick={() => setSelectedId(lead.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(lead.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open lead ${lead.name}`}
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{lead.name}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{TYPE_LABELS[lead.type]}</td>
                  <td className="px-4 py-3 text-[var(--text-primary)]">{lead.email ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{lead.organization ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{lead.country ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        color: STATUS_COLORS[lead.status],
                        background: "rgba(0,0,0,0.04)",
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-faint)]">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <RecordDetailModal
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        title={selectedLead?.name ?? "Lead details"}
        eyebrow={selectedLead ? TYPE_LABELS[selectedLead.type] : "CRM lead"}
        fetchUrl={selectedId ? `/api/admin/leads/${selectedId}` : null}
        render={(data) => <LeadDetailView lead={data as LeadRecord} />}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left font-medium text-[var(--text-faint)]">{children}</th>
  );
}
