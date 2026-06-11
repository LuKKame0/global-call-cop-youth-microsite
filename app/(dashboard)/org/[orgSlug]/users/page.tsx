import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { userOrgRoles, users } from "@/lib/db/schema";
import { getOrgBySlug } from "@/lib/tenant/queries";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgUsersPage({ params }: Props) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const members = await db
    .select({
      roleId: userOrgRoles.id,
      role: userOrgRoles.role,
      region: userOrgRoles.region,
      countryCode: userOrgRoles.countryCode,
      userName: users.name,
      userEmail: users.email,
    })
    .from(userOrgRoles)
    .innerJoin(users, eq(userOrgRoles.userId, users.id))
    .where(eq(userOrgRoles.organizationId, org.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Members
        </h1>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Name</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Email</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Role</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Scope</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.roleId} className="border-b border-white/5">
                <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{m.userName ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{m.userEmail}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--brand-blue)", border: "1px solid var(--brand-blue)" }}>
                    {m.role.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary, #888)" }}>
                  {m.region ?? m.countryCode ?? "global"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
