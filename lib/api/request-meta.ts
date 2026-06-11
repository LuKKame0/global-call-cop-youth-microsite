import type { NextRequest } from "next/server";

export function getRequestIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}

export function getRequestSource(request: NextRequest) {
  return (
    request.headers.get("referer") ??
    request.headers.get("origin") ??
    undefined
  );
}
