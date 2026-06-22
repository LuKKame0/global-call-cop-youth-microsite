import "server-only";

import { isEmailTransportConfigured } from "@/lib/email/config";
import { sanitizeEnv } from "@/lib/env/sanitize";

function parseEmailList(raw: string | undefined) {
  if (!raw?.trim()) return [];

  return [
    ...new Set(
      raw
        .split(/[,;]/)
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function parseBooleanEnv(raw: string | undefined, defaultValue: boolean) {
  if (!raw?.trim()) return defaultValue;

  const normalized = raw.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
}

export function isSignInAlertsEnabled() {
  return parseBooleanEnv(sanitizeEnv(process.env.SIGN_IN_ALERTS_ENABLED), true);
}

export function getSignInAlertRecipients() {
  const dedicated = parseEmailList(sanitizeEnv(process.env.SIGN_IN_ALERT_RECIPIENTS));
  if (dedicated.length > 0) return dedicated;

  const internal = parseEmailList(sanitizeEnv(process.env.INTERNAL_NOTIFY_EMAILS));
  if (internal.length > 0) return internal;

  const legacy = parseEmailList(sanitizeEnv(process.env.LANDING_NOTIFY_EMAILS));
  return legacy;
}

export function canDispatchSignInAlerts() {
  return isSignInAlertsEnabled() && isEmailTransportConfigured();
}

export function resolveSignInAlertRecipients(actorEmail: string) {
  const normalizedActor = actorEmail.trim().toLowerCase();
  return getSignInAlertRecipients().filter((recipient) => recipient !== normalizedActor);
}
