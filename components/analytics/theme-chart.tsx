"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ThemeChartProps {
  data: { themeKey: string; count: number }[];
}

const THEME_COLORS: Record<string, string> = {
  self: "var(--brand-pink)",
  community: "var(--brand-green)",
  institutions: "var(--brand-blue)",
  systems: "var(--brand-orange)",
};

export function ThemeChart({ data }: ThemeChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <p style={{ color: "var(--text-secondary, #888)" }}>No data yet</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.themeKey.charAt(0).toUpperCase() + d.themeKey.slice(1),
    value: d.count,
    color: THEME_COLORS[d.themeKey] ?? "#666",
  }));

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary, #888)" }}>
        RAG Chunks by Theme
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            strokeWidth={0}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#101010",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#888", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
