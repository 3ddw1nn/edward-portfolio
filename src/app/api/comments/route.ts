import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

function isMissingOptionalColumns(message?: string | null) {
  const text = (message ?? "").toLowerCase();
  return (
    text.includes("gif_url") ||
    text.includes("reply_to_id") ||
    text.includes("reply_to_name")
  );
}

// GET /api/comments?slug=some-post
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("comments")
    .select("id, name, body, gif_url, reply_to_id, reply_to_name, created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error && isMissingOptionalColumns(error.message)) {
    const fallback = await admin
      .from("comments")
      .select("id, name, body, created_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (fallback.error) {
      return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    }

    const comments = (fallback.data ?? []).map((comment) => ({
      ...comment,
      gif_url: null,
      reply_to_id: null,
      reply_to_name: null,
    }));
    return NextResponse.json({ comments });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
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

  const safeReplyToId = reply_to_id?.trim() || null;
  const safeReplyToName = reply_to_name?.trim() || null;

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
        comment: {
          ...fallback.data,
          gif_url: null,
          reply_to_id: null,
          reply_to_name: null,
        },
      },
      { status: 201 }
    );
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
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
