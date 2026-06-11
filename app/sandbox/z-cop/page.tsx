import type { Metadata } from "next";

import { ZCopLanding } from "@/components/sandbox/z-cop-landing";

export const metadata: Metadata = {
  title: "Z-COP",
  description:
    "Z-COP 2026 — five-day youth policy implementation summit, August 30 to September 3.",
  robots: { index: false, follow: false },
};

export default function ZCopSandboxPage() {
  return <ZCopLanding />;
}
