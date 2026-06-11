import { NextResponse } from "next/server";

import { getLoginPollStatus } from "@/lib/auth/login-poll";

export async function GET(request: Request) {
  const pollToken = new URL(request.url).searchParams.get("pollToken")?.trim();

  if (!pollToken) {
    return NextResponse.json({ error: "Missing pollToken" }, { status: 400 });
  }

  const result = await getLoginPollStatus(pollToken);
  return NextResponse.json(result);
}
