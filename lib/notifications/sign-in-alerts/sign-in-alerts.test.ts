import { describe, expect, it } from "vitest";

import { resolveSignInAlertRecipients } from "@/lib/notifications/sign-in-alerts/config";
import { mapAuthProvider } from "@/lib/notifications/sign-in-alerts/map-provider";
import { buildAdminSignInAlertEmail } from "@/lib/notifications/sign-in-alerts/template";
import type { SignInAlertEvent } from "@/lib/notifications/types";

const sampleEvent: SignInAlertEvent = {
  eventId: "evt_123",
  occurredAt: "2026-05-23T12:00:00.000Z",
  actor: {
    userId: "user_1",
    email: "admin1@example.com",
    name: "Admin One",
  },
  auth: {
    provider: "access_code",
    isNewUser: false,
  },
  context: {
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0",
    appUrl: "https://theglobalcall.org",
  },
};

describe("sign-in alert notifications", () => {
  it("maps auth providers", () => {
    expect(mapAuthProvider({ provider: "credentials", type: "credentials" })).toBe("access_code");
    expect(mapAuthProvider({ provider: "resend", type: "email" })).toBe("magic_link");
    expect(mapAuthProvider({ provider: "google", type: "oauth" })).toBe("google");
  });

  it("excludes the signing-in admin from recipients", () => {
    process.env.SIGN_IN_ALERT_RECIPIENTS =
      "admin1@example.com,admin2@example.com,security@example.com";

    const recipients = resolveSignInAlertRecipients("admin1@example.com");
    expect(recipients).toEqual(["admin2@example.com", "security@example.com"]);
  });

  it("builds a privacy-safe admin alert template", () => {
    const message = buildAdminSignInAlertEmail(sampleEvent, "Admin Two");

    expect(message.subject).toContain("admin1@example.com");
    expect(message.html).toContain("Admin sign-in detected");
    expect(message.html).toContain("203.0.113.***");
    expect(message.html).not.toContain("admin2@example.com");
    expect(message.text).toContain("Event ID: evt_123");
  });
});
