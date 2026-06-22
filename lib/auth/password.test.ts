import { describe, expect, it } from "vitest";

import {
  hashPassword,
  MIN_PASSWORD_LENGTH,
  validatePasswordStrength,
  verifyPassword,
} from "@/lib/auth/password";

describe("password security", () => {
  it("rejects weak passwords", () => {
    expect(() => validatePasswordStrength("short")).toThrow();
    expect(() => validatePasswordStrength("alllowercase123")).toThrow();
  });

  it("hashes and verifies passwords", async () => {
    const password = "GlobalCall2026!Secure";
    const hash = await hashPassword(password);

    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("wrong-password-here", hash)).toBe(false);
  });

  it(`requires at least ${MIN_PASSWORD_LENGTH} characters`, () => {
    expect(() => validatePasswordStrength("Aa1!Aa1!Aa1!")).not.toThrow();
  });
});
