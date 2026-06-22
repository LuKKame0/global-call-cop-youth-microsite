"use client";

import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

export function HeaderLocaleControls({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-2 ${className}`}>
      <ThemeToggle compact />
      <LanguageSelector compact />
    </div>
  );
}
