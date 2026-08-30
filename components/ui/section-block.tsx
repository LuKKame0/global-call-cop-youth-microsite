export function SectionBlock({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)] sm:text-4xl">{title}</h2>
      {lead ? (
        <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
          {lead}
        </p>
      ) : null}
      {children}
    </section>
  );
}
