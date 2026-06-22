import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseJsonBody, readRequestJson } from "@/lib/api/request";
import { getRequestIp, getRequestSource } from "@/lib/api/request-meta";
import { focalPointFormSchema } from "@/lib/forms/marketing-schemas";
import { persistMarketingLead } from "@/lib/leads/persist";

export async function POST(request: NextRequest) {
  const body = await readRequestJson(request);
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const payload = parseJsonBody(body, focalPointFormSchema);
  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    await persistMarketingLead({
      type: "focal_point",
      payload,
      source: getRequestSource(request),
      ipAddress: getRequestIp(request),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process application.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
