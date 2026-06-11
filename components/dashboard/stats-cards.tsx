interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
  subtitle?: string;
}

export function StatCard({ label, value, accent, subtitle }: StatCardProps) {
  return (
    <div className="glass-panel rounded-xl p-5 space-y-1">
      <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary, #888)" }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold"
        style={{ color: accent ?? "var(--text-primary)" }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-xs" style={{ color: "var(--text-secondary, #666)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
