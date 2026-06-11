import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/lib/auth/config";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const roles = (session as any).roles ?? [];

  return (
    <SessionProvider session={session}>
      <DashboardShell roles={roles}>{children}</DashboardShell>
    </SessionProvider>
  );
}
