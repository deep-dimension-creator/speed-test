import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SIZE = 5 * 1024 * 1024;
const MAX_SIZE = 20 * 1024 * 1024;

export function GET(request: NextRequest) {
  const requestedSize = Number(request.nextUrl.searchParams.get("size"));
  const size = Number.isFinite(requestedSize)
    ? Math.min(Math.max(Math.floor(requestedSize), 1024), MAX_SIZE)
    : DEFAULT_SIZE;

  return new Response(new Uint8Array(randomBytes(size)), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
    },
  });
}
