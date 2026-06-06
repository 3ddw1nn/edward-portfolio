import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  let body: { comment_id?: string; visitor_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const commentId = body.comment_id?.trim() ?? "";
  const visitorId = body.visitor_id?.trim() ?? "";

  if (!commentId || !UUID_RE.test(commentId)) {
    return NextResponse.json({ error: "comment_id must be a UUID" }, { status: 400 });
  }
  if (!visitorId || !UUID_RE.test(visitorId)) {
    return NextResponse.json({ error: "visitor_id must be a UUID" }, { status: 400 });
  }

  try {
    const existing = await sql`
      SELECT id FROM comment_likes
      WHERE comment_id = ${commentId}::uuid AND visitor_id = ${visitorId}::uuid
    `;

    if (existing.length > 0) {
      await sql`DELETE FROM comment_likes WHERE id = ${existing[0].id as string}::uuid`;
    } else {
      await sql`
        INSERT INTO comment_likes (comment_id, visitor_id)
        VALUES (${commentId}::uuid, ${visitorId}::uuid)
      `;
    }

    const [countRow] = await sql`
      SELECT COUNT(*) AS cnt FROM comment_likes WHERE comment_id = ${commentId}::uuid
    `;
    const likeCount = Number(countRow.cnt);

    const liked = existing.length === 0;
    return NextResponse.json({ like_count: likeCount, liked });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Like toggle failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
