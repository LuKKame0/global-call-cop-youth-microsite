"use client";

import { usePathname } from "next/navigation";

import { PageTransition } from "@/components/motion-primitives";
import { SkipLink } from "@/components/skip-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isAppShellRoute } from "@/lib/i18n/page-paths";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAppShellRoute(pathname)) {
    return <div className="h-screen overflow-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <SkipLink />
      <SiteHeader />
      <PageTransition>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
