export type DetailFieldItem = {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
};

export function DetailFields({ fields }: { fields: DetailFieldItem[] }) {
  return (
    <dl className="space-y-4">
      {fields.map((field) => (
        <div key={field.label}>
          <dt className="text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
            {field.label}
          </dt>
          <dd
            className={`mt-1 text-sm text-[var(--text-primary)] ${
              field.multiline ? "whitespace-pre-wrap leading-relaxed" : ""
            }`}
          >
            {field.value?.trim() ? field.value : "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--glass-border)] bg-black/[0.03] p-4 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function JsonPreview({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-black/[0.04] p-4 text-xs leading-6 text-[var(--text-primary)]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
