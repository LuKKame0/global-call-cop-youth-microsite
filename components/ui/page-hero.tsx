import Link from "next/link";

import type { ReactNode } from "react";

export type HeroCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  cta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  cta?: HeroCta[];
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
      <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] text-[var(--text-primary)]">
          {title}
        </h1>
        {lead ? (
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {lead}
          </p>
        ) : null}
        {cta && cta.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {cta.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={item.variant === "secondary" ? "glass-button-secondary" : "glass-button-primary"}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
