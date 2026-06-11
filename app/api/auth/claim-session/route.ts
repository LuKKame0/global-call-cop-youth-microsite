import { NextResponse } from "next/server";
import { z } from "zod";

import { buildSessionCookie } from "@/lib/auth/create-session";
import { claimLoginPoll } from "@/lib/auth/login-poll";

const bodySchema = z.object({
  pollToken: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const userId = await claimLoginPoll(body.pollToken);

    if (!userId) {
      return NextResponse.json({ error: "Login not ready" }, { status: 409 });
    }

    const sessionCookie = await buildSessionCookie(userId);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("[auth/claim-session]", error);
    return NextResponse.json({ error: "Unable to complete login" }, { status: 500 });
  }
}
