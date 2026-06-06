import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
    return NextResponse.json({ error: "title, content are required" }, { status: 400 });
  }

  const resolvedDate = date ?? new Date().toISOString().slice(0, 10);
  const updatedAt = resolveUpdatedAt(body.updated_at);
  const safeTags = tags ?? [];
  const safeExcerpt = excerpt ?? "";
  const safeReadTime = read_time ?? "5 min read";

  try {
    const rows = updatedAt
      ? await sql`
          INSERT INTO posts (slug, title, excerpt, content, tags, date, read_time, updated_at)
          VALUES (${slug}, ${title}, ${safeExcerpt}, ${content}, ${safeTags}, ${resolvedDate}, ${safeReadTime}, ${updatedAt})
          RETURNING *
        `
      : await sql`
          INSERT INTO posts (slug, title, excerpt, content, tags, date, read_time)
          VALUES (${slug}, ${title}, ${safeExcerpt}, ${content}, ${safeTags}, ${resolvedDate}, ${safeReadTime})
          RETURNING *
        `;

    return NextResponse.json({ post: rows[0] }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Insert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    return NextResponse.json({ error: "slug, title, and content are required" }, { status: 400 });
  }

  const resolvedDate = date ?? new Date().toISOString().slice(0, 10);
  const updatedAt = resolveUpdatedAt(body.updated_at);
  const safeTags = tags ?? [];
  const safeExcerpt = excerpt ?? "";
  const safeReadTime = read_time ?? "5 min read";

  try {
    // When updatedAt is provided, set it explicitly (trigger skips bump when value changes).
    // When omitted, leave updated_at out of the SET clause so the trigger bumps it to now().
    const rows = updatedAt
      ? await sql`
          UPDATE posts
          SET title = ${title}, excerpt = ${safeExcerpt}, content = ${content},
              tags = ${safeTags}, read_time = ${safeReadTime}, date = ${resolvedDate},
              updated_at = ${updatedAt}
          WHERE slug = ${slug}
          RETURNING *
        `
      : await sql`
          UPDATE posts
          SET title = ${title}, excerpt = ${safeExcerpt}, content = ${content},
              tags = ${safeTags}, read_time = ${safeReadTime}, date = ${resolvedDate}
          WHERE slug = ${slug}
          RETURNING *
        `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "No post found with that slug" }, { status: 404 });
    }

    return NextResponse.json({ post: rows[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

  try {
    await sql`DELETE FROM posts WHERE slug = ${slug}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
