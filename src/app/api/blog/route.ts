import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Accept a client-supplied ISO timestamp for `updated_at` only when it parses
 * cleanly. This lets the admin save with their exact local time; anything
 * malformed falls through so the DB trigger can stamp `now()` itself.
 */
function resolveUpdatedAt(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    date?: string;
    read_time?: string;
    updated_at?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, excerpt, content, tags, date, read_time } = body;
  const slug = body.slug || slugify(title ?? "");

  if (!title || !content || !slug) {
    return NextResponse.json(
      { error: "title, content are required" },
      { status: 400 }
    );
  }

  const resolvedDate = date ?? new Date().toISOString().slice(0, 10);
  const updatedAt = resolveUpdatedAt(body.updated_at);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .insert({
      slug,
      title,
      excerpt: excerpt ?? "",
      content,
      tags: tags ?? [],
      date: resolvedDate,
      read_time: read_time ?? "5 min read",
      ...(updatedAt ? { updated_at: updatedAt } : {}),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    date?: string;
    read_time?: string;
    updated_at?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, title, excerpt, content, tags, date, read_time } = body;
  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: "slug, title, and content are required" },
      { status: 400 }
    );
  }

  const resolvedDate = date ?? new Date().toISOString().slice(0, 10);
  const updatedAt = resolveUpdatedAt(body.updated_at);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .update({
      title,
      excerpt: excerpt ?? "",
      content,
      tags: tags ?? [],
      read_time: read_time ?? "5 min read",
      date: resolvedDate,
      ...(updatedAt ? { updated_at: updatedAt } : {}),
    })
    .eq("slug", slug)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "No post found with that slug" }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}

export async function DELETE(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
