import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function countLikes(admin: ReturnType<typeof createAdminClient>, commentId: string) {
  const { count, error } = await admin
    .from("comment_likes")
    .select("*", { count: "exact", head: true })
    .eq("comment_id", commentId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

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

  const admin = createAdminClient();

  const { data: existing, error: findError } = await admin
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  if (existing?.id) {
    const { error: delError } = await admin.from("comment_likes").delete().eq("id", existing.id);
    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }
  } else {
    const { error: insError } = await admin.from("comment_likes").insert({
      comment_id: commentId,
      visitor_id: visitorId,
    });
    if (insError) {
      return NextResponse.json({ error: insError.message }, { status: 500 });
    }
  }

  try {
    const likeCount = await countLikes(admin, commentId);
    const { data: row } = await admin
      .from("comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("visitor_id", visitorId)
      .maybeSingle();
    return NextResponse.json({ like_count: likeCount, liked: !!row?.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to refresh likes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
