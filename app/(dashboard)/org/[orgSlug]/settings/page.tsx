import { notFound } from "next/navigation";

import { getOrgBySlug } from "@/lib/tenant/queries";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function SettingsPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Settings
      </h1>
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
            Organization Name
          </label>
          <p style={{ color: "var(--text-primary)" }}>{org.name}</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
            Slug
          </label>
          <p style={{ color: "var(--text-primary)" }}>{org.slug}</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
            Description
          </label>
          <p style={{ color: "var(--text-primary)" }}>{org.description ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
