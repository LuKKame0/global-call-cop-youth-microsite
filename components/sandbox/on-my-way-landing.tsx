import Link from "next/link";

import {
  OmwGapInfographic,
  OmwHeroDataArt,
  OmwStorySection,
  OmwTimelineRiver,
} from "@/components/sandbox/data-art/omw-data-art";
import { SandboxSection } from "@/components/sandbox/sandbox-section";
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion-primitives";
import { IconArrow } from "@/components/icons";
import {
  OMW_ASK_OFFER,
  OMW_PARTNERSHIP_AXES,
  OMW_PIPELINE,
  SANDBOX_CONTACT,
} from "@/lib/sandbox/content";
import { THEME_DEFINITIONS } from "@/lib/content";

export function OnMyWayLanding() {
  return (
    <main className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,70,13,0.08),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(55,171,250,0.06),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,70,13,0.12),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
                Partnership Concept Note · May 2026
              </p>
              <h1 className="font-display text-[clamp(3.2rem,10vw,7rem)] uppercase leading-[0.86] tracking-[0.05em] text-[var(--text-primary)]">
                On <span className="text-[var(--brand-orange)]">My</span> Way
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                The action layer of a three-platform pipeline — from citizen mobilisation
                to public policy, and from public policy to concrete action.{" "}
                <strong className="text-[var(--text-primary)]">What gets posted, gets done.</strong>
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
                  <IconArrow className="h-20 w-20" />
                  Join the pipeline
                </a>
                <Link href="/sandbox/z-cop" className="glass-button-secondary">
                  Explore Z-COP 2026
                </Link>
              </div>
            </div>

            <OmwHeroDataArt />
          </div>
        </div>
      </section>

      <OmwStorySection />

      <SandboxSection
        id="problem"
        eyebrow="Why we are reaching out"
        title="Local energy exists. Infrastructure to channel it does not."
        description="Everywhere in the world, local actors hold direct knowledge of what their communities need — and the relationships to act on it. Yet this energy remains largely unmobilised."
      >
        <OmwGapInfographic />
      </SandboxSection>

      <SandboxSection
        id="pipeline"
        eyebrow="Three platforms, one mission"
        title="Mobilise → Analyse → Implement → Feedback → Refine"
        description="On My Way, The Global Call, and MESA Institute form a coordination loop designed to connect local actors to a global infrastructure of change."
      >
        <RevealStagger className="grid gap-4 lg:grid-cols-3" stagger={0.08}>
          {OMW_PIPELINE.map((platform) => (
            <StaggerItem key={platform.step} className="glass-panel relative overflow-hidden p-6">
              <div
                className="absolute inset-y-0 left-0 w-1 rounded-r-full"
                style={{ backgroundColor: platform.accent }}
              />
              <p className="pl-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {platform.step} · {platform.role}
              </p>
              <h3
                className="mt-3 pl-3 font-display text-3xl uppercase tracking-[0.04em]"
                style={{ color: platform.accent }}
              >
                {platform.name}
              </h3>
              <p className="mt-4 pl-3 text-sm leading-7 text-[var(--text-muted)]">
                {platform.description}
              </p>
            </StaggerItem>
          ))}
        </RevealStagger>
      </SandboxSection>

      <SandboxSection
        id="partnership"
        eyebrow="What we propose"
        title="Four axes of structured partnership"
        description="A progressive partnership built around concrete axes — activated depending on your context and capacity."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {OMW_PARTNERSHIP_AXES.map((axis, index) => (
            <Reveal key={axis.title} delay={index * 0.05} className="glass-panel p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-blue)]">
                Axis {index + 1} · {axis.platform}
              </p>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {axis.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{axis.description}</p>
            </Reveal>
          ))}
        </div>
      </SandboxSection>

      <SandboxSection
        id="themes"
        eyebrow="Youth COP framework"
        title="Four themes for change"
        description="The COP framework moves through four scales — from individual agency to structural transformation."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {THEME_DEFINITIONS.map((theme) => (
            <div key={theme.key} className="glass-panel p-5">
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: theme.accentToken }}
              >
                {theme.shortLabel}
              </p>
              <h3 className="mt-2 font-display text-xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {theme.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{theme.tagline}</p>
            </div>
          ))}
        </div>
      </SandboxSection>

      <SandboxSection
        id="timeline"
        eyebrow="Timeline"
        title="From onboarding to post-COP deployment"
        description="Each phase compounds the last — mapping becomes policy, policy becomes programmes, programmes become proof."
      >
        <OmwTimelineRiver />
      </SandboxSection>

      <SandboxSection
        id="ask-offer"
        eyebrow="Partnership terms"
        title="What we ask & what we offer"
        description="We are not asking for funding. We are looking for partners who want to connect their local ecosystem to a global infrastructure."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="glass-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
              What we ask
            </h3>
            <ul className="mt-5 space-y-3">
              {OMW_ASK_OFFER.ask.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-orange)]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="glass-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
              What we offer
            </h3>
            <ul className="mt-5 space-y-3">
              {OMW_ASK_OFFER.offer.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-[var(--text-muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-green)]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </SandboxSection>

      <SandboxSection
        id="contact"
        eyebrow="Next steps"
        title="Become a local coordinator"
        description="Reply to confirm interest, identify your focal points, share 2–3 local priorities, and block the key dates for COP 2026."
      >
        <div className="glass-panel-strong p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              {SANDBOX_CONTACT.leads.map((lead) => (
                <div key={lead.email}>
                  <p className="font-medium text-[var(--text-primary)]">{lead.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{lead.role}</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm text-[var(--brand-blue)] underline-offset-4 hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              ))}
            </div>
            <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary whitespace-nowrap">
              {SANDBOX_CONTACT.email}
            </a>
          </div>
        </div>
      </SandboxSection>
    </main>
  );
}
