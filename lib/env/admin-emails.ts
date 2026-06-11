import "server-only";

import { sanitizeEnv } from "@/lib/env/sanitize";

export type AdminEmailEntry = {
  email: string;
  name: string;
};

function titleCase(value: string) {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function parseAdminEmails(raw = sanitizeEnv(process.env.AUTH_ADMIN_EMAILS)): AdminEmailEntry[] {
  if (!raw) return [];

  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((email) => ({
      email,
      name: titleCase(email.split("@")[0] ?? "Admin"),
    }));
}

export function parseNotifyEmails(
  ...sources: Array<string | undefined>
): string[] {
  for (const source of sources) {
    const raw = sanitizeEnv(source);
    if (!raw) continue;

    const emails = raw
      .split(/[,;]/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (emails.length > 0) return emails;
  }

  return [];
}
