import { auth } from "@/lib/auth/config";
import type { OrgRole } from "@/lib/auth/permissions";

export async function getSessionRoles() {
  const session = await auth();
  const roles = ((session as { roles?: OrgRole[] } | null)?.roles ?? []) as OrgRole[];
  return { session, roles };
}
