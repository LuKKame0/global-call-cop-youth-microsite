"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { IconGlobe } from "@/components/icons";

export type NavDropdownItem = {
  href: string;
  label: string;
  Icon: typeof IconGlobe;
};

export function NavDropdown({
  label,
  Icon,
  items,
  triggerClassName,
  isLinkActive,
  layout = "popover",
}: {
  label: string;
  Icon: typeof IconGlobe;
  items: NavDropdownItem[];
  triggerClassName: string;
  isLinkActive: (href: string) => boolean;
  layout?: "popover" | "accordion";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || layout !== "popover") return;
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, layout]);

  const isAccordion = layout === "accordion";

  return (
    <div ref={rootRef} className={isAccordion ? "flex w-full flex-col gap-2" : "relative"}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[triggerClassName, isAccordion ? "w-full justify-center" : ""].join(" ")}
        aria-expanded={open}
      >
        <Icon className={isAccordion ? "h-4 w-4 opacity-80" : "h-3.5 w-3.5 opacity-80"} />
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className={
            isAccordion
              ? "flex flex-col gap-2 pl-4"
              : "site-header-dropdown absolute left-0 top-full mt-2 min-w-[12rem] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          }
        >
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className={
                isAccordion
                  ? [
                      "glass-button-secondary site-nav-link w-full justify-center",
                      isLinkActive(child.href)
                        ? "border-[rgba(55,171,250,0.36)] text-[var(--text-primary)]"
                        : "",
                    ].join(" ")
                  : [
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                      isLinkActive(child.href)
                        ? "bg-[var(--glass-button-secondary-bg)] text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    ].join(" ")
              }
            >
              <child.Icon className="h-3.5 w-3.5 opacity-80" />
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
