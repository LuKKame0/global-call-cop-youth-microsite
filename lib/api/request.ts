import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function parseJsonBody<T extends z.ZodTypeAny>(
  body: unknown,
  schema: T,
): z.infer<T> | NextResponse {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const fields = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    return jsonError(
      fields ? `Invalid fields: ${fields}.` : "Invalid request body.",
      400,
    );
  }

  return parsed.data;
}

export async function readRequestJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
