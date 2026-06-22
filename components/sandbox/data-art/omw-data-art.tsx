"use client";

import { motion, useReducedMotion } from "framer-motion";

import { StoryBeats } from "@/components/sandbox/story-scroll";
import { AnimatedNumber } from "@/components/visual-effects";
import {
  OMW_GAP_STATS,
  OMW_PIPELINE,
  OMW_STORY_BEATS,
  OMW_TIMELINE,
} from "@/lib/sandbox/content";

export function OmwHeroDataArt() {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--glass-border)] bg-[var(--glass-surface)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,70,13,0.1),transparent_50%)]" />
      <div className="relative grid gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-center py-2">
          <PipelineOrbitSvg compact />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Countries", value: "170+", accent: "var(--brand-blue)" },
            { label: "Loop steps", value: "5", accent: "var(--brand-green)" },
            { label: "Platforms", value: "3", accent: "var(--brand-orange)" },
            { label: "Fee", value: "$0", accent: "var(--brand-pink)" },
          ].map((m) => (
            <div key={m.label} className="glass-panel p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{m.label}</p>
              <p
                className="mt-1 font-display text-xl uppercase tracking-[0.04em]"
                style={{ color: m.accent }}
              >
                {/^\d+$/.test(m.value) ? <AnimatedNumber value={m.value} /> : m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OmwStorySection() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">Data story</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.92] tracking-[0.04em] text-[var(--text-primary)]">
          From local signal to global proof
        </h2>
      </div>
      <StoryBeats
        beats={OMW_STORY_BEATS}
        accent="var(--brand-orange)"
        visual={(i) => {
          switch (i) {
            case 0:
              return <NetworkPulseArt />;
            case 1:
              return <GapSignalArt />;
            case 2:
              return <PipelineOrbitSvg />;
            case 3:
              return <AccountabilityArt />;
            default:
              return null;
          }
        }}
      />
    </section>
  );
}

export function OmwGapInfographic() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-surface)] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
        The implementation gap — measured in silence
      </p>
      <h3 className="mt-3 max-w-lg font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
        Where the pipeline breaks before it begins
      </h3>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {OMW_GAP_STATS.map((stat, i) => (
          <GapBar key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
        These are illustrative coordination gaps — the pattern repeats in every country:
        intelligence exists, policy is drafted, commitments are announced. Without
        infrastructure, none of it compounds.
      </p>
    </div>
  );
}

function GapBar({
  stat,
  index,
}: {
  stat: (typeof OMW_GAP_STATS)[number];
  index: number;
}) {
  const colors = ["var(--brand-pink)", "var(--brand-orange)", "var(--brand-blue)"];
  const color = colors[index] ?? colors[0];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">{stat.label}</span>
        <span className="font-display text-3xl uppercase" style={{ color }}>
          <AnimatedNumber value={`${stat.value}${stat.unit}`} />
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--glass-button-secondary-bg)]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${stat.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="text-xs leading-6 text-[var(--text-muted)]">{stat.narrative}</p>
    </div>
  );
}

export function OmwTimelineRiver() {
  return (
    <div className="relative pl-0 lg:pl-6">
      <div className="absolute bottom-0 left-3 top-0 hidden w-px bg-gradient-to-b from-[var(--brand-orange)] via-[var(--brand-blue)] to-[var(--brand-green)] opacity-40 lg:block" />

      <div className="space-y-4">
        {OMW_TIMELINE.map((item, i) => (
          <motion.div
            key={item.period}
            className={`glass-panel relative p-5 ${i % 2 === 0 ? "lg:mr-8" : "lg:ml-8"}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <p className="font-display text-base uppercase tracking-[0.04em] text-[var(--brand-orange)]">
              {item.period}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PipelineOrbitSvg({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const size = compact ? 240 : 320;
  const r = compact ? 82 : 108;
  const cx = size / 2;
  const cy = size / 2;

  const nodes = OMW_PIPELINE.map((p, i) => {
    const angle = (i / OMW_PIPELINE.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...p,
      shortRole: p.role.replace(/^The /, ""),
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto max-w-full"
      aria-label="Three-platform coordination loop"
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--glass-border)" strokeWidth="1.5" />

      {!reduce &&
        nodes.map((node, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={`arc-${node.step}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke={node.accent}
              strokeWidth="1.5"
              strokeDasharray="5 6"
              initial={{ pathLength: 0, opacity: 0.4 }}
              whileInView={{ pathLength: 1, opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
          );
        })}

      {nodes.map((node) => (
        <g key={node.step}>
          <circle
            cx={node.x}
            cy={node.y}
            r={compact ? 20 : 26}
            fill="var(--glass-surface)"
            stroke={node.accent}
            strokeWidth="2"
          />
          <text x={node.x} y={node.y - 2} textAnchor="middle" fill={node.accent} fontSize={compact ? 8 : 10} fontWeight="700">
            {node.step}
          </text>
          <text x={node.x} y={node.y + (compact ? 10 : 12)} textAnchor="middle" fill="var(--text-muted)" fontSize={compact ? 6 : 7}>
            {node.shortRole}
          </text>
        </g>
      ))}

      <text x={cx} y={cy + 3} textAnchor="middle" fill="var(--text-faint)" fontSize={compact ? 7 : 9}>
        LOOP
      </text>
    </svg>
  );
}

function NetworkPulseArt() {
  const dots = Array.from({ length: 36 }, (_, i) => ({
    x: 24 + (i % 6) * 52,
    y: 36 + Math.floor(i / 6) * 42,
    delay: (i % 6) * 0.08,
  }));

  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden>
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x}
          cy={d.y}
          r="3"
          fill="var(--brand-blue)"
          initial={{ opacity: 0.3 }}
          whileInView={{ opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: d.delay }}
        />
      ))}
      <text x="180" y="220" textAnchor="middle" fill="var(--text-faint)" fontSize="11">
        170+ countries · latent civic signal
      </text>
    </svg>
  );
}

function GapSignalArt() {
  const breaks = [
    { y: 60, label: "Intelligence", color: "var(--brand-pink)" },
    { y: 120, label: "Policy", color: "var(--brand-orange)" },
    { y: 180, label: "Commitment", color: "var(--brand-blue)" },
  ];

  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden>
      <line x1="40" y1="30" x2="320" y2="30" stroke="var(--brand-green)" strokeWidth="2" opacity="0.5" />
      {breaks.map((b) => (
        <g key={b.label}>
          <line x1="40" y1={b.y} x2="130" y2={b.y} stroke={b.color} strokeWidth="2" />
          <line x1="230" y1={b.y} x2="320" y2={b.y} stroke={b.color} strokeWidth="2" strokeDasharray="6 8" opacity="0.7" />
          <text x="180" y={b.y + 4} textAnchor="middle" fill="var(--brand-pink)" fontSize="16" fontWeight="700">
            ✕
          </text>
          <text x="40" y={b.y - 10} fill="var(--text-muted)" fontSize="10">
            {b.label}
          </text>
        </g>
      ))}
      <text x="180" y="220" textAnchor="middle" fill="var(--text-faint)" fontSize="11">
        3 disconnects · silent vetoes on change
      </text>
    </svg>
  );
}

function AccountabilityArt() {
  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="70"
          y={36 + i * 44}
          width="220"
          height="32"
          rx="8"
          fill="var(--glass-surface)"
          stroke="var(--brand-orange)"
          strokeWidth="1.5"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
      <text x="180" y="220" textAnchor="middle" fill="var(--text-faint)" fontSize="11">
        Posted → visible → accountable
      </text>
    </svg>
  );
}
