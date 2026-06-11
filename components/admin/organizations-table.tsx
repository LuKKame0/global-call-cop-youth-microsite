"use client";

import { useMemo, useState } from "react";

import {
  OrganizationDetailView,
  type OrganizationDetailData,
} from "@/components/admin/organization-detail-view";
import { RecordDetailModal } from "@/components/dashboard/record-detail-modal";

export type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  submissionCount: number;
};

type OrganizationsTableProps = {
  rows: OrganizationRow[];
};

export function OrganizationsTable({ rows }: OrganizationsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRow = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? null,
    [rows, selectedId],
  );

  return (
    <>
      <div className="glass-panel overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Submissions</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((org) => (
              <tr
                key={org.id}
                className="cursor-pointer border-b border-white/5 hover:bg-white/5"
                onClick={() => setSelectedId(org.id)}
              >
                <td className="px-4 py-3 text-[var(--text-primary)]">{org.name}</td>
                <td className="px-4 py-3 text-[var(--brand-blue)]">{org.slug}</td>
                <td className="px-4 py-3 text-[var(--text-primary)]">{org.submissionCount}</td>
                <td className="px-4 py-3 text-xs text-[var(--text-secondary,#888)]">
                  {new Date(org.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RecordDetailModal
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        title={selectedRow?.name ?? "Organization"}
        eyebrow="Organization"
        fetchUrl={selectedId ? `/api/admin/organizations/${selectedId}` : null}
        render={(data) => (
          <OrganizationDetailView organization={data as OrganizationDetailData} />
        )}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left font-medium"
      style={{ color: "var(--text-secondary, #888)" }}
    >
      {children}
    </th>
  );
}
