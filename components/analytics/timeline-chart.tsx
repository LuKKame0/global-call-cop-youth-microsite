"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimelineChartProps {
  data: { date: string; count: number }[];
}

export function TimelineChart({ data }: TimelineChartProps) {
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
        Submissions Over Time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient-submissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#555" fontSize={11} />
          <YAxis stroke="#555" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#101010",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--brand-blue)"
            fill="url(#gradient-submissions)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
