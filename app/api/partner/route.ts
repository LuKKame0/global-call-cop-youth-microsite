import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { sendPartnerFormEmails } from "@/lib/email/marketing/partner";
import { partnerFormSchema } from "@/lib/forms/marketing-schemas";
import { parseJsonBody, readRequestJson } from "@/lib/api/request";
import { getRequestIp, getRequestSource } from "@/lib/api/request-meta";
import { persistMarketingLead } from "@/lib/leads/persist";

export async function POST(request: NextRequest) {
  const body = await readRequestJson(request);
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const payload = parseJsonBody(body, partnerFormSchema);
  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    await persistMarketingLead({
      type: "partner",
      payload,
      source: getRequestSource(request),
      ipAddress: getRequestIp(request),
    });
    await sendPartnerFormEmails(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process partnership inquiry.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
