import "server-only";

import { timingSafeEqual } from "node:crypto";

import { sanitizeEnv } from "@/lib/env/sanitize";

const ACCESS_TOKEN_PATTERN = /^\d{6}$/;

export function normalizeAccessTokenInput(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 6);
}

export function isValidAccessTokenFormat(token: string) {
  return ACCESS_TOKEN_PATTERN.test(token);
}

export function isAccessTokenConfigured() {
  const token = sanitizeEnv(process.env.AUTH_ACCESS_TOKEN);
  return Boolean(token && isValidAccessTokenFormat(token));
}

export function verifyAccessToken(candidate: string) {
  const expected = sanitizeEnv(process.env.AUTH_ACCESS_TOKEN);
  if (!expected || !isValidAccessTokenFormat(expected)) {
    return false;
  }

  const normalized = normalizeAccessTokenInput(candidate);
  if (!isValidAccessTokenFormat(normalized)) {
    return false;
  }

  const provided = Buffer.from(normalized, "utf8");
  const reference = Buffer.from(expected, "utf8");

  if (provided.length !== reference.length) {
    return false;
  }

  return timingSafeEqual(provided, reference);
}
