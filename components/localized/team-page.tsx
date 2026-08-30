"use client";

import { useDictionary } from "@/lib/i18n/context";
import type { BoardMember, TeamMember } from "@/lib/i18n/types";

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="glass-panel p-6 flex flex-col gap-2">
      <p className="font-display text-xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
        {member.name}
        {member.country ? (
          <span className="ml-2 text-sm normal-case text-[var(--text-faint)]">
            ({member.country})
          </span>
        ) : null}
      </p>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-blue)]">{member.role}</p>
      {member.region ? (
        <p className="text-xs text-[var(--text-faint)]">{member.region}</p>
      ) : null}
      {member.email ? (
        <a href={`mailto:${member.email}`} className="text-xs text-[var(--text-faint)]">
          {member.email}
        </a>
      ) : null}
      {member.bio ? (
        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{member.bio}</p>
      ) : null}
    </article>
  );
}

function BoardCard({ member }: { member: BoardMember }) {
  return (
    <article className="glass-panel p-6 flex flex-col gap-2">
      <p className="font-display text-xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
        {member.name}
        <span className="ml-2 text-sm normal-case text-[var(--text-faint)]">
          ({member.country})
        </span>
      </p>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-blue)]">{member.role}</p>
    </article>
  );
}

export function TeamPageContent() {
  const dictionary = useDictionary();
  const copy = dictionary.team!;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(55,171,250,0.08),transparent_28%),radial-gradient(circle_at_80%_60%,rgba(255,70,13,0.05),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.staffTitle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.staff.map((member) => (
            <MemberCard key={member.name + member.role} member={member} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.boardTitle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {copy.board.map((member) => (
            <BoardCard key={member.name + member.role} member={member} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.philosophyTitle}</p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.philosophyBody}</p>
        </div>
      </section>
    </div>
  );
}
