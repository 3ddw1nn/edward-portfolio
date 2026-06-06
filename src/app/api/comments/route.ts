import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { combinedCommentText, isProfane, PROFANITY_COMMENT_WARNING } from "@/lib/profanity";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CommentRow = Record<string, unknown>;

function withCommentLikeDefaults(c: CommentRow) {
  return { ...c, like_count: 0, liked: false };
}

async function attachCommentLikes(
  comments: CommentRow[],
  visitorId: string | null
) {
  if (comments.length === 0) return [];

  const ids = comments.map((c) => c.id as string);

  const [likeRows, mineRows] = await Promise.all([
    sql`SELECT comment_id, COUNT(*) AS cnt FROM comment_likes WHERE comment_id = ANY(${ids}) GROUP BY comment_id`,
    visitorId && UUID_RE.test(visitorId)
      ? sql`SELECT comment_id FROM comment_likes WHERE visitor_id = ${visitorId}::uuid AND comment_id = ANY(${ids})`
      : Promise.resolve([] as { comment_id: string }[]),
  ]);

  const counts: Record<string, number> = {};
  for (const row of likeRows) {
    counts[row.comment_id as string] = Number(row.cnt);
  }
  const likedSet = new Set((mineRows as { comment_id: string }[]).map((r) => r.comment_id));

  return comments.map((c) => ({
    ...c,
    like_count: counts[c.id as string] ?? 0,
    liked: likedSet.has(c.id as string),
  }));
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function coerceLimit(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(n)));
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const visitorRaw = req.nextUrl.searchParams.get("visitor_id");
  const visitorId = visitorRaw && UUID_RE.test(visitorRaw) ? visitorRaw : null;
  const limit = coerceLimit(req.nextUrl.searchParams.get("limit"));
  const cursor = req.nextUrl.searchParams.get("cursor");

  try {
    // Fetch one extra to detect hasMore
    const topRows = cursor
      ? await sql`
          SELECT id, name, body, gif_url, reply_to_id, reply_to_name, created_at
          FROM comments
          WHERE post_slug = ${slug} AND reply_to_id IS NULL AND created_at > ${cursor}
          ORDER BY created_at ASC
          LIMIT ${limit + 1}
        `
      : await sql`
          SELECT id, name, body, gif_url, reply_to_id, reply_to_name, created_at
          FROM comments
          WHERE post_slug = ${slug} AND reply_to_id IS NULL
          ORDER BY created_at ASC
          LIMIT ${limit + 1}
        `;

    const hasMore = topRows.length > limit;
    const topPage = hasMore ? topRows.slice(0, limit) : topRows;

    // BFS to fetch all descendant replies
    let descendants: CommentRow[] = [];
    let frontier = topPage.map((t) => t.id as string);
    while (frontier.length > 0) {
      const children = await sql`
        SELECT id, name, body, gif_url, reply_to_id, reply_to_name, created_at
        FROM comments
        WHERE post_slug = ${slug} AND reply_to_id = ANY(${frontier})
        ORDER BY created_at ASC
      `;
      if (children.length === 0) break;
      descendants = descendants.concat(children as CommentRow[]);
      frontier = children.map((r) => r.id as string);
    }

    const combined = [...topPage, ...descendants] as CommentRow[];
    const comments = await attachCommentLikes(combined, visitorId);
    comments.sort((a, b) => {
      const ta = (a as CommentRow).created_at as string;
      const tb = (b as CommentRow).created_at as string;
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });

    const lastTop = topPage[topPage.length - 1];
    const nextCursor = hasMore && lastTop ? (lastTop.created_at as string) : null;

    return NextResponse.json({ comments, nextCursor, hasMore });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: {
    post_slug?: string;
    name?: string;
    body?: string;
    gif_url?: string;
    reply_to_id?: string;
    reply_to_name?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { post_slug, name, body: text, gif_url, reply_to_id, reply_to_name } = body;
  const safeReplyToId = reply_to_id?.trim() || null;
  const safeReplyToName = reply_to_name?.trim() || null;

  const profanityCheck = combinedCommentText({ name, body: text, reply_to_name: safeReplyToName });
  if (profanityCheck.trim() && isProfane(profanityCheck)) {
    return NextResponse.json({ error: PROFANITY_COMMENT_WARNING }, { status: 400 });
  }

  if (!post_slug || (!text?.trim() && !gif_url)) {
    return NextResponse.json(
      { error: "post_slug and either body or gif_url are required" },
      { status: 400 }
    );
  }

  if (text && text.trim().length > 2000) {
    return NextResponse.json({ error: "Comment too long (max 2000 characters)" }, { status: 400 });
  }

  try {
    const rows = await sql`
      INSERT INTO comments (post_slug, name, body, gif_url, reply_to_id, reply_to_name)
      VALUES (
        ${post_slug},
        ${name?.trim() || null},
        ${text?.trim() || ""},
        ${gif_url || null},
        ${safeReplyToId}${safeReplyToId ? sql`::uuid` : sql``},
        ${safeReplyToName}
      )
      RETURNING id, name, body, gif_url, reply_to_id, reply_to_name, created_at
    `;
    return NextResponse.json({ comment: withCommentLikeDefaults(rows[0]) }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Insert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    // BFS to collect all descendants, then delete in one shot
    const toDelete = new Set<string>([id]);
    let frontier = [id];

    while (frontier.length > 0) {
      const children = await sql`SELECT id FROM comments WHERE reply_to_id = ANY(${frontier}::uuid[])`;
      const nextFrontier: string[] = [];
      for (const child of children) {
        const cid = child.id as string;
        if (!toDelete.has(cid)) {
          toDelete.add(cid);
          nextFrontier.push(cid);
        }
      }
      frontier = nextFrontier;
    }

    const ids = Array.from(toDelete);
    await sql`DELETE FROM comments WHERE id = ANY(${ids}::uuid[])`;

    return NextResponse.json({ ok: true, deleted: toDelete.size });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
