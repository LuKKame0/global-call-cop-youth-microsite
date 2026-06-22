import { describe, expect, it, afterEach } from "vitest";

import { applyEmailRecipientOverride } from "@/lib/email/override";

describe("email override", () => {
  afterEach(() => {
    delete process.env.EMAIL_OVERRIDE_TO;
  });

  it("redirects all recipients when override is set", () => {
    process.env.EMAIL_OVERRIDE_TO = "override@example.com";

    const result = applyEmailRecipientOverride({
      to: "user@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    expect(result.to).toBe("override@example.com");
    expect(result.subject).toContain("user@example.com");
    expect(result.html).toContain("user@example.com");
  });

  it("passes through when override is unset", () => {
    const input = {
      to: "user@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
    };

    expect(applyEmailRecipientOverride(input)).toEqual(input);
  });
});
