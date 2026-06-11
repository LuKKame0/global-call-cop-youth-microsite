import type { Dictionary, PageDictionary } from "@/lib/i18n/types";

export type CoreDictionary = Omit<Dictionary, keyof PageDictionary>;
