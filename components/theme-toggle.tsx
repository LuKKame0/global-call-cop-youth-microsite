"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tgc-theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#050505" : "#f7f7f8");
  }
}

export function ThemeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const theme = stored === "dark" ? "dark" : "light";
    setIsDark(theme === "dark");
    setMounted(true);
  }, []);

  return (
    <label
      className={[
        "theme-switch",
        compact ? "theme-switch-compact shrink-0" : "",
        mounted ? "" : "opacity-0",
        className,
      ].join(" ")}
    >
      <span className="theme-switch-label">Light</span>
      <input
        type="checkbox"
        className="theme-switch-input"
        checked={isDark}
        onChange={(event) => {
          const nextTheme = event.target.checked ? "dark" : "light";
          setIsDark(event.target.checked);
          applyTheme(nextTheme);
        }}
        aria-label="Toggle dark mode"
      />
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
      <span className="theme-switch-label">Dark</span>
    </label>
  );
}
