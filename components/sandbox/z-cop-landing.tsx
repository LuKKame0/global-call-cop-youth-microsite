import Link from "next/link";

import {
  ZcopCycleDialInfographic,
  ZcopHeroDataArt,
  ZcopImpactDashboard,
  ZcopOutputStackInfographic,
  ZcopPrepFunnelInfographic,
  ZcopStorySection,
  ZcopThemeAscentInfographic,
} from "@/components/sandbox/data-art/zcop-data-art";
import { SandboxSection } from "@/components/sandbox/sandbox-section";
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion-primitives";
import { IconArrow } from "@/components/icons";
import {
  OMW_PIPELINE,
  SANDBOX_CONTACT,
  ZCOP_PROBLEMS,
  ZCOP_SOLUTIONS,
} from "@/lib/sandbox/content";

export function ZCopLanding() {
  return (
    <main className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.08),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(97,200,121,0.06),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,171,250,0.14),transparent_28%)]" />
          <div className="relative space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
              Conference of Youth Policy Implementation
            </p>
            <h1 className="font-display text-[clamp(3.2rem,10vw,7rem)] uppercase leading-[0.86] tracking-[0.05em] text-[var(--text-primary)]">
              Z<span className="text-[var(--brand-blue)]">-</span>COP
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
              A five-day annual summit to assess needs, design implementation paths,
              prepare organisations, and practise the delivery pipeline — built on respect,
              coordination, and the belief that the people closest to the problems are best
              placed to solve them.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="glass-chip px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                August 30 – September 3, 2026
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                Coordinated at national level, amplified globally
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
                <IconArrow className="h-20 w-20" />
                Request onboarding
              </a>
              <Link href="/sandbox/on-my-way" className="glass-button-secondary">
                On My Way platform
              </Link>
              <Link href="/insights" className="glass-button-secondary">
                Submit national insights
              </Link>
            </div>
            <ZcopHeroDataArt />
          </div>
        </div>
      </section>

      <ZcopStorySection />

      <SandboxSection
        id="problem"
        eyebrow="The problem"
        title="Institutions fail to deliver. Talent is misallocated. Crises amplify."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal className="glass-panel p-6">
            <h3 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--brand-pink)]">
              What we see
            </h3>
            <ul className="mt-4 space-y-3">
              {ZCOP_PROBLEMS.map((item) => (
                <li key={item} className="text-sm leading-7 text-[var(--text-muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="glass-panel p-6">
            <h3 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--brand-green)]">
              Our response
            </h3>
            <ul className="mt-4 space-y-3">
              {ZCOP_SOLUTIONS.map((item) => (
                <li key={item} className="text-sm leading-7 text-[var(--text-muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </SandboxSection>

      <SandboxSection id="impact" eyebrow="Impact targets" title="The numbers we design toward">
        <ZcopImpactDashboard />
      </SandboxSection>

      <SandboxSection
        id="pipeline"
        eyebrow="Delivery pipeline"
        title="Three platforms. One mission."
        description="From policy insight to community implementation — all connected."
      >
        <RevealStagger className="grid gap-4 lg:grid-cols-3" stagger={0.08}>
          {OMW_PIPELINE.map((platform) => (
            <StaggerItem key={platform.step} className="glass-panel relative overflow-hidden p-6">
              <div
                className="absolute inset-y-0 left-0 w-1 rounded-r-full"
                style={{ backgroundColor: platform.accent }}
              />
              <p className="pl-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {platform.role}
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

        <Reveal className="glass-panel mt-6 p-6 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
          Local coordinators animate local hubs, convening ministers and youth leaders.
          People share insights on The Global Call. With MESA, directions are created.
          Programmes are implemented using On My Way.
        </Reveal>
      </SandboxSection>

      <SandboxSection
        id="themes"
        eyebrow="Four themes — one arc"
        title="Each day works through one scale of change"
        description="Self creates the individual foundation. Community creates collective infrastructure. Institutions provide the lever for scale. Systems is where structural change becomes real."
      >
        <ZcopThemeAscentInfographic />
      </SandboxSection>

      <SandboxSection
        id="outputs"
        eyebrow="What the Z-COP produces"
        title="Posted, public, trackable"
        description="This is not a list of aspirations. Each item is a posted, public, trackable entry on On My Way. If it is not on the platform, it did not happen."
      >
        <ZcopOutputStackInfographic />
      </SandboxSection>

      <SandboxSection
        id="preparation"
        eyebrow="Critical path"
        title="Pre-Z-COP preparation"
        description="The Z-COP does not work if hubs arrive without pre-submitted insights, unmapped organisations, or unactivated platform accounts."
      >
        <ZcopPrepFunnelInfographic />
      </SandboxSection>

      <SandboxSection
        id="cycle"
        eyebrow="Daily structure"
        title="The daily cycle — ten sessions, one rhythm"
        description="Every day follows the same cycle. The theme changes. The structure does not. What looks like repetition across five days is accumulation."
      >
        <ZcopCycleDialInfographic />
        <Reveal className="glass-panel mt-6 p-5 text-sm leading-7 text-[var(--text-muted)]">
          <strong className="text-[var(--text-primary)]">Three principles:</strong> the work is
          cumulative — nothing starts from scratch. The platform is the record — if it is not on On
          My Way, it did not happen. The pipeline must stay in sync — Global Call, MESA, and On My
          Way aligned before each day&apos;s programme begins.
        </Reveal>
      </SandboxSection>

      <SandboxSection
        id="contact"
        eyebrow="Engage with the pipeline"
        title="Become a natural partner"
      >
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Ask for your onboarding meeting. National focal points, youth organisations, and
            government bodies each have defined roles before, during, and after the Z-COP.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
              {SANDBOX_CONTACT.email}
            </a>
            <a
              href={`https://${SANDBOX_CONTACT.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-secondary"
            >
              {SANDBOX_CONTACT.website}
            </a>
          </div>
        </div>
      </SandboxSection>
    </main>
  );
}
