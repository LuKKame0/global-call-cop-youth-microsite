import { NextResponse } from "next/server";
import { z } from "zod";

import { createLoginPollRequest } from "@/lib/auth/login-poll";

const bodySchema = z.object({
  email: z.string().email(),
  pollToken: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    await createLoginPollRequest(body.email, body.pollToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("[auth/login-poll]", error);
    return NextResponse.json({ error: "Unable to start login" }, { status: 500 });
  }
}
