"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

import type { OrgRole } from "@/lib/auth/permissions";

interface TopbarProps {
  roles: OrgRole[];
}

export function Topbar({ roles }: TopbarProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          COP Platform
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          {session?.user?.name ?? session?.user?.email ?? "User"}
          <ChevronDown size={14} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 glass-panel rounded-lg p-2 min-w-[180px] z-50">
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
                {session?.user?.email}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--brand-blue)" }}>
                {roles[0]?.role.replace(/_/g, " ") ?? "member"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
