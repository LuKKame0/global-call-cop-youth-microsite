import "server-only";

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { userOrgRoles } from "@/lib/db/schema";
import {
  canDispatchSignInAlerts,
  resolveSignInAlertRecipients,
} from "@/lib/notifications/sign-in-alerts/config";
import { DirectSignInAlertDispatcher } from "@/lib/notifications/sign-in-alerts/direct-dispatcher";
import { mapAuthProvider } from "@/lib/notifications/sign-in-alerts/map-provider";
import type {
  SignInAlertDeliveryReport,
  SignInAlertEvent,
} from "@/lib/notifications/types";
import { sanitizeEnv } from "@/lib/env/sanitize";

type HandleSignInAlertInput = {
  user: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
  };
  account?: {
    provider?: string | null;
    type?: string | null;
    providerAccountId?: string | null;
  } | null;
  isNewUser?: boolean;
  context?: SignInAlertEvent["context"];
};

async function actorHasDashboardAccess(userId: string) {
  const roles = await getDb()
    .select({ id: userOrgRoles.id })
    .from(userOrgRoles)
    .where(eq(userOrgRoles.userId, userId))
    .limit(1);

  return roles.length > 0;
}

export function buildSignInAlertEvent(input: HandleSignInAlertInput): SignInAlertEvent | null {
  const userId = input.user.id?.trim();
  const email = input.user.email?.trim().toLowerCase();

  if (!userId || !email) return null;

  return {
    eventId: randomUUID(),
    occurredAt: new Date().toISOString(),
    actor: {
      userId,
      email,
      name: input.user.name,
    },
    auth: {
      provider: mapAuthProvider(input.account),
      providerAccountId: input.account?.providerAccountId,
      isNewUser: input.isNewUser,
    },
    context: {
      ...input.context,
      appUrl: input.context?.appUrl ?? sanitizeEnv(process.env.NEXT_PUBLIC_APP_URL),
    },
  };
}

export async function handleSignInAlert(
  input: HandleSignInAlertInput,
): Promise<SignInAlertDeliveryReport | null> {
  if (!canDispatchSignInAlerts()) return null;

  const event = buildSignInAlertEvent(input);
  if (!event) return null;

  const hasAccess = await actorHasDashboardAccess(event.actor.userId);
  if (!hasAccess) return null;

  const recipients = resolveSignInAlertRecipients(event.actor.email);
  if (recipients.length === 0) return null;

  const dispatcher = new DirectSignInAlertDispatcher(recipients);
  const report = await dispatcher.dispatch(event);

  console.info("[sign-in-alert] dispatch complete", {
    eventId: event.eventId,
    attempted: report.attempted,
    delivered: report.delivered,
    failed: report.failed,
  });

  return report;
}
