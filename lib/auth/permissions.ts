export type UserRole =
  | "platform_admin"
  | "org_admin"
  | "regional_coordinator"
  | "country_focal_point"
  | "observer";

export type Permission =
  | "submissions.read"
  | "submissions.write"
  | "submissions.review"
  | "users.read"
  | "users.invite"
  | "users.manage_roles"
  | "reports.read"
  | "reports.generate"
  | "org.settings"
  | "org.create"
  | "admin.all";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  platform_admin: ["admin.all"],
  org_admin: [
    "submissions.read",
    "submissions.review",
    "users.read",
    "users.invite",
    "users.manage_roles",
    "reports.read",
    "reports.generate",
    "org.settings",
  ],
  regional_coordinator: [
    "submissions.read",
    "submissions.review",
    "users.read",
    "reports.read",
    "reports.generate",
  ],
  country_focal_point: ["submissions.read", "submissions.write", "reports.read"],
  observer: ["submissions.read", "reports.read"],
};

export interface OrgRole {
  organizationId: string;
  role: UserRole;
  region?: string | null;
  countryCode?: string | null;
}

export function hasPermission(
  roles: OrgRole[],
  orgId: string,
  permission: Permission,
): boolean {
  return roles.some((r) => {
    if (r.role === "platform_admin") return true;
    if (r.organizationId !== orgId) return false;
    return ROLE_PERMISSIONS[r.role].includes(permission);
  });
}

export function isPlatformAdmin(roles: OrgRole[]): boolean {
  return roles.some((r) => r.role === "platform_admin");
}

export function getOrgRole(roles: OrgRole[], orgId: string): OrgRole | undefined {
  return (
    roles.find((r) => r.role === "platform_admin") ??
    roles.find((r) => r.organizationId === orgId)
  );
}
