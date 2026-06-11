import {
  forwardRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
  type KeyboardEvent,
} from "react";

import { CalmModal } from "@/components/calm-modal";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper: string;
  error?: string;
  valueLength: number;
  fieldValue?: string;
  accentColor: string;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField(
  {
    label,
    helper,
    error,
    valueLength,
    fieldValue = "",
    accentColor,
    id,
    className,
    onKeyDown,
    ...props
  },
  ref,
) {
  const [isExpanded, setIsExpanded] = useState(false);
  const helperId = `${id}-helper`;
  const errorId = error ? `${id}-error` : undefined;
  const modalTextareaId = `${id}-modal-input`;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.stopPropagation();
    }

    onKeyDown?.(event);
  };

  const handleExpandedChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.({
      ...event,
      target: {
        ...event.target,
        name: props.name ?? "",
        value: event.target.value,
      },
      currentTarget: {
        ...event.currentTarget,
        name: props.name ?? "",
        value: event.currentTarget.value,
      },
    });
  };

  return (
    <>
      <div
        className="rounded-[1.75rem] border border-white/8 bg-black/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-5"
        style={{ boxShadow: `inset 0 0 0 1px ${accentColor}22, 0 20px 60px rgba(0,0,0,0.22)` }}
      >
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <label
              htmlFor={id}
              className="block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] [overflow-wrap:anywhere] sm:tracking-[0.14em]"
            >
              {label}
            </label>
            <p id={helperId} className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-faint)]">
              {helper}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white/45 sm:px-3 sm:text-xs sm:tracking-[0.14em]">
              {valueLength}/2000
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Open extended editor"
              className="rounded-full border border-white/10 bg-black/24 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58 transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] hover:text-white/82 sm:px-3 sm:text-[11px] sm:tracking-[0.16em]"
            >
              Expand
            </button>
          </div>
        </div>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
          className={[
            "min-h-36 w-full resize-y rounded-[1.25rem] border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-4 py-4 text-base leading-7 text-[var(--text-primary)] outline-none transition sm:min-h-44",
            "shadow-[var(--glass-shadow)] placeholder:text-[var(--text-faint)] hover:border-[var(--glass-border)] hover:bg-[var(--surface-raised)] focus:border-[var(--brand-blue)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[rgba(55,171,250,0.18)]",
            error ? "border-rose-400/70 ring-2 ring-rose-400/20" : "",
            className ?? "",
          ].join(" ")}
          onKeyDown={handleKeyDown}
          value={fieldValue}
          {...props}
        />
        {error ? (
          <p id={errorId} className="mt-3 text-sm text-rose-300">
            {error}
          </p>
        ) : null}
      </div>

      <CalmModal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        eyebrow="Expanded field"
        title={label}
        accentColor={accentColor}
        size="full"
      >
        <div className="space-y-5">
          <p className="max-w-4xl text-sm leading-7 text-white/58 sm:text-base">
            {helper}
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/42">
              Extended writing view
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/45">
              {valueLength}/2000
            </span>
          </div>
          <textarea
            id={modalTextareaId}
            name={props.name}
            value={fieldValue}
            onChange={handleExpandedChange}
            onBlur={props.onBlur}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder}
            className="min-h-[58vh] w-full resize-none rounded-[1.6rem] border border-white/10 bg-black/18 px-5 py-5 text-base leading-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_90px_rgba(0,0,0,0.24)] outline-none transition hover:border-white/16 focus:border-white/28 focus:bg-white/[0.04] focus:ring-2 focus:ring-white/10 sm:text-lg"
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </CalmModal>
    </>
  );
});
