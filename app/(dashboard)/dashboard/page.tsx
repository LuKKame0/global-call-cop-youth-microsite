import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { userOrgRoles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getOrgById } from "@/lib/tenant/queries";

export default async function DashboardHomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = await db
    .select()
    .from(userOrgRoles)
    .where(eq(userOrgRoles.userId, session.user.id));

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass-panel rounded-xl p-8 text-center max-w-md">
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            No organization assigned
          </h1>
          <p style={{ color: "var(--text-secondary, #888)" }}>
            Contact your administrator to get access to an organization.
          </p>
        </div>
      </div>
    );
  }

  const firstNonAdmin = roles.find((r) => r.role !== "platform_admin") ?? roles[0];
  const org = await getOrgById(firstNonAdmin.organizationId);

  if (org) {
    redirect(`/org/${org.slug}`);
  }

  redirect("/login");
}
