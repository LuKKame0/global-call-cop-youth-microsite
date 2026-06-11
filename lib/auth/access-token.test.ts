import { afterEach, describe, expect, it } from "vitest";

import {
  isAccessTokenConfigured,
  isValidAccessTokenFormat,
  normalizeAccessTokenInput,
  verifyAccessToken,
} from "@/lib/auth/access-token";

describe("access token", () => {
  afterEach(() => {
    delete process.env.AUTH_ACCESS_TOKEN;
  });

  it("normalizes numeric input", () => {
    expect(normalizeAccessTokenInput("12-34 56")).toBe("123456");
    expect(normalizeAccessTokenInput("1234567890")).toBe("123456");
  });

  it("validates 6-digit format", () => {
    expect(isValidAccessTokenFormat("123456")).toBe(true);
    expect(isValidAccessTokenFormat("12345")).toBe(false);
    expect(isValidAccessTokenFormat("abcdef")).toBe(false);
  });

  it("verifies configured token with constant-time compare", () => {
    process.env.AUTH_ACCESS_TOKEN = "482913";
    expect(isAccessTokenConfigured()).toBe(true);
    expect(verifyAccessToken("482913")).toBe(true);
    expect(verifyAccessToken("000000")).toBe(false);
    expect(verifyAccessToken("48 29 13")).toBe(true);
  });
});
