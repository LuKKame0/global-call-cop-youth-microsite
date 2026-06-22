import { NextResponse } from "next/server";

import { processSubmissionRequest } from "@/lib/submit-service";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  const result = await processSubmissionRequest(payload);

  return NextResponse.json(result.body, { status: result.status });
}
