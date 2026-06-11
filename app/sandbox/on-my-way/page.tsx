import type { Metadata } from "next";

import { OnMyWayLanding } from "@/components/sandbox/on-my-way-landing";

export const metadata: Metadata = {
  title: "On My Way",
  description:
    "On My Way — the action layer connecting local priorities to global policy implementation.",
  robots: { index: false, follow: false },
};

export default function OnMyWaySandboxPage() {
  return <OnMyWayLanding />;
}
