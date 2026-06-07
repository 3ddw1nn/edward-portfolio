import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
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

  try {
    const rows = await sql`
      SELECT id, slug, title, date, excerpt, tags, content, updated_at
      FROM posts
      ORDER BY updated_at DESC, date DESC
    `;

    let engagement: Record<string, { commentCount: number; likeCount: number }> = {};
    let dbError: string | null = null;
    try {
      engagement = await getPostEngagementStats(rows.map((r) => r.slug as string), null);
    } catch (e) {
      dbError = e instanceof Error ? e.message : "Engagement lookup failed";
    }

    const posts: AdminPostRow[] = rows.map((r) => {
      const eng = engagement[r.slug as string] ?? { commentCount: 0, likeCount: 0 };
      return {
        id: r.id as string,
        slug: r.slug as string,
        title: r.title as string,
        date: r.date as string,
        excerpt: r.excerpt as string,
        tags: normalizeTags(r.tags),
        coverImage: extractFirstImage(r.content as string),
        likeCount: eng.likeCount,
        commentCount: eng.commentCount,
      };
    });

    return NextResponse.json({ posts, dbError: dbError });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ posts: [], dbError: message });
  }
}
