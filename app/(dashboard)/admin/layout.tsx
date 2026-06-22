import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/config";
import { isPlatformAdmin, type OrgRole } from "@/lib/auth/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const roles = ((session as { roles?: OrgRole[] }).roles ?? []) as OrgRole[];
  if (!isPlatformAdmin(roles)) {
    redirect("/dashboard");
  }

  return children;
}
