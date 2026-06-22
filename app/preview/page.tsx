"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  Search,
  GitCompareArrows,
  ScrollText,
  LogOut,
  ChevronDown,
  Globe,
  FileDown,
  Sheet,
} from "lucide-react";

import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards";

const MOCK_SUBMISSIONS = [
  { id: "1", country: "Argentina", region: "Latin America", status: "submitted", date: "2026-05-15", name: "María González" },
  { id: "2", country: "Kenya", region: "Africa", status: "reviewed", date: "2026-05-14", name: "Amina Osei" },
  { id: "3", country: "Germany", region: "Europe", status: "submitted", date: "2026-05-13", name: "Hans Weber" },
  { id: "4", country: "Japan", region: "Asia-Pacific", status: "draft", date: "2026-05-12", name: "Yuki Tanaka" },
  { id: "5", country: "Brazil", region: "Latin America", status: "submitted", date: "2026-05-11", name: "Lucas Silva" },
  { id: "6", country: "Nigeria", region: "Africa", status: "reviewed", date: "2026-05-10", name: "Chidi Okafor" },
  { id: "7", country: "India", region: "Asia-Pacific", status: "submitted", date: "2026-05-09", name: "Priya Sharma" },
  { id: "8", country: "France", region: "Europe", status: "submitted", date: "2026-05-08", name: "Claire Dupont" },
];

const MOCK_AUDIT = [
  { id: "a1", action: "create.submission", user: "maria@gov.ar", resource: "submission", time: "2026-05-15 14:32", ip: "190.12.1.45" },
  { id: "a2", action: "invite.user", user: "admin@globalcall.org", resource: "user", time: "2026-05-15 13:10", ip: "73.22.15.88" },
  { id: "a3", action: "export.csv", user: "admin@globalcall.org", resource: "report", time: "2026-05-15 12:55", ip: "73.22.15.88" },
  { id: "a4", action: "create.submission", user: "amina@youth.ke", resource: "submission", time: "2026-05-14 16:20", ip: "102.8.3.22" },
  { id: "a5", action: "login", user: "hans@juforum.de", resource: "session", time: "2026-05-13 09:44", ip: "85.12.44.9" },
];

const MOCK_COMPARISON = [
  { country: "AR", region: "LATAM", self: 3, community: 2, institutions: 3, systems: 1, maturity: "developing", readiness: 6, sdgs: "4, 8, 13" },
  { country: "KE", region: "Africa", self: 3, community: 3, institutions: 2, systems: 2, maturity: "established", readiness: 7, sdgs: "1, 4, 13" },
  { country: "DE", region: "Europe", self: 2, community: 3, institutions: 3, systems: 3, maturity: "advanced", readiness: 9, sdgs: "4, 7, 13" },
  { country: "JP", region: "Asia-Pac", self: 1, community: 1, institutions: 2, systems: 1, maturity: "emerging", readiness: 3, sdgs: "4, 9" },
  { country: "BR", region: "LATAM", self: 3, community: 2, institutions: 2, systems: 2, maturity: "developing", readiness: 5, sdgs: "1, 4, 10" },
  { country: "NG", region: "Africa", self: 2, community: 3, institutions: 1, systems: 1, maturity: "emerging", readiness: 4, sdgs: "1, 4, 8" },
];

const MATURITY_COLORS: Record<string, string> = {
  emerging: "#F97316",
  developing: "#EAB308",
  established: "#22C55E",
  advanced: "#3B82F6",
};

const THEME_COLORS = {
  self: "var(--brand-pink, #FF6B9D)",
  community: "var(--brand-green, #22C55E)",
  institutions: "var(--brand-blue, #3B82F6)",
  systems: "var(--brand-orange, #F97316)",
};

type View = "overview" | "submissions" | "analytics" | "compare" | "reports" | "search" | "audit" | "users" | "settings";

export default function PreviewPage() {
  const [view, setView] = useState<View>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "submissions", label: "Submissions", icon: FileText },
    { key: "search", label: "Search", icon: Search },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "compare", label: "Compare", icon: GitCompareArrows },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "users", label: "Members", icon: Users },
    { key: "audit", label: "Audit Log", icon: ScrollText },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-background, #0a0a0a)" }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 h-full overflow-y-auto py-6 px-3">
        <div className="px-3 mb-6">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
            Global Call COP
          </p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
                view === item.key
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary, #fff)" }}>
            COP Platform
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              admin@globalcall.org
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 glass-panel rounded-lg p-2 min-w-[180px] z-50">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>admin@globalcall.org</p>
                  <p className="text-xs mt-1" style={{ color: "var(--brand-blue, #3B82F6)" }}>platform admin</p>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "overview" && <OverviewView />}
          {view === "submissions" && <SubmissionsView />}
          {view === "analytics" && <AnalyticsView />}
          {view === "compare" && <CompareView />}
          {view === "reports" && <ReportsView />}
          {view === "search" && <SearchView />}
          {view === "audit" && <AuditView />}
          {view === "users" && <UsersView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Organization Overview</h1>
      <StatsGrid>
        <StatCard label="Total Submissions" value={47} accent="var(--brand-blue, #3B82F6)" />
        <StatCard label="Countries" value={23} accent="var(--brand-green, #22C55E)" />
        <StatCard label="RAG Chunks" value={564} accent="var(--brand-orange, #F97316)" />
        <StatCard label="Members" value={12} accent="var(--brand-pink, #FF6B9D)" />
      </StatsGrid>

      {/* Mini map placeholder */}
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary, #fff)" }}>Submission Map</h2>
        <div className="relative bg-white/5 rounded-lg overflow-hidden" style={{ height: 320 }}>
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <rect width="800" height="400" fill="transparent" />
            {/* Simplified continents */}
            <ellipse cx="200" cy="180" rx="80" ry="60" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <ellipse cx="400" cy="160" rx="60" ry="80" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <ellipse cx="450" cy="280" rx="50" ry="40" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <ellipse cx="580" cy="180" rx="70" ry="60" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <ellipse cx="680" cy="260" rx="40" ry="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            {/* Bubbles */}
            <circle cx="180" cy="210" r="12" fill="#3B82F6" opacity="0.7" /><text x="180" y="214" textAnchor="middle" fill="white" fontSize="8">AR</text>
            <circle cx="210" cy="195" r="10" fill="#3B82F6" opacity="0.7" /><text x="210" y="199" textAnchor="middle" fill="white" fontSize="8">BR</text>
            <circle cx="420" cy="240" r="11" fill="#22C55E" opacity="0.7" /><text x="420" y="244" textAnchor="middle" fill="white" fontSize="8">KE</text>
            <circle cx="440" cy="220" r="9" fill="#22C55E" opacity="0.7" /><text x="440" y="224" textAnchor="middle" fill="white" fontSize="8">NG</text>
            <circle cx="400" cy="140" r="13" fill="#F97316" opacity="0.7" /><text x="400" y="144" textAnchor="middle" fill="white" fontSize="8">DE</text>
            <circle cx="380" cy="150" r="10" fill="#F97316" opacity="0.7" /><text x="380" y="154" textAnchor="middle" fill="white" fontSize="8">FR</text>
            <circle cx="620" cy="170" r="10" fill="#FF6B9D" opacity="0.7" /><text x="620" y="174" textAnchor="middle" fill="white" fontSize="8">IN</text>
            <circle cx="660" cy="155" r="11" fill="#FF6B9D" opacity="0.7" /><text x="660" y="159" textAnchor="middle" fill="white" fontSize="8">JP</text>
          </svg>
          <div className="absolute bottom-3 right-3 glass-panel rounded-lg px-3 py-1.5">
            <span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
              <Globe size={12} className="inline mr-1" />8 / 195 countries (4.1%)
            </span>
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium" style={{ color: "var(--text-primary, #fff)" }}>Recent Submissions</h2>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {MOCK_SUBMISSIONS.slice(0, 5).map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3" style={{ color: "var(--text-primary, #fff)" }}>{s.country}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary, #888)" }}>{s.region}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary, #666)" }}>{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmissionsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Submissions</h1>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <Th>Country</Th><Th>Region</Th><Th>Respondent</Th><Th>Status</Th><Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SUBMISSIONS.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                <Td bold>{s.country}</Td>
                <Td>{s.region}</Td>
                <Td>{s.name}</Td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <Td dim>{s.date}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const regionData = [
    { region: "Latin America", count: 14, color: "#3B82F6" },
    { region: "Africa", count: 12, color: "#22C55E" },
    { region: "Europe", count: 9, color: "#F97316" },
    { region: "Asia-Pacific", count: 8, color: "#FF6B9D" },
    { region: "Middle East", count: 4, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Analytics</h1>
      <StatsGrid>
        <StatCard label="Total Submissions" value={47} accent="var(--brand-blue, #3B82F6)" />
        <StatCard label="Submitted" value={31} accent="var(--brand-green, #22C55E)" subtitle="66%" />
        <StatCard label="Reviewed" value={12} accent="var(--brand-orange, #F97316)" subtitle="26%" />
        <StatCard label="Drafts" value={4} accent="var(--text-secondary, #888)" subtitle="8%" />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region bar chart */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary, #fff)" }}>By Region</h2>
          <div className="space-y-3">
            {regionData.map((r) => (
              <div key={r.region} className="flex items-center gap-3">
                <span className="text-xs w-28 shrink-0" style={{ color: "var(--text-secondary, #888)" }}>{r.region}</span>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(r.count / 14) * 100}%`, background: r.color }}
                  />
                </div>
                <span className="text-xs w-6 text-right" style={{ color: r.color }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theme donut */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary, #fff)" }}>Theme Coverage</h2>
          <div className="flex items-center justify-center gap-8">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6B9D" strokeWidth="12" strokeDasharray="62.8 188.5" strokeDashoffset="0" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray="56.5 194.8" strokeDashoffset="-62.8" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="69.1 182.2" strokeDashoffset="-119.3" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F97316" strokeWidth="12" strokeDasharray="62.8 188.5" strokeDashoffset="-188.4" transform="rotate(-90 50 50)" />
            </svg>
            <div className="space-y-2 text-xs">
              {Object.entries(THEME_COLORS).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  <span style={{ color: "var(--text-secondary, #888)" }}>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Cross-Country Comparison</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary, #888)" }}>
          Theme coverage, policy maturity, and implementation readiness across all submissions.
        </p>
      </div>
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <Th>Country</Th><Th>Region</Th>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "var(--brand-pink, #FF6B9D)" }}>Self</th>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "var(--brand-green, #22C55E)" }}>Community</th>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "var(--brand-blue, #3B82F6)" }}>Institutions</th>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "var(--brand-orange, #F97316)" }}>Systems</th>
                <Th>Maturity</Th><Th>Readiness</Th><Th>SDGs</Th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPARISON.map((row) => (
                <tr key={row.country} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2"><span className="font-medium" style={{ color: "var(--text-primary, #fff)" }}>{row.country}</span></td>
                  <td className="px-3 py-2" style={{ color: "var(--text-primary, #fff)" }}>{row.region}</td>
                  <td className="px-3 py-2"><Dots filled={row.self} total={3} color="var(--brand-pink, #FF6B9D)" /></td>
                  <td className="px-3 py-2"><Dots filled={row.community} total={3} color="var(--brand-green, #22C55E)" /></td>
                  <td className="px-3 py-2"><Dots filled={row.institutions} total={3} color="var(--brand-blue, #3B82F6)" /></td>
                  <td className="px-3 py-2"><Dots filled={row.systems} total={3} color="var(--brand-orange, #F97316)" /></td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: MATURITY_COLORS[row.maturity], border: `1px solid ${MATURITY_COLORS[row.maturity]}` }}>
                      {row.maturity}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${(row.readiness / 10) * 100}%`, background: row.readiness >= 7 ? "var(--brand-green, #22C55E)" : row.readiness >= 4 ? "var(--brand-orange, #F97316)" : "var(--brand-pink, #FF6B9D)" }} />
                      </div>
                      <span className="text-[10px]" style={{ color: row.readiness >= 7 ? "var(--brand-green, #22C55E)" : row.readiness >= 4 ? "var(--brand-orange, #F97316)" : "var(--brand-pink, #FF6B9D)" }}>{row.readiness}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2" style={{ color: "var(--text-primary, #fff)" }}>{row.sdgs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Reports</h1>
        <div className="flex gap-2 flex-wrap">
          <button className="glass-button-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
            <FileDown size={16} />Download PDF
          </button>
          <button className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
            <FileDown size={16} />PDF + AI Summary
          </button>
          <button className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
            <Sheet size={16} />CSV Export
          </button>
          <button className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
            <FileText size={16} />JSON
          </button>
        </div>
      </div>
      <div className="glass-panel rounded-xl p-6">
        <p className="text-sm" style={{ color: "var(--text-secondary, #888)" }}>
          Generate an institutional report with aggregated submission data, theme analysis,
          and regional breakdowns. Reports are generated as JSON and can be exported to PDF.
        </p>
      </div>
    </div>
  );
}

function SearchView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Semantic Search</h1>
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search submissions by meaning... e.g. 'digital literacy programs for rural youth'"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
          <button className="glass-button-primary px-6 py-2.5 rounded-lg text-sm">
            <Search size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { score: 0.92, country: "Kenya", theme: "community", text: "Our digital literacy program reaches 12,000 rural youth through mobile-first platforms..." },
            { score: 0.87, country: "Brazil", theme: "institutions", text: "The Ministry of Education has integrated digital skills training into the national curriculum..." },
            { score: 0.81, country: "India", theme: "self", text: "Youth-led digital cooperatives in rural Maharashtra provide technology access..." },
          ].map((r, i) => (
            <div key={i} className="glass-panel rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "var(--brand-green, #22C55E)", border: "1px solid var(--brand-green, #22C55E)" }}>
                  {(r.score * 100).toFixed(0)}% match
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>{r.country}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: THEME_COLORS[r.theme as keyof typeof THEME_COLORS], border: `1px solid ${THEME_COLORS[r.theme as keyof typeof THEME_COLORS]}` }}>
                  {r.theme}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-primary, #fff)" }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditView() {
  const ACTION_COLORS: Record<string, string> = {
    create: "var(--brand-green, #22C55E)",
    invite: "var(--brand-orange, #F97316)",
    export: "var(--brand-orange, #F97316)",
    login: "var(--brand-blue, #3B82F6)",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Audit Log</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary, #888)" }}>
          Security and activity events for this organization.
        </p>
      </div>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <Th>Time</Th><Th>User</Th><Th>Action</Th><Th>Resource</Th><Th>IP</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.map((e) => {
              const base = e.action.split(".")[0];
              const color = ACTION_COLORS[base] ?? "var(--text-secondary, #888)";
              return (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3"><span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>{e.time}</span></td>
                  <td className="px-4 py-3" style={{ color: "var(--text-primary, #fff)" }}>{e.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ color, border: `1px solid ${color}` }}>{e.action}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary, #888)" }}>{e.resource}</td>
                  <td className="px-4 py-3"><span className="text-xs font-mono" style={{ color: "var(--text-secondary, #666)" }}>{e.ip}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView() {
  const members = [
    { email: "admin@globalcall.org", name: "Admin", role: "org_admin", region: "—" },
    { email: "maria@gov.ar", name: "María González", role: "country_focal_point", region: "Argentina" },
    { email: "amina@youth.ke", name: "Amina Osei", role: "country_focal_point", region: "Kenya" },
    { email: "coord.latam@globalcall.org", name: "Carlos Ruiz", role: "regional_coordinator", region: "Latin America" },
    { email: "observer@un.org", name: "Jane Smith", role: "observer", region: "—" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Members</h1>
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Scope</Th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} className="border-b border-white/5 hover:bg-white/5">
                <Td bold>{m.name}</Td>
                <Td>{m.email}</Td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs" style={{ color: "var(--brand-blue, #3B82F6)", border: "1px solid var(--brand-blue, #3B82F6)" }}>
                    {m.role.replace(/_/g, " ")}
                  </span>
                </td>
                <Td dim>{m.region}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary, #fff)" }}>Settings</h1>
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>Organization Name</label>
          <p style={{ color: "var(--text-primary, #fff)" }}>Global Call COP</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>Slug</label>
          <p style={{ color: "var(--text-primary, #fff)" }}>global-call-cop</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>Description</label>
          <p style={{ color: "var(--text-primary, #fff)" }}>Youth policy implementation coordination for COP framework</p>
        </div>
      </div>
    </div>
  );
}

// Shared components

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary, #888)" }}>
      {children}
    </th>
  );
}

function Td({ children, bold, dim }: { children: React.ReactNode; bold?: boolean; dim?: boolean }) {
  return (
    <td className="px-4 py-3 whitespace-nowrap" style={{ color: dim ? "var(--text-secondary, #666)" : "var(--text-primary, #fff)", fontWeight: bold ? 500 : 400 }}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "var(--brand-blue, #3B82F6)",
    reviewed: "var(--brand-green, #22C55E)",
    draft: "var(--text-secondary, #888)",
  };
  const c = colors[status] ?? colors.draft;
  return (
    <span className="px-2 py-0.5 rounded text-xs" style={{ color: c, border: `1px solid ${c}` }}>
      {status}
    </span>
  );
}

function Dots({ filled, total, color }: { filled: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(total)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < filled ? color : "rgba(255,255,255,0.1)" }} />
      ))}
    </div>
  );
}
