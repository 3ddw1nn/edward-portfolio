import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

export type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is string => typeof t === "string" && t.trim().length > 0);
}

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .select("id, slug, title, date, excerpt, tags")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({
      posts: [],
      supabaseError: error.message,
    });
  }

  const posts: AdminPostRow[] = (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: r.date,
    excerpt: r.excerpt,
    tags: normalizeTags(r.tags),
  }));

  return NextResponse.json({
    posts,
    supabaseError: null,
  });
}
