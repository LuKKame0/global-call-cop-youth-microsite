"use client";

import { DetailFields, DetailSection, JsonPreview } from "@/components/dashboard/detail-fields";

export type OrganizationDetailData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  settings: Record<string, unknown>;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function OrganizationDetailView({ organization }: { organization: OrganizationDetailData }) {
  return (
    <div className="space-y-5">
      <DetailSection title="Organization">
        <DetailFields
          fields={[
            { label: "Name", value: organization.name },
            { label: "Slug", value: organization.slug },
            { label: "Description", value: organization.description, multiline: true },
            { label: "Logo URL", value: organization.logoUrl },
            { label: "Submissions", value: String(organization.submissionCount) },
            { label: "Organization ID", value: organization.id },
            { label: "Created", value: formatDate(organization.createdAt) },
            { label: "Updated", value: formatDate(organization.updatedAt) },
          ]}
        />
      </DetailSection>

      <DetailSection title="Settings (JSON)">
        <JsonPreview value={organization.settings} />
      </DetailSection>
    </div>
  );
}
