import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSinglePostEngagement } from "@/lib/engagement";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SLUG_RE = /^[\w-]+$/;

export async function POST(req: NextRequest) {
  let body: { slug?: string; visitor_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim() ?? "";
  const visitorId = body.visitor_id?.trim() ?? "";

  if (!slug || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!visitorId || !UUID_RE.test(visitorId)) {
    return NextResponse.json({ error: "visitor_id must be a UUID" }, { status: 400 });
  }

  try {
    const existing = await sql`
      SELECT id FROM post_likes WHERE post_slug = ${slug} AND visitor_id = ${visitorId}::uuid
    `;

    if (existing.length > 0) {
      await sql`DELETE FROM post_likes WHERE id = ${existing[0].id as string}::uuid`;
    } else {
      await sql`INSERT INTO post_likes (post_slug, visitor_id) VALUES (${slug}, ${visitorId}::uuid)`;
    }

    const stats = await getSinglePostEngagement(slug, visitorId);
    return NextResponse.json(stats);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Like toggle failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
