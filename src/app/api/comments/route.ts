import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { combinedCommentText, isProfane, PROFANITY_COMMENT_WARNING } from "@/lib/profanity";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function withCommentLikeDefaults<T extends Record<string, unknown>>(c: T) {
  return { ...c, like_count: 0, liked: false };
}

async function attachCommentLikes(
  admin: ReturnType<typeof createAdminClient>,
  comments: Record<string, unknown>[],
  visitorId: string | null
) {
  if (comments.length === 0) return [];

  const ids = comments.map((c) => c.id as string);
  const [{ data: likeRows }, { data: mineRows }] = await Promise.all([
    admin.from("comment_likes").select("comment_id").in("comment_id", ids),
    visitorId && UUID_RE.test(visitorId)
      ? admin.from("comment_likes").select("comment_id").eq("visitor_id", visitorId).in("comment_id", ids)
      : Promise.resolve({ data: null as { comment_id: string }[] | null }),
  ]);

  const counts: Record<string, number> = {};
  for (const row of likeRows ?? []) {
    const id = row.comment_id as string;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }
  const likedSet = new Set((mineRows ?? []).map((r) => r.comment_id as string));

  return comments.map((c) => ({
    ...c,
    like_count: counts[c.id as string] ?? 0,
    liked: likedSet.has(c.id as string),
  }));
}

function isMissingOptionalColumns(message?: string | null) {
  const text = (message ?? "").toLowerCase();
  return (
    text.includes("gif_url") ||
    text.includes("reply_to_id") ||
    text.includes("reply_to_name")
  );
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function coerceLimit(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(n)));
}

/**
 * GET /api/comments?slug=some-post[&visitor_id=<uuid>][&cursor=<ISO>][&limit=10]
 *
 * Paginated by *top-level* comments only. Each page returns up to `limit`
 * top-level comments plus ALL of their descendant replies, so a reply is
 * always returned with its parent — threads never break across pages.
 *
 * `cursor` is the `created_at` ISO string of the last top-level comment
 * from the previous page (exclusive). Ordering is ascending (oldest first),
 * matching the on-screen render order of a chat log.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const visitorRaw = req.nextUrl.searchParams.get("visitor_id");
  const visitorId = visitorRaw && UUID_RE.test(visitorRaw) ? visitorRaw : null;
  const limit = coerceLimit(req.nextUrl.searchParams.get("limit"));
  const cursor = req.nextUrl.searchParams.get("cursor");

  const admin = createAdminClient();

  // 1) Fetch the next page of top-level comments. Request +1 to detect `hasMore`.
  let topQuery = admin
    .from("comments")
    .select("id, name, body, gif_url, reply_to_id, reply_to_name, created_at")
    .eq("post_slug", slug)
    .is("reply_to_id", null)
    .order("created_at", { ascending: true })
    .limit(limit + 1);

  if (cursor) topQuery = topQuery.gt("created_at", cursor);

  const topRes = await topQuery;

  // Older DBs without threaded-reply columns: fall back to flat + non-paginated,
  // and include every comment once since there are no parents to anchor pages on.
  if (topRes.error && isMissingOptionalColumns(topRes.error.message)) {
    const fallback = await admin
      .from("comments")
      .select("id, name, body, created_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (fallback.error) {
      return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    }

    const raw = (fallback.data ?? []).map((comment) => ({
      ...comment,
      gif_url: null,
      reply_to_id: null,
      reply_to_name: null,
    }));
    const comments = await attachCommentLikes(admin, raw, visitorId);
    return NextResponse.json({ comments, nextCursor: null, hasMore: false });
  }

  if (topRes.error) {
    return NextResponse.json({ error: topRes.error.message }, { status: 500 });
  }

  const topRows = topRes.data ?? [];
  const hasMore = topRows.length > limit;
  const topPage = hasMore ? topRows.slice(0, limit) : topRows;

  // 2) Pull every descendant reply for the top-level comments on this page.
  //    Uses iterative BFS so nested reply chains all come along for the ride.
  let descendants: (typeof topPage)[number][] = [];
  let frontier = topPage.map((t) => t.id as string);
  while (frontier.length > 0) {
    const { data: children, error: childErr } = await admin
      .from("comments")
      .select("id, name, body, gif_url, reply_to_id, reply_to_name, created_at")
      .eq("post_slug", slug)
      .in("reply_to_id", frontier)
      .order("created_at", { ascending: true });

    if (childErr) {
      // Can't fetch replies — return just top-level rather than 500-ing the page.
      break;
    }
    const rows = children ?? [];
    if (rows.length === 0) break;
    descendants = descendants.concat(rows);
    frontier = rows.map((r) => r.id as string);
  }

  const combined = [...topPage, ...descendants];
  const comments = await attachCommentLikes(admin, combined, visitorId);
  // Client sorts by created_at anyway, but return sorted for stable ordering.
  comments.sort((a, b) => {
    const ta = (a as Record<string, unknown>).created_at as string;
    const tb = (b as Record<string, unknown>).created_at as string;
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  const lastTop = topPage[topPage.length - 1];
  const nextCursor = hasMore && lastTop ? (lastTop.created_at as string) : null;

  return NextResponse.json({ comments, nextCursor, hasMore });
}

// POST /api/comments
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

  // Display name, message, and reply handle — same filter + warning everywhere.
  const profanityCheck = combinedCommentText({
    name,
    body: text,
    reply_to_name: safeReplyToName,
  });
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
    return NextResponse.json(
      { error: "Comment too long (max 2000 characters)" },
      { status: 400 }
    );
  }

  // Use admin client to bypass RLS when inserting
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("comments")
    .insert({
      post_slug,
      name: name?.trim() || null,
      body: text?.trim() || "",
      gif_url: gif_url || null,
      reply_to_id: safeReplyToId,
      reply_to_name: safeReplyToName,
    })
    .select("id, name, body, gif_url, reply_to_id, reply_to_name, created_at")
    .single();

  if (error && isMissingOptionalColumns(error.message)) {
    const fallback = await admin
      .from("comments")
      .insert({
        post_slug,
        name: name?.trim() || null,
        body: text?.trim() || "",
      })
      .select("id, name, body, created_at")
      .single();

    if (fallback.error) {
      return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        comment: withCommentLikeDefaults({
          ...fallback.data,
          gif_url: null,
          reply_to_id: null,
          reply_to_name: null,
        }),
      },
      { status: 201 }
    );
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: withCommentLikeDefaults(data) }, { status: 201 });
}

// DELETE /api/comments?id=uuid (admin only)
export async function DELETE(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const toDelete = new Set<string>([id]);
  let frontier = [id];

  while (frontier.length > 0) {
    const { data: children, error: childError } = await admin
      .from("comments")
      .select("id")
      .in("reply_to_id", frontier);

    if (childError && isMissingOptionalColumns(childError.message)) {
      // Older schemas may not have threaded-reply columns yet; delete only target comment.
      break;
    }

    if (childError) {
      return NextResponse.json({ error: childError.message }, { status: 500 });
    }

    const nextFrontier: string[] = [];
    for (const child of children ?? []) {
      if (toDelete.has(child.id)) continue;
      toDelete.add(child.id);
      nextFrontier.push(child.id);
    }
    frontier = nextFrontier;
  }

  const { error } = await admin.from("comments").delete().in("id", Array.from(toDelete));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deleted: toDelete.size });
}
