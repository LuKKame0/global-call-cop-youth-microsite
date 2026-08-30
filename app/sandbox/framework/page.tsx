import type { Metadata } from "next";

import { FrameworkPage } from "@/components/framework-page";

export const metadata: Metadata = {
  title: "Sandbox — Framework",
  description: "Standalone landing for the Start Framework submission form.",
  robots: { index: false, follow: false },
};

export default function SandboxFrameworkPage() {
  return <FrameworkPage />;
}
