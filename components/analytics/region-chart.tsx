"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RegionChartProps {
  data: { region: string; count: number }[];
}

const COLORS = [
  "var(--brand-blue)",
  "var(--brand-green)",
  "var(--brand-orange)",
  "var(--brand-pink)",
  "#6366f1",
  "#a855f7",
];

export function RegionChart({ data }: RegionChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <p style={{ color: "var(--text-secondary, #888)" }}>No data yet</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary, #888)" }}>
        Submissions by Region
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <XAxis type="number" stroke="#555" fontSize={12} />
          <YAxis type="category" dataKey="region" stroke="#555" fontSize={11} width={110} />
          <Tooltip
            contentStyle={{
              background: "#101010",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
