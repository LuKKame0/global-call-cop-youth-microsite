import type { Metadata } from "next";

import { SandboxBanner } from "@/components/sandbox/sandbox-banner";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Prototype landing pages for On My Way and Z-COP.",
  robots: { index: false, follow: false },
};

export default function SandboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SandboxBanner />
      {children}
    </>
  );
}
