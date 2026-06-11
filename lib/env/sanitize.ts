export function sanitizeEnv(value?: string | null) {
  if (!value) return undefined;

  return value
    .replace(/^\uFEFF/, "")
    .replace(/\\r\\n$/g, "")
    .replace(/\r?\n/g, "")
    .trim();
}
