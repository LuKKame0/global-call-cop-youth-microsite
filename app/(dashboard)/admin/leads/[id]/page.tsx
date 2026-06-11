import Link from "next/link";
import { notFound } from "next/navigation";

import { getMarketingLead } from "@/lib/leads/persist";
import { LEAD_STATUSES, type LeadType } from "@/lib/leads/types";
import { updateLeadStatusAction } from "@/app/(dashboard)/admin/leads/actions";

const TYPE_LABELS: Record<LeadType, string> = {
  apply: "Apply to Join",
  partner: "Partnership",
  coordination: "Build the Future",
  focal_point: "National Focal Point",
};

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getMarketingLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ← Back to leads
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {lead.name}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {TYPE_LABELS[lead.type]} · {new Date(lead.createdAt).toLocaleString()}
          </p>
        </div>

        <form action={updateLeadStatusAction} className="flex items-end gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <div>
            <label htmlFor="status" className="block text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={lead.status}
              className="mt-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
            >
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--brand-blue)] px-3 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
            Contact
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--text-faint)]">Email</dt>
              <dd className="text-[var(--text-primary)]">{lead.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">Organization</dt>
              <dd className="text-[var(--text-primary)]">{lead.organization ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">Role</dt>
              <dd className="text-[var(--text-primary)]">{lead.role ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">Country</dt>
              <dd className="text-[var(--text-primary)]">{lead.country ?? "—"}</dd>
            </div>
            {lead.partnershipType ? (
              <div>
                <dt className="text-[var(--text-faint)]">Partnership type</dt>
                <dd className="text-[var(--text-primary)]">{lead.partnershipType}</dd>
              </div>
            ) : null}
            {lead.intent ? (
              <div>
                <dt className="text-[var(--text-faint)]">Intent</dt>
                <dd className="whitespace-pre-wrap text-[var(--text-primary)]">{lead.intent}</dd>
              </div>
            ) : null}
            {lead.message ? (
              <div>
                <dt className="text-[var(--text-faint)]">Message</dt>
                <dd className="whitespace-pre-wrap text-[var(--text-primary)]">{lead.message}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
            Metadata
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--text-faint)]">Lead ID</dt>
              <dd className="font-mono text-[var(--text-primary)]">{lead.id}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">Source</dt>
              <dd className="break-all text-[var(--text-primary)]">{lead.source ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">IP</dt>
              <dd className="text-[var(--text-primary)]">{lead.ipAddress ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-faint)]">Updated</dt>
              <dd className="text-[var(--text-primary)]">
                {new Date(lead.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
          Raw JSON payload
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/[0.04] p-4 text-xs leading-6 text-[var(--text-primary)]">
          {JSON.stringify(lead.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
