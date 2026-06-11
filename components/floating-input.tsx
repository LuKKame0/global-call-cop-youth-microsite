import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { CalmModal } from "@/components/calm-modal";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: ReactNode;
  error?: string;
  fieldValue?: string;
  accentColor?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  function FloatingInput(
    {
      label,
      helper,
      error,
      id,
      className,
      fieldValue = "",
      accentColor = "rgba(255,255,255,0.86)",
      ...props
    },
    ref,
  ) {
    const [isExpanded, setIsExpanded] = useState(false);
    const helperId = helper ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const modalInputId = `${id}-modal-input`;

    const handleExpandedChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        <div className="space-y-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Open extended editor"
              className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-black/24 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/58 transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] hover:text-white/82 sm:right-3 sm:top-3 sm:px-3 sm:text-[11px] sm:tracking-[0.16em]"
            >
              Expand
            </button>
          <input
            ref={ref}
            id={id}
            placeholder=" "
            aria-invalid={Boolean(error)}
            aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
            className={[
              "peer h-16 w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-4 pb-3 pr-20 pt-6 text-base text-[var(--text-primary)] outline-none transition sm:pr-24",
              "shadow-[var(--glass-shadow)] placeholder-transparent hover:border-[var(--glass-border)] hover:bg-[var(--surface-raised)] focus:border-[var(--brand-blue)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[rgba(55,171,250,0.18)]",
              error ? "border-rose-400/70 ring-2 ring-rose-400/20" : "",
              className ?? "",
            ].join(" ")}
            value={fieldValue}
            {...props}
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute left-4 top-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-faint)] transition peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-[0.02em] peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-[var(--text-muted)] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-[:not(:placeholder-shown)]:text-[var(--text-muted)]"
          >
            {label}
          </label>
        </div>
        {helper ? (
          <p id={helperId} className="text-sm leading-6 text-[var(--text-muted)]">
            {helper}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-sm text-rose-300">
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
            {helper ? (
              <p className="max-w-3xl text-sm leading-7 text-white/58 sm:text-base">
                {helper}
              </p>
            ) : null}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_90px_rgba(0,0,0,0.24)]">
              <label
                htmlFor={modalInputId}
                className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]"
              >
                {label}
              </label>
              <input
                id={modalInputId}
                name={props.name}
                value={fieldValue}
                onChange={handleExpandedChange}
                onBlur={props.onBlur}
                placeholder={props.placeholder}
                autoComplete={props.autoComplete}
                type={props.type}
                className="mt-4 h-16 w-full rounded-[1.3rem] border border-white/10 bg-black/18 px-5 text-lg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition hover:border-white/16 focus:border-white/28 focus:bg-white/[0.04] focus:ring-2 focus:ring-white/10"
              />
              {error ? (
                <p className="mt-3 text-sm text-rose-300">{error}</p>
              ) : null}
            </div>
          </div>
        </CalmModal>
      </>
    );
  },
);
