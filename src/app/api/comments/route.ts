import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase";

// GET /api/comments?slug=some-post
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id, name, body, created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

// POST /api/comments
export async function POST(req: NextRequest) {
  let body: { post_slug?: string; name?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { post_slug, name, body: text } = body;

  if (!post_slug || !text?.trim()) {
    return NextResponse.json(
      { error: "post_slug and body are required" },
      { status: 400 }
    );
  }

  if (text.trim().length > 2000) {
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
      body: text.trim(),
    })
    .select("id, name, body, created_at")
    .single();

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
  const { error } = await admin.from("comments").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
