"use client";

import type { ComparisonRow } from "@/lib/analytics/comparison";
import { THEME_DEFINITIONS } from "@/lib/content";

interface ComparisonMatrixProps {
  rows: ComparisonRow[];
}

const THEME_COLORS: Record<string, string> = {
  self: "var(--brand-pink)",
  community: "var(--brand-green)",
  institutions: "var(--brand-blue)",
  systems: "var(--brand-orange)",
};

const MATURITY_COLORS: Record<string, string> = {
  emerging: "#F97316",
  developing: "#EAB308",
  established: "#22C55E",
  advanced: "#3B82F6",
};

export function ComparisonMatrix({ rows }: ComparisonMatrixProps) {
  if (rows.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <p style={{ color: "var(--text-secondary, #888)" }}>No submissions to compare.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <Th>Country</Th>
              <Th>Region</Th>
              {THEME_DEFINITIONS.map((t) => (
                <Th key={t.key} style={{ color: THEME_COLORS[t.key] }}>
                  {t.key.charAt(0).toUpperCase() + t.key.slice(1)}
                </Th>
              ))}
              <Th>Maturity</Th>
              <Th>Readiness</Th>
              <Th>SDGs</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.countryCode} className="border-b border-white/5 hover:bg-white/5">
                <Td>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {row.countryCode}
                  </span>
                </Td>
                <Td>{row.region}</Td>
                {THEME_DEFINITIONS.map((t) => {
                  const theme = row.themes[t.key];
                  if (!theme) return <Td key={t.key}>—</Td>;
                  return (
                    <Td key={t.key}>
                      <CoverageCell
                        filled={theme.fieldCount}
                        total={3}
                        avgLength={theme.avgLength}
                        color={THEME_COLORS[t.key]}
                      />
                    </Td>
                  );
                })}
                <Td>
                  {row.classification?.policyMaturity ? (
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{
                        color: MATURITY_COLORS[row.classification.policyMaturity] ?? "#888",
                        border: `1px solid ${MATURITY_COLORS[row.classification.policyMaturity] ?? "#555"}`,
                      }}
                    >
                      {row.classification.policyMaturity}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-secondary, #666)" }}>—</span>
                  )}
                </Td>
                <Td>
                  {row.classification?.implementationReadiness != null ? (
                    <ReadinessBar value={row.classification.implementationReadiness} />
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  {row.classification?.sdgAlignment?.slice(0, 3).join(", ") ?? "—"}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      className="text-left px-3 py-2 font-medium whitespace-nowrap"
      style={{ color: "var(--text-secondary, #888)", ...style }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-3 py-2 whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
      {children}
    </td>
  );
}

function CoverageCell({
  filled,
  total,
  avgLength,
  color,
}: {
  filled: number;
  total: number;
  avgLength: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: i < filled ? color : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
      {filled > 0 && (
        <span className="text-[9px] ml-1" style={{ color: "var(--text-secondary, #666)" }}>
          ~{avgLength}ch
        </span>
      )}
    </div>
  );
}

function ReadinessBar({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  const color = value >= 7 ? "var(--brand-green)" : value >= 4 ? "var(--brand-orange)" : "var(--brand-pink)";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px]" style={{ color }}>{value}</span>
    </div>
  );
}
