const SCRIPT_PATTERN = /<script[\s>][\s\S]*?<\/script>/gi;
const TAG_PATTERN = /<\/?[a-z][^>]*>/gi;
const EVENT_HANDLER_PATTERN = /\bon\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URI_PATTERN = /javascript\s*:/gi;

export function sanitizeText(input: string): string {
  return input
    .replace(SCRIPT_PATTERN, "")
    .replace(EVENT_HANDLER_PATTERN, "")
    .replace(JAVASCRIPT_URI_PATTERN, "")
    .replace(TAG_PATTERN, "")
    .trim();
}

export function sanitizeRecord(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeText(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeRecord(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}
