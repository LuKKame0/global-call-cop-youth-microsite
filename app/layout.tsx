import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";

import { SiteChrome } from "@/components/site-chrome";
import { LocaleProvider } from "@/lib/i18n/context";
import { isRtlLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

import "./globals.css";

const themeInitScript = `(function(){try{var t=localStorage.getItem("tgc-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

function resolveAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const APP_URL = resolveAppUrl();
const SITE_TITLE = "COP — Youth Policy Implementation";
const SITE_DESCRIPTION =
  "A submission platform for national youth policy implementation frameworks built for COP coordination and downstream synthesis.";

export const viewport: Viewport = {
  themeColor: "#f7f7f8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · COP Youth",
  },
  description: SITE_DESCRIPTION,
  applicationName: "COP Youth Policy",
  authors: [{ name: "Global Call COP" }],
  keywords: [
    "COP",
    "youth policy",
    "implementation framework",
    "multilateral",
    "SDG",
    "global call",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
    images: [{ url: "/globalcall.png", width: 512, height: 512, alt: "The Global Call" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();
  const dictionary = await getDictionary(locale);
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${dmSans.variable} ${bebasNeue.variable} h-full antialiased`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-[var(--page-background)] text-[var(--text-primary)]">
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <SiteChrome>{children}</SiteChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
