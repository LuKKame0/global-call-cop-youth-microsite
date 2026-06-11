"use client";

import { useState } from "react";

interface MapPoint {
  countryCode: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  submissionCount: number;
}

interface SubmissionMapProps {
  points: MapPoint[];
  coverage: { total: number; covered: number; percentage: number };
}

const REGION_COLORS: Record<string, string> = {
  Africa: "var(--brand-orange)",
  "Asia-Pacific": "var(--brand-pink)",
  Europe: "var(--brand-blue)",
  Americas: "var(--brand-green)",
};

function toSvg(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 800;
  const y = ((90 - lat) / 180) * 400;
  return [x, y];
}

export function SubmissionMap({ points, coverage }: SubmissionMapProps) {
  const [tooltip, setTooltip] = useState<MapPoint | null>(null);

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary, #888)" }}>
          Global Coverage
        </h3>
        <span className="text-xs" style={{ color: "var(--brand-green)" }}>
          {coverage.covered}/{coverage.total} countries ({coverage.percentage}%)
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto"
          style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8 }}
        >
          {/* Grid lines */}
          {[...Array(7)].map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(i * 400) / 6}
              x2={800}
              y2={(i * 400) / 6}
              stroke="rgba(255,255,255,0.05)"
            />
          ))}
          {[...Array(13)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={(i * 800) / 12}
              y1={0}
              x2={(i * 800) / 12}
              y2={400}
              stroke="rgba(255,255,255,0.05)"
            />
          ))}

          {/* Data points */}
          {points.map((point) => {
            const [x, y] = toSvg(point.lat, point.lng);
            const r = Math.min(4 + point.submissionCount * 2, 14);
            const color = REGION_COLORS[point.region] ?? "var(--brand-blue)";

            return (
              <g key={point.countryCode}>
                <circle
                  cx={x}
                  cy={y}
                  r={r + 4}
                  fill={color}
                  opacity={0.15}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={color}
                  opacity={0.8}
                  className="cursor-pointer transition-all hover:opacity-100"
                  onMouseEnter={() => setTooltip(point)}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={r > 8 ? 8 : 6}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {point.submissionCount}
                </text>
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <div
            className="absolute glass-panel rounded-lg p-3 pointer-events-none z-10"
            style={{ top: 8, right: 8 }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {tooltip.name} ({tooltip.countryCode})
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
              {tooltip.region} · {tooltip.submissionCount} submission{tooltip.submissionCount !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
              {region}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
