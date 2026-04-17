import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
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

  const admin = createAdminClient();

  const { data: existing, error: findError } = await admin
    .from("post_likes")
    .select("id")
    .eq("post_slug", slug)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  if (existing?.id) {
    const { error: delError } = await admin.from("post_likes").delete().eq("id", existing.id);
    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }
  } else {
    const { error: insError } = await admin.from("post_likes").insert({
      post_slug: slug,
      visitor_id: visitorId,
    });
    if (insError) {
      return NextResponse.json({ error: insError.message }, { status: 500 });
    }
  }

  try {
    const stats = await getSinglePostEngagement(slug, visitorId);
    return NextResponse.json(stats);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to refresh engagement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
