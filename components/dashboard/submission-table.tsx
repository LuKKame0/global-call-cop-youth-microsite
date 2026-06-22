"use client";

import { useMemo, useState } from "react";

import {
  SubmissionDetailView,
  type SubmissionDetailData,
} from "@/components/admin/submission-detail-view";
import { RecordDetailModal } from "@/components/dashboard/record-detail-modal";
import { useTenant } from "@/lib/tenant/context";

export interface SubmissionRow {
  id: string;
  countryCode: string;
  region: string;
  respondentName: string | null;
  respondentEmail: string | null;
  status: string;
  submittedAt: string | null;
}

interface SubmissionTableProps {
  rows: SubmissionRow[];
}

export function SubmissionTable({ rows }: SubmissionTableProps) {
  const { orgSlug } = useTenant();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRow = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? null,
    [rows, selectedId],
  );

  if (rows.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <p style={{ color: "var(--text-secondary, #888)" }}>No submissions yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <Th>Country</Th>
                <Th>Region</Th>
                <Th>Respondent</Th>
                <Th>Status</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
                  onClick={() => setSelectedId(row.id)}
                >
                  <Td>
                    <span className="font-medium" style={{ color: "var(--brand-blue)" }}>
                      {row.countryCode}
                    </span>
                  </Td>
                  <Td>{row.region}</Td>
                  <Td>{row.respondentName ?? row.respondentEmail ?? "—"}</Td>
                  <Td>
                    <StatusBadge status={row.status} />
                  </Td>
                  <Td>
                    {row.submittedAt
                      ? new Date(row.submittedAt).toLocaleDateString()
                      : "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecordDetailModal
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        title={selectedRow?.countryCode ?? "Submission"}
        eyebrow="Framework submission"
        fetchUrl={
          selectedId ? `/api/org/${orgSlug}/submissions/${selectedId}` : null
        }
        render={(data) => (
          <SubmissionDetailView submission={data as SubmissionDetailData} />
        )}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "var(--brand-green)",
    draft: "var(--brand-orange)",
    reviewed: "var(--brand-blue)",
    archived: "var(--text-secondary, #888)",
  };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        color: colors[status] ?? "var(--text-primary)",
        border: `1px solid ${colors[status] ?? "var(--text-secondary, #888)"}`,
      }}
    >
      {status}
    </span>
  );
}
