"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CalmModal } from "@/components/calm-modal";
import {
  Reveal,
  RevealStagger,
  StaggerItem,
} from "@/components/motion-primitives";
import { ThemeIcon, IconArrow, IconDoc, IconSpark } from "@/components/icons";
import { MobileCarousel } from "@/components/mobile-carousel";
import {
  LANDING_METRICS,
  LANDING_STORY_BEATS,
  THEME_DEFINITIONS,
} from "@/lib/content";

interface InsightModalState {
  eyebrow: string;
  title: string;
  accentColor: string;
  body: readonly string[];
}

export function LandingPage() {
  const [activeInsight, setActiveInsight] = useState<InsightModalState | null>(
    null,
  );

  // Global pointer-driven 3D tilt for any element flagged with .tilt-3d.
  // Why effect: StaggerItem renders its own element — we delegate mouse
  // tracking from a single document-level listener so we don't need to
  // wrap each card in a custom component.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intensity = 7;
    let rafId = 0;
    let pendingTarget: HTMLElement | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      rafId = 0;
      const el = pendingTarget;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (pendingX - rect.left) / rect.width;
      const py = (pendingY - rect.top) / rect.height;
      const ry = (px - 0.5) * intensity * 2;
      const rx = -(py - 0.5) * intensity * 2;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(".tilt-3d");
      if (!target) return;
      pendingTarget = target;
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(".tilt-3d");
      if (!target) return;
      target.style.setProperty("--rx", "0deg");
      target.style.setProperty("--ry", "0deg");
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave, true);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.075),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(55,171,250,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,145,254,0.055),transparent_28%)]" />

      <section className="mx-auto grid max-w-7xl gap-5 px-3 pb-8 pt-4 sm:px-5 lg:grid-cols-[1.14fr_0.86fr] lg:items-stretch lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,171,250,0.14),transparent_28%),linear-gradient(180deg,transparent,rgba(255,255,255,0.03))]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.24em] text-white/62">
                So, what are we doing?
              </p>
              <div className="space-y-5">
                <h1 className="max-w-[8ch] font-display text-[clamp(3.8rem,12vw,8rem)] uppercase leading-[0.84] tracking-[0.05em] text-white">
                  COP <span className="text-white/28">on</span> Youth Policy Impl.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                  A global submission environment for national focal points who
                  need more than a declaration. The platform turns country
                  experience into a framework that can travel from local
                  implementation reality to multilateral synthesis.
                </p>
              </div>

              <RevealStagger className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
                {LANDING_METRICS.map((metric) => (
                  <StaggerItem
                    key={metric.label}
                    type="button"
                    onClick={() =>
                      setActiveInsight({
                        eyebrow: metric.label,
                        title: metric.value,
                        accentColor: "var(--brand-blue)",
                        body: metric.expandedBody,
                      })
                    }
                    className="glass-panel tilt-3d group p-4 text-left"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/40 transition group-hover:text-white/58">
                      {metric.label}
                    </p>
                    <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white transition group-hover:translate-x-1">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/56">
                      {metric.detail}
                    </p>
                  </StaggerItem>
                ))}
              </RevealStagger>

              <div className="glass-panel max-w-3xl p-5 text-sm leading-7 text-white/78 sm:text-base">
                <strong className="font-semibold text-white">
                  This COP is built for implementation.
                </strong>{" "}
                The four-layer arc is not decorative. It is the sequence through
                which change becomes legible: first confidence, then collective
                action, then institutional leverage, then the structural shift
                that makes youth policy stick.
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/insights" className="glass-button-primary">
                  <IconArrow className="h-20 w-20" />
                  Start the framework
                </Link>
                <Link href="/faq" className="glass-button-secondary">
                  <IconDoc className="h-20 w-20" />
                  See logic, examples &amp; FAQ
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-white/46">
              <span>National focal point workflow</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)]" />
              <span>Built for mobile drafting and review</span>
            </div>
          </div>
        </div>

        <MobileCarousel desktopClassName="gap-3">
          {THEME_DEFINITIONS.map((theme) => (
            <button
              key={theme.key}
              type="button"
              onClick={() =>
                setActiveInsight({
                  eyebrow: `Theme ${theme.number}`,
                  title: theme.fullLabel,
                  accentColor: theme.accentToken,
                  body: theme.expandedBody,
                })
              }
              className="glass-panel tilt-3d group relative overflow-hidden px-5 py-6 text-left sm:px-6 h-full"
            >
              <div
                className="absolute inset-y-0 left-0 w-1 rounded-r-full"
                style={{ backgroundColor: theme.accentToken }}
              />
              <div
                className="pointer-events-none absolute right-3 top-3 h-24 w-24 rounded-full blur-3xl transition group-hover:scale-110"
                style={{ backgroundColor: `${theme.accentToken}30` }}
              />
              <div className="relative space-y-3 pl-3">
                <div className="flex items-center gap-2 text-white/40">
                  <ThemeIcon themeKey={theme.key} className="h-[6.25rem] w-[6.25rem]" style={{ color: theme.accentToken }} />
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/32">
                    Theme {theme.number}
                  </p>
                </div>
                <h2
                  className="font-display text-[2rem] uppercase leading-none tracking-[0.04em] transition group-hover:translate-x-1"
                  style={{ color: theme.accentToken }}
                >
                  {theme.fullLabel}
                </h2>
                <p className="max-w-md text-sm leading-7 text-white/64">
                  {theme.tagline}
                </p>
                <p className="text-sm leading-7 text-white/48">{theme.scale}</p>
              </div>
            </button>
          ))}
        </MobileCarousel>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8 lg:py-10">
        <MobileCarousel desktopClassName="gap-4 grid-cols-3">
          {LANDING_STORY_BEATS.map((beat) => (
            <button
              key={beat.id}
              type="button"
              onClick={() =>
                setActiveInsight({
                  eyebrow: beat.eyebrow,
                  title: beat.title,
                  accentColor: beat.accentToken,
                  body: beat.expandedBody,
                })
              }
              className="glass-panel tilt-3d group p-6 text-left h-full"
            >
              <div className="flex items-center gap-2">
                <IconSpark className="h-20 w-20" style={{ color: beat.accentToken }} />
                <p
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: beat.accentToken }}
                >
                  {beat.eyebrow}
                </p>
              </div>
              <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.04em] text-white transition group-hover:translate-x-1">
                {beat.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
                {beat.detail}
              </p>
            </button>
          ))}
        </MobileCarousel>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8 lg:py-10">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="glass-panel p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">
              Storytelling for policy
            </p>
            <h3 className="mt-4 font-display text-4xl uppercase tracking-[0.04em] text-white">
              The platform starts where youth experience actually begins
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
              Too many international inputs begin at the institutional level.
              This one does not. It begins where participation often breaks:
              belief, trust, pressure, and the social conditions that shape
              whether a young person sees action as realistic.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
              Only after that does the framework move outward into collective
              organisation, then named institutional asks, and finally the
              structural change required to make implementation durable.
            </p>
          </Reveal>

          <MobileCarousel desktopClassName="gap-4 grid-cols-2">
            {THEME_DEFINITIONS.map((theme) => (
              <button
                key={`layer-${theme.key}`}
                type="button"
                onClick={() =>
                  setActiveInsight({
                    eyebrow: `${theme.number}. ${theme.shortLabel}`,
                    title: `${theme.title} as an implementation layer`,
                    accentColor: theme.accentToken,
                    body: theme.expandedBody,
                  })
                }
                className="glass-panel tilt-3d group p-5 text-left h-full"
              >
                <div className="flex items-center gap-2">
                  <ThemeIcon themeKey={theme.key} className="h-20 w-20" style={{ color: theme.accentToken }} />
                  <p
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: theme.accentToken }}
                  >
                    {theme.number.toString().padStart(2, "0")}. {theme.shortLabel}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/58 transition group-hover:text-white/72">
                  {theme.actionHint}
                </p>
              </button>
            ))}
          </MobileCarousel>
        </div>
      </section>

      <CalmModal
        open={Boolean(activeInsight)}
        onClose={() => setActiveInsight(null)}
        eyebrow={activeInsight?.eyebrow}
        title={activeInsight?.title ?? ""}
        accentColor={activeInsight?.accentColor}
        size="wide"
      >
        <div className="space-y-4 text-sm leading-7 text-white/66 sm:text-base">
          {activeInsight?.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </CalmModal>
    </div>
  );
}
