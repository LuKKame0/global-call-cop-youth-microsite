import { NextResponse } from "next/server";

import { getLoginMethods } from "@/lib/auth/login-methods";

export async function GET() {
  return NextResponse.json(await getLoginMethods());
}
