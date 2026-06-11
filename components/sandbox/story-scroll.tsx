"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/motion-primitives";
import { AnimatedNumber } from "@/components/visual-effects";
import type { ReactNode } from "react";

export interface StoryBeat {
  id: string;
  chapter: string;
  headline: string;
  body: string;
  stat: { value: string; label: string };
  accent: string;
}

interface StoryBeatsProps {
  beats: readonly StoryBeat[];
  visual: (index: number) => ReactNode;
  accent?: string;
}

export function StoryBeats({ beats, visual, accent = "var(--brand-blue)" }: StoryBeatsProps) {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-5">
      {beats.map((beat, index) => (
        <Reveal key={beat.id} delay={index * 0.04}>
          <article className="glass-panel-strong overflow-hidden">
            <div
              className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div
                className="relative flex min-h-[240px] items-center justify-center overflow-hidden border-b border-[var(--glass-border)] p-5 sm:min-h-[280px] sm:p-6 lg:min-h-[320px] lg:border-b-0 lg:border-r"
                style={{
                  background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${accent} 14%, transparent), transparent 55%)`,
                }}
              >
                {!reduce ? (
                  <motion.div
                    className="relative z-10 w-full"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {visual(index)}
                  </motion.div>
                ) : (
                  <div className="relative z-10 w-full">{visual(index)}</div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-4 p-5 sm:p-6 lg:p-8">
                <p className="text-xs uppercase tracking-[0.24em]" style={{ color: beat.accent }}>
                  {beat.chapter}
                </p>
                <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] uppercase leading-[0.95] tracking-[0.04em] text-[var(--text-primary)]">
                  {beat.headline}
                </h3>
                <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">{beat.body}</p>
                <div className="glass-panel inline-flex w-fit flex-col gap-1 px-5 py-4">
                  <span
                    className="font-display text-3xl uppercase tracking-[0.04em] sm:text-4xl"
                    style={{ color: beat.accent }}
                  >
                    {/^\d+$/.test(beat.stat.value) ? (
                      <AnimatedNumber value={beat.stat.value} />
                    ) : (
                      beat.stat.value
                    )}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    {beat.stat.label}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/** @deprecated Use StoryBeats — kept as alias to avoid broken sticky scrollytelling. */
export const StoryScroll = StoryBeats;
