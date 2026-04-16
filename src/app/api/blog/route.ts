import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  // Verify admin password
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

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .insert({
      slug,
      title,
      excerpt: excerpt ?? "",
      content,
      tags: tags ?? [],
      date: date ?? new Date().toISOString().slice(0, 10),
      read_time: read_time ?? "5 min read",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
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
