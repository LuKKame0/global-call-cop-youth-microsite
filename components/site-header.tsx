"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HeaderLocaleControls } from "@/components/header-locale-controls";
import { IconArrow, IconDoc, IconGlobe } from "@/components/icons";
import { localizedHref } from "@/lib/i18n/config";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import { localizedLandingHref } from "@/lib/i18n/page-paths";

type NavLink = {
  href: string;
  label: string;
  Icon: typeof IconGlobe;
  highlight?: boolean;
};

function navLinkClassName(isActive: boolean, highlight?: boolean) {
  return [
    "glass-button-secondary site-nav-link",
    isActive
      ? "border-[rgba(55,171,250,0.36)] bg-[var(--glass-button-secondary-bg)] text-[var(--text-primary)] shadow-[0_10px_30px_rgba(55,171,250,0.12)]"
      : "",
    highlight
      ? "bg-[linear-gradient(135deg,rgba(255,70,13,0.22),rgba(255,255,255,0.06))] text-[var(--text-primary)]"
      : "",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const nav = dictionary.nav;
  const common = dictionary.common;

  const homeHref = localizedLandingHref(locale, "home");

  const links: NavLink[] = [
    { href: homeHref, label: nav.about, Icon: IconGlobe },
    { href: `${homeHref}#network`, label: nav.network, Icon: IconGlobe },
    { href: localizedHref(locale, "activities"), label: nav.activities, Icon: IconDoc },
    { href: localizedHref(locale, "z-cop"), label: nav.zCop, Icon: IconArrow },
    { href: localizedLandingHref(locale, "mesa"), label: "MESA", Icon: IconGlobe },
    { href: localizedHref(locale, "join"), label: nav.join, Icon: IconArrow },
    { href: localizedLandingHref(locale, "faq"), label: nav.faq, Icon: IconDoc },
    {
      href: localizedLandingHref(locale, "insights"),
      label: nav.startFramework,
      Icon: IconArrow,
      highlight: true,
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  function isLinkActive(href: string) {
    if (href === homeHref) {
      return pathname === homeHref || pathname === "/";
    }
    if (href === `${homeHref}#network`) {
      return pathname === homeHref || pathname === "/";
    }
    const base = href.split("#")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="site-header-shell mx-auto max-w-7xl rounded-[1.7rem] border px-3 py-3 backdrop-blur-xl sm:px-4 sm:py-4">
        <div className="site-header-toolbar">
          <Link href={homeHref} className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-hover:-translate-y-0.5 sm:h-16 sm:w-16">
              <Image
                src="/globalcall.png"
                alt={dictionary.meta.brand}
                width={96}
                height={96}
                priority
                className="site-brand-logo h-11 w-11 object-contain sm:h-12 sm:w-12"
              />
            </span>
            <div className="site-header-brand-copy hidden min-w-0 sm:block">
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] sm:text-[11px] sm:tracking-[0.22em]">
                {dictionary.meta.brand}
              </p>
              <p className="font-display text-lg uppercase tracking-[0.06em] text-[var(--text-primary)] sm:text-xl lg:text-2xl lg:tracking-[0.08em]">
                {dictionary.meta.tagline}
              </p>
            </div>
          </Link>

          <div className="site-header-controls">
            <HeaderLocaleControls />
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="site-header-menu-toggle lg:hidden"
              aria-label={menuOpen ? common.closeMenu ?? "Close navigation menu" : common.openMenu ?? "Open navigation menu"}
              aria-expanded={menuOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text-muted)] transition-transform duration-300"
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d={menuOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
              </svg>
            </button>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="site-header-nav-row hidden lg:block"
        >
          <div className="site-header-nav-track">
            {links.map(({ href, label, Icon, highlight }) => (
              <Link
                key={href}
                href={href}
                className={navLinkClassName(isLinkActive(href), highlight)}
              >
                <Icon className="h-3.5 w-3.5 opacity-80" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <nav
          ref={navRef}
          aria-label="Mobile"
          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden"
          style={{ gridTemplateRows: menuOpen ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="site-header-mobile-nav flex flex-col gap-2 pt-3">
              {links.map(({ href, label, Icon, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  className={[navLinkClassName(isLinkActive(href), highlight), "w-full justify-center"].join(
                    " ",
                  )}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
