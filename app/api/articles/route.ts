import type { NextRequest } from "next/server";
import { articles } from "@/lib/articles";

export function GET(request: NextRequest) {
  const page = Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(12, Math.max(4, Number.parseInt(request.nextUrl.searchParams.get("pageSize") ?? "12", 10) || 12));
  const start = (page - 1) * pageSize;
  const items = articles.slice(start, start + pageSize);

  return Response.json(
    { items, page, pageSize, total: articles.length, hasMore: start + items.length < articles.length },
    { headers: { "Cache-Control": "no-store" } },
  );
}
