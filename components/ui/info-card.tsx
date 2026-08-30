export function InfoCard({
  title,
  body,
  accent = false,
  centered = false,
}: {
  title: string;
  body: string;
  accent?: boolean;
  centered?: boolean;
}) {
  return (
    <article className={`glass-panel p-5 ${centered ? "text-center" : ""}`}>
      <h3
        className={
          accent
            ? "font-display text-lg text-[var(--brand-blue)]"
            : "font-semibold text-[var(--text-primary)]"
        }
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </article>
  );
}
