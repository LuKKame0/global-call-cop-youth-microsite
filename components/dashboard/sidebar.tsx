"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  Shield,
  Building2,
  Search,
  Contact,
  GitCompareArrows,
  ScrollText,
} from "lucide-react";

import { useTenant } from "@/lib/tenant/context";
import type { OrgRole } from "@/lib/auth/permissions";

interface SidebarProps {
  roles: OrgRole[];
  hasOrgContext?: boolean;
}

export function Sidebar({ roles, hasOrgContext = false }: SidebarProps) {
  const pathname = usePathname();
  const tenant = useTenant();
  const isPlatformAdmin = roles.some((r) => r.role === "platform_admin");
  const orgBase = tenant.orgSlug ? `/org/${tenant.orgSlug}` : null;

  const navItems = orgBase
    ? [
        { href: orgBase, label: "Overview", icon: LayoutDashboard },
        { href: `${orgBase}/submissions`, label: "Submissions", icon: FileText },
        { href: `${orgBase}/search`, label: "Search", icon: Search },
        { href: `${orgBase}/analytics`, label: "Analytics", icon: BarChart3 },
        { href: `${orgBase}/compare`, label: "Compare", icon: GitCompareArrows },
        { href: `${orgBase}/reports`, label: "Reports", icon: FileText },
        { href: `${orgBase}/users`, label: "Members", icon: Users },
        { href: `${orgBase}/audit`, label: "Audit Log", icon: ScrollText },
        { href: `${orgBase}/settings`, label: "Settings", icon: Settings },
      ]
    : [];

  return (
    <aside className="w-60 shrink-0 border-r border-white/10 h-full overflow-y-auto py-6 px-3">
      <div className="px-3 mb-6">
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
          {tenant.orgName}
        </p>
      </div>

      <nav className="space-y-1">
        {navItems.length === 0 ? (
          <p className="px-3 py-2 text-xs" style={{ color: "var(--text-secondary, #888)" }}>
            {hasOrgContext ? "Loading workspace…" : "No organization workspace assigned."}
          </p>
        ) : (
          navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

      {isPlatformAdmin && (
        <>
          <div className="px-3 mt-8 mb-3">
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
              Platform
            </p>
          </div>
          <nav className="space-y-1">
            <Link
              href="/admin/leads"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname.startsWith("/admin/leads")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Contact size={18} />
              Leads CRM
            </Link>
            <Link
              href="/admin/organizations"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname.startsWith("/admin/organizations")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 size={18} />
              Organizations
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname.startsWith("/admin/users")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield size={18} />
              All Users
            </Link>
          </nav>
        </>
      )}
    </aside>
  );
}
