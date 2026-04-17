import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { extractFirstImage } from "@/lib/blog";
import { getPostEngagementStats } from "@/lib/engagement";

export const runtime = "edge";

export type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  likeCount: number;
  commentCount: number;
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

  // Prefer `updated_at` so edits bubble to the top. Gracefully fall back on
  // older schemas that haven't run the migration. `date` is a stable tiebreaker.
  const preferred = await admin
    .from("posts")
    .select("id, slug, title, date, excerpt, tags, content, updated_at")
    .order("updated_at", { ascending: false })
    .order("date", { ascending: false });

  let rows: Array<{
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[] | null;
    content: string | null;
  }> = [];

  let supabaseError: string | null = null;

  if (preferred.error) {
    const fallback = await admin
      .from("posts")
      .select("id, slug, title, date, excerpt, tags, content")
      .order("date", { ascending: false });
    if (fallback.error) {
      return NextResponse.json({ posts: [], supabaseError: fallback.error.message });
    }
    rows = fallback.data ?? [];
  } else {
    rows = preferred.data ?? [];
  }

  // Best-effort engagement. If this fails (bucket missing, etc.) we still return
  // the list with zeroed counts so the admin UI isn't blocked.
  let engagement: Record<string, { commentCount: number; likeCount: number }> = {};
  try {
    engagement = await getPostEngagementStats(rows.map((r) => r.slug), null);
  } catch (e) {
    supabaseError = e instanceof Error ? e.message : "Engagement lookup failed";
  }

  const posts: AdminPostRow[] = rows.map((r) => {
    const eng = engagement[r.slug] ?? { commentCount: 0, likeCount: 0 };
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      date: r.date,
      excerpt: r.excerpt,
      tags: normalizeTags(r.tags),
      coverImage: extractFirstImage(r.content),
      likeCount: eng.likeCount,
      commentCount: eng.commentCount,
    };
  });

  return NextResponse.json({ posts, supabaseError });
}
