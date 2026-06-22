"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface CalmModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  accentColor?: string;
  size?: "default" | "wide" | "full";
  children: React.ReactNode;
}

const sizeClasses = {
  default: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-6xl",
} as const;

export function CalmModal({
  open,
  onClose,
  eyebrow,
  title,
  accentColor,
  size = "default",
  children,
}: CalmModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="calm-modal__backdrop fixed inset-0 z-[90] flex items-end justify-center p-2 backdrop-blur-xl sm:items-center sm:p-5"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
            className={[
              "calm-modal__panel relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-[2rem] backdrop-blur-2xl",
              sizeClasses[size],
            ].join(" ")}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute left-6 top-0 h-40 w-40 rounded-full blur-3xl"
              style={{ backgroundColor: accentColor, opacity: 0.18 }}
            />
            <div className="calm-modal__header relative flex items-start justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
              <div className="space-y-2">
                {eyebrow ? (
                  <p className="calm-modal__eyebrow text-[11px] uppercase tracking-[0.22em]">
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  className="calm-modal__title font-display text-3xl uppercase tracking-[0.04em] sm:text-4xl"
                  style={accentColor ? { color: accentColor } : undefined}
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="calm-modal__close flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl leading-none transition"
              >
                ×
              </button>
            </div>

            <div className="calm-modal__body relative overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
