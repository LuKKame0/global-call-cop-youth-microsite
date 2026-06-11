import type { ReactNode } from "react";

import { Reveal } from "@/components/motion-primitives";

interface SandboxSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SandboxSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SandboxSectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8 lg:py-12 ${className}`}>
      <Reveal className="mb-8 max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.92] tracking-[0.04em] text-[var(--text-primary)]">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {description}
          </p>
        ) : null}
      </Reveal>
      {children}
    </section>
  );
}
