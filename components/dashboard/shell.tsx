"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { TenantProvider, type TenantContext } from "@/lib/tenant/context";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { OrgRole } from "@/lib/auth/permissions";

const ORG_SLUG_STORAGE_KEY = "tgc-dashboard-org-slug";

interface ShellProps {
  roles: OrgRole[];
  children: React.ReactNode;
}

async function fetchOrganization(params: { slug?: string; id?: string }) {
  const query = params.slug
    ? `slug=${encodeURIComponent(params.slug)}`
    : `id=${encodeURIComponent(params.id ?? "")}`;
  const response = await fetch(`/api/organizations?${query}`, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as {
    id: string;
    slug: string;
    name: string;
  } | null;
}

export function DashboardShell({ roles, children }: ShellProps) {
  const pathname = usePathname();
  const [tenant, setTenant] = useState<TenantContext | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveTenant() {
      const orgMatch = pathname.match(/^\/org\/([^/]+)/);
      if (orgMatch?.[1]) {
        const org = await fetchOrganization({ slug: orgMatch[1] });
        if (cancelled || !org?.id) {
          return;
        }
        sessionStorage.setItem(ORG_SLUG_STORAGE_KEY, org.slug);
        setTenant({ orgId: org.id, orgSlug: org.slug, orgName: org.name });
        return;
      }

      const cachedSlug = sessionStorage.getItem(ORG_SLUG_STORAGE_KEY);
      if (cachedSlug) {
        const cachedOrg = await fetchOrganization({ slug: cachedSlug });
        if (!cancelled && cachedOrg?.id) {
          setTenant({
            orgId: cachedOrg.id,
            orgSlug: cachedOrg.slug,
            orgName: cachedOrg.name,
          });
          return;
        }
      }

      const primaryRole = roles.find((role) => role.role !== "platform_admin") ?? roles[0];
      if (!primaryRole?.organizationId) {
        if (!cancelled) {
          setTenant(null);
        }
        return;
      }

      const org = await fetchOrganization({ id: primaryRole.organizationId });
      if (cancelled || !org?.id) {
        return;
      }

      sessionStorage.setItem(ORG_SLUG_STORAGE_KEY, org.slug);
      setTenant({ orgId: org.id, orgSlug: org.slug, orgName: org.name });
    }

    void resolveTenant();

    return () => {
      cancelled = true;
    };
  }, [pathname, roles]);

  const defaultTenant: TenantContext = tenant ?? {
    orgId: "",
    orgSlug: "",
    orgName: "Platform",
  };

  return (
    <TenantProvider value={defaultTenant}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "var(--page-background)" }}
      >
        <Sidebar roles={roles} hasOrgContext={Boolean(tenant?.orgSlug)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar roles={roles} />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">{children}</main>
        </div>
      </div>
    </TenantProvider>
  );
}
