"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateLeadStatusAction } from "@/app/(dashboard)/admin/leads/actions";
import { DetailFields, DetailSection, JsonPreview } from "@/components/dashboard/detail-fields";
import { LEAD_STATUSES, type LeadRecord } from "@/lib/leads/types";

const TYPE_LABELS: Record<LeadRecord["type"], string> = {
  apply: "Apply to Join",
  partner: "Partnership",
  coordination: "Build the Future",
  focal_point: "National Focal Point",
};

const PAYLOAD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  organization: "Organization",
  role: "Role",
  country: "Country",
  intent: "Intent",
  partnershipType: "Partnership type",
  message: "Message",
  firstName: "First name",
  lastName: "Last name",
  linkedin: "LinkedIn",
  age: "Age",
  city: "City",
  hostZCop: "Host Z-COP interest",
  locale: "Locale",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function payloadFields(payload: Record<string, unknown>) {
  return Object.entries(payload).map(([key, value]) => ({
    label: PAYLOAD_LABELS[key] ?? key,
    value: typeof value === "string" ? value : JSON.stringify(value, null, 2),
    multiline: typeof value === "string" && value.length > 80,
  }));
}

export function LeadDetailView({ lead }: { lead: LeadRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5">
      <form
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--glass-border)] bg-black/[0.03] p-4"
        action={(formData) => {
          setError(null);
          setSaved(false);
          startTransition(async () => {
            try {
              await updateLeadStatusAction(formData);
              setSaved(true);
              router.refresh();
            } catch (updateError) {
              setError(
                updateError instanceof Error ? updateError.message : "Unable to update status.",
              );
            }
          });
        }}
      >
        <input type="hidden" name="id" value={lead.id} />
        <div>
          <label
            htmlFor={`lead-status-${lead.id}`}
            className="block text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]"
          >
            Status
          </label>
          <select
            id={`lead-status-${lead.id}`}
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
          disabled={pending}
          className="rounded-lg bg-[var(--brand-blue)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save status"}
        </button>
        {saved ? <p className="text-xs text-[var(--brand-green)]">Status saved.</p> : null}
        {error ? <p className="text-xs text-rose-500">{error}</p> : null}
      </form>

      <DetailSection title="Summary">
        <DetailFields
          fields={[
            { label: "Name", value: lead.name },
            { label: "Type", value: TYPE_LABELS[lead.type] },
            { label: "Status", value: lead.status },
            { label: "Created", value: formatDate(lead.createdAt) },
            { label: "Updated", value: formatDate(lead.updatedAt) },
            { label: "Lead ID", value: lead.id },
          ]}
        />
      </DetailSection>

      <DetailSection title="Form inputs (exact)">
        <DetailFields fields={payloadFields(lead.payload)} />
      </DetailSection>

      <DetailSection title="Normalized contact fields">
        <DetailFields
          fields={[
            { label: "Email", value: lead.email },
            { label: "Organization", value: lead.organization },
            { label: "Role", value: lead.role },
            { label: "Country", value: lead.country },
            { label: "Partnership type", value: lead.partnershipType },
            { label: "Intent", value: lead.intent, multiline: true },
            { label: "Message", value: lead.message, multiline: true },
          ]}
        />
      </DetailSection>

      <DetailSection title="Metadata">
        <DetailFields
          fields={[
            { label: "Source", value: lead.source },
            { label: "IP address", value: lead.ipAddress },
          ]}
        />
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
            Raw JSON payload
          </p>
          <JsonPreview value={lead.payload} />
        </div>
      </DetailSection>
    </div>
  );
}
