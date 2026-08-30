import type { Metadata } from "next";

import { JoinPageContent } from "@/components/localized/join-page";

export const metadata: Metadata = {
  title: "Sandbox — Join",
  description: "Standalone landing for the Join as National Focal Point form.",
  robots: { index: false, follow: false },
};

export default function SandboxJoinPage() {
  return <JoinPageContent />;
}
