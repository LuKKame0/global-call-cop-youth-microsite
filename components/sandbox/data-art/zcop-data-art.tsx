"use client";

import { motion, useReducedMotion } from "framer-motion";

import { StoryBeats } from "@/components/sandbox/story-scroll";
import { AnimatedNumber } from "@/components/visual-effects";
import {
  ZCOP_DAILY_CYCLE,
  ZCOP_DAILY_THEMES,
  ZCOP_IMPACT_METRICS,
  ZCOP_OUTPUTS,
  ZCOP_PREP_FUNNEL,
  ZCOP_STORY_BEATS,
} from "@/lib/sandbox/content";

export function ZcopHeroDataArt() {
  return (
    <div className="mt-6 overflow-hidden rounded-[1.2rem] border border-[var(--glass-border)]">
      <div className="grid grid-cols-5 gap-px bg-[var(--glass-border)]">
        {ZCOP_DAILY_THEMES.map((day, i) => (
          <div key={day.day} className="flex flex-col bg-[var(--glass-surface)] p-2 sm:p-3">
            <motion.div
              className="w-full rounded-md"
              style={{
                backgroundColor: day.accent,
                minHeight: `${48 + i * 10}px`,
                transformOrigin: "bottom",
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
            <p className="mt-2 text-[8px] uppercase tracking-[0.1em] text-[var(--text-faint)] sm:text-[9px]">
              {day.day.split("·")[0]?.trim()}
            </p>
            <p
              className="font-display text-[10px] uppercase tracking-[0.05em] sm:text-xs"
              style={{ color: day.accent }}
            >
              {day.theme}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ZcopStorySection() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">Data story</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.92] tracking-[0.04em] text-[var(--text-primary)]">
          Five days that become a year of proof
        </h2>
      </div>
      <StoryBeats
        beats={ZCOP_STORY_BEATS}
        accent="var(--brand-blue)"
        visual={(i) => {
          switch (i) {
            case 0:
              return <FractureArt />;
            case 1:
              return <SummitPulseArt />;
            case 2:
              return <ThemeAscentArt />;
            case 3:
              return <CycleDialArt />;
            default:
              return null;
          }
        }}
      />
    </section>
  );
}

export function ZcopImpactDashboard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border)] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
        Impact targets — the numbers we design toward
      </p>
      <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
        Coordinated nationally. Amplified globally.
      </h3>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ZCOP_IMPACT_METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-panel p-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--brand-blue)]">
              {/^\d+$/.test(String(m.value)) ? (
                <AnimatedNumber value={`${m.value}${m.suffix}`} />
              ) : (
                `${m.value}${m.suffix}`
              )}
            </span>
            <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{m.label}</p>
            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{m.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ZcopThemeAscentInfographic() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--glass-border)] p-6 sm:p-8">
      <ThemeAscentArt large />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ZCOP_DAILY_THEMES.map((day) => (
          <div key={day.day} className="glass-panel p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{day.day}</p>
            <p className="mt-1 font-display text-lg uppercase" style={{ color: day.accent }}>
              {day.theme}
            </p>
            <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">{day.scale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ZcopCycleDialInfographic() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">Daily rhythm</p>
        <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          Ten sessions. One accumulating cycle.
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
          What looks like repetition across five days is accumulation. Each session has a
          fixed function in the pipeline — from overnight mapping to evening finalisation.
        </p>
      </div>
      <CycleDialArt large />
    </div>
  );
}

export function ZcopOutputStackInfographic() {
  return (
    <div className="space-y-3">
      {ZCOP_OUTPUTS.map((output, i) => (
        <motion.div
          key={output.title}
          className="glass-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-5"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-display text-sm"
            style={{ borderColor: "var(--brand-orange)", color: "var(--brand-orange)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-display text-lg uppercase tracking-[0.04em] text-[var(--text-primary)]">
              {output.title}
            </h4>
            <p className="mt-1 text-sm leading-7 text-[var(--text-muted)]">{output.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ZcopPrepFunnelInfographic() {
  return (
    <div className="glass-panel overflow-hidden p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
        Critical path — preparation funnel
      </p>
      <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
        Hubs that arrive ready, deliver
      </h3>

      <div className="mt-8 space-y-4">
        {ZCOP_PREP_FUNNEL.map((step, i) => (
          <div key={step.phase} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--text-primary)]">
                {step.phase} · {step.label}
              </span>
              <span className="text-[var(--brand-blue)]">{step.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--glass-button-secondary-bg)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-green)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${step.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemeAscentArt({ large = false }: { large?: boolean }) {
  const h = large ? 180 : 140;
  const w = large ? 480 : 360;
  const count = ZCOP_DAILY_THEMES.length;
  const points = ZCOP_DAILY_THEMES.map((day, i) => ({
    x: 40 + (count > 1 ? i / (count - 1) : 0) * (w - 80),
    y: h - 24 - i * (large ? 28 : 22),
    ...day,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto w-full max-w-xl" aria-hidden>
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--brand-blue)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {points.map((p) => (
        <g key={p.day}>
          <circle cx={p.x} cy={p.y} r="7" fill="var(--page-background)" stroke={p.accent} strokeWidth="2" />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fill={p.accent} fontSize="9" fontWeight="700">
            {p.theme}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CycleDialArt({ large = false }: { large?: boolean }) {
  const size = large ? 340 : 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const sessions = ZCOP_DAILY_CYCLE.slice(0, 8);

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto max-w-[340px]"
      aria-label="Daily cycle dial"
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--glass-border)" strokeWidth="1" />
      {sessions.map((slot, i) => {
        const angle = (i / sessions.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + (r + 18) * Math.cos(angle);
        const y = cy + (r + 18) * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        return (
          <g key={slot.session}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--brand-blue)" strokeWidth="1" opacity="0.25" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--text-faint)" fontSize="7">
              {slot.session.split(" ")[0]}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="32" fill="var(--glass-surface)" stroke="var(--brand-orange)" strokeWidth="2" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--brand-orange)" fontSize="12" fontWeight="700">
        10
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-faint)" fontSize="8">
        sessions
      </text>
    </svg>
  );
}

function FractureArt() {
  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={90 + i * 70}
          y1="40"
          x2={110 + i * 70}
          y2="200"
          stroke="var(--brand-pink)"
          strokeWidth="2"
          strokeDasharray="8 6"
          opacity="0.7"
        />
      ))}
      <text x="180" y="220" textAnchor="middle" fill="var(--text-faint)" fontSize="11">
        3 systemic fractures
      </text>
    </svg>
  );
}

function SummitPulseArt() {
  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.rect
          key={i}
          x={56 + i * 48}
          y={160 - i * 20}
          width="36"
          height={36 + i * 20}
          rx="4"
          fill="var(--brand-blue)"
          opacity={0.35 + i * 0.12}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          style={{ transformOrigin: `${74 + i * 48}px 196px` }}
        />
      ))}
      <text x="180" y="220" textAnchor="middle" fill="var(--text-faint)" fontSize="11">
        5 days · cumulative work
      </text>
    </svg>
  );
}
