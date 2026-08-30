export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <article className="glass-panel p-5 text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{label}</p>
      <p className="mt-2 font-display text-3xl text-[var(--text-primary)] sm:text-4xl">{value}</p>
      {detail ? <p className="mt-2 text-sm text-[var(--text-muted)]">{detail}</p> : null}
    </article>
  );
}
