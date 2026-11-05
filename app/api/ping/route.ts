export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { ok: true, serverTime: Date.now() },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
