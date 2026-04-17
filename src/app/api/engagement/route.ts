import { NextRequest, NextResponse } from "next/server";
import { getPostEngagementStats } from "@/lib/engagement";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseSlugs(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[\w-]+$/.test(s))
    .slice(0, 50);
}

export async function GET(req: NextRequest) {
  const slugs = parseSlugs(req.nextUrl.searchParams.get("slugs"));
  if (slugs.length === 0) {
    return NextResponse.json({ error: "slugs query required (comma-separated)" }, { status: 400 });
  }

  const visitorRaw = req.nextUrl.searchParams.get("visitor_id");
  const visitorId = visitorRaw && UUID_RE.test(visitorRaw) ? visitorRaw : null;

  try {
    const stats = await getPostEngagementStats(slugs, visitorId);
    return NextResponse.json({ stats });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load engagement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
