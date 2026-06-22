import type { CoreDictionary } from "@/lib/i18n/core-dictionary";
import type { Dictionary, PageDictionary } from "@/lib/i18n/types";

const coreDefaults: Partial<CoreDictionary> = {
  nav: {
    buildTheFuture: "Build the Future",
    onMyWay: "On My Way",
  } as CoreDictionary["nav"],
  common: {
    backToHome: "Back to home",
    skipToContent: "Skip to main content",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  } as CoreDictionary["common"],
};

export function normalizeCore(core: CoreDictionary): CoreDictionary {
  return {
    ...core,
    nav: { ...coreDefaults.nav, ...core.nav },
    common: { ...coreDefaults.common, ...core.common },
  };
}

export function mergeDictionary(core: CoreDictionary, pages: PageDictionary): Dictionary {
  return { ...normalizeCore(core), ...pages };
}
