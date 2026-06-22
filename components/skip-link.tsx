"use client";

import { useDictionary } from "@/lib/i18n/context";

export function SkipLink() {
  const dictionary = useDictionary();

  return (
    <a href="#main-content" className="skip-link">
      {dictionary.common.skipToContent}
    </a>
  );
}
