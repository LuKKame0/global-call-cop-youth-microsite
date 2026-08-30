"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import type { DirectoryMember } from "@/lib/i18n/types";

function MemberCard({ member, copy }: { member: DirectoryMember; copy: { countryLabel: string; cityLabel: string; linkedinLabel: string } }) {
  return (
    <article className="glass-panel p-5 flex flex-col gap-2">
      <p className="font-semibold text-[var(--text-primary)] truncate">{member.name}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {copy.countryLabel}: <span className="text-[var(--text-muted)] normal-case">{member.country}</span>
      </p>
      {member.city ? (
        <p className="text-xs text-[var(--text-muted)]">
          {copy.cityLabel}: {member.city}
        </p>
      ) : null}
      {member.linkedin ? (
        <Link
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--brand-blue)] hover:underline truncate"
        >
          {copy.linkedinLabel} ↗
        </Link>
      ) : null}
    </article>
  );
}

export function DirectoryPageContent() {
  const dictionary = useDictionary();
  const copy = dictionary.directory!;

  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/directory")
      .then((res) => res.json())
      .then((data: { members: DirectoryMember[] }) => {
        setMembers(data.members);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        (m.city ?? "").toLowerCase().includes(q),
    );
  }, [members, query]);

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.08),transparent_30%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>

          <div className="mt-6">
            <input
              type="search"
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-md rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-faint)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5">
        {status === "loading" ? (
          <p className="text-sm text-[var(--text-muted)]">{copy.loadingLabel}</p>
        ) : status === "error" ? (
          <p className="text-sm text-[var(--brand-pink)]">{copy.errorLabel}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">{copy.emptyState}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((member) => (
              <MemberCard key={member.id} member={member} copy={copy} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
