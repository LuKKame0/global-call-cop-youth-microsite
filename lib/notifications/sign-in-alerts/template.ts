import { BRAND } from "@/lib/branding/tokens";
import { emailShell, escapeHtml, fieldRow } from "@/lib/email/templates/shell";

import type { SignInAlertEvent } from "@/lib/notifications/types";

const PROVIDER_LABELS: Record<SignInAlertEvent["auth"]["provider"], string> = {
  access_code: "6-digit access code",
  password: "Email + password",
  magic_link: "Magic link",
  google: "Google OAuth",
  oauth: "OAuth",
  unknown: "Unknown",
};

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function maskIp(ip?: string) {
  if (!ip) return "Unavailable";
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts.slice(0, 4).join(":")}:****`;
  }
  const octets = ip.split(".");
  if (octets.length === 4) return `${octets[0]}.${octets[1]}.${octets[2]}.***`;
  return ip;
}

export function buildAdminSignInAlertEmail(
  event: SignInAlertEvent,
  recipientName?: string | null,
) {
  const greeting = recipientName?.trim()
    ? `Hello ${recipientName.trim()},`
    : "Hello,";

  const providerLabel = PROVIDER_LABELS[event.auth.provider];
  const actorLabel = event.actor.name?.trim()
    ? `${event.actor.name.trim()} (${event.actor.email})`
    : event.actor.email;

  const html = emailShell({
    eyebrow: "Security alert",
    title: "Admin sign-in detected",
    accent: BRAND.colors.green,
    bodyHtml: `
      <p style="margin:0 0 16px;line-height:1.7;color:rgba(16,16,20,0.72);">
        ${escapeHtml(greeting)} a successful sign-in was recorded on the COP Youth Policy admin platform.
      </p>
      <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(55,171,250,0.08);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Account", actorLabel)}
        ${fieldRow("Method", providerLabel)}
        ${fieldRow("Time (UTC)", formatTimestamp(event.occurredAt))}
        ${fieldRow("IP address", maskIp(event.context?.ipAddress))}
        ${fieldRow("User agent", event.context?.userAgent ?? "Unavailable")}
        ${fieldRow("Event ID", event.eventId)}
      </div>
      <p style="margin:0;line-height:1.7;color:rgba(16,16,20,0.64);">
        If you do not recognize this activity, rotate credentials immediately and review admin access.
      </p>
    `,
  });

  const text = [
    greeting,
    "",
    "A successful admin sign-in was detected.",
    "",
    `Account: ${actorLabel}`,
    `Method: ${providerLabel}`,
    `Time (UTC): ${formatTimestamp(event.occurredAt)}`,
    `IP address: ${maskIp(event.context?.ipAddress)}`,
    `User agent: ${event.context?.userAgent ?? "Unavailable"}`,
    `Event ID: ${event.eventId}`,
    "",
    "If you do not recognize this activity, rotate credentials immediately and review admin access.",
  ].join("\n");

  return {
    subject: `[Security] Admin sign-in — ${event.actor.email}`,
    html,
    text,
  };
}
