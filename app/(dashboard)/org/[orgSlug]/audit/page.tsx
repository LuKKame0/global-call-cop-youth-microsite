import { notFound } from "next/navigation";

import { getOrgBySlug } from "@/lib/tenant/queries";
import { getAuditLog } from "@/lib/analytics/audit";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function AuditPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const entries = await getAuditLog(org.id, { limit: 200 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Audit Log
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary, #888)" }}>
          Security and activity events for this organization.
        </p>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center">
            <p style={{ color: "var(--text-secondary, #888)" }}>No audit entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <Th>Time</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Resource</Th>
                  <Th>IP</Th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                    <Td>
                      <span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
                        {e.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                      </span>
                    </Td>
                    <Td>{e.userEmail ?? "system"}</Td>
                    <Td>
                      <ActionBadge action={e.action} />
                    </Td>
                    <Td>
                      <span style={{ color: "var(--text-secondary, #888)" }}>
                        {e.resourceType}
                        {e.resourceId ? ` #${e.resourceId.slice(0, 8)}` : ""}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs font-mono" style={{ color: "var(--text-secondary, #666)" }}>
                        {e.ipAddress ?? "—"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider whitespace-nowrap"
      style={{ color: "var(--text-secondary, #888)" }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
      {children}
    </td>
  );
}

const ACTION_COLORS: Record<string, string> = {
  create: "var(--brand-green)",
  update: "var(--brand-blue)",
  delete: "var(--brand-pink)",
  invite: "var(--brand-orange)",
  login: "var(--brand-blue)",
  export: "var(--brand-orange)",
};

function ActionBadge({ action }: { action: string }) {
  const baseAction = action.split(".")[0];
  const color = ACTION_COLORS[baseAction] ?? "var(--text-secondary, #888)";
  return (
    <span
      className="px-2 py-0.5 rounded text-xs"
      style={{ color, border: `1px solid ${color}` }}
    >
      {action}
    </span>
  );
}
