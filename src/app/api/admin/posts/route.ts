import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import mdxManifest from "@/generated/mdx-post-manifest.json";

export const runtime = "edge";

export type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  source: "mdx" | "supabase";
};

function mergeAdminPosts(
  mdxPosts: typeof mdxManifest.posts,
  dbRows: { id: string; slug: string; title: string; date: string; excerpt: string }[]
): { posts: AdminPostRow[]; hiddenDbDuplicateCount: number } {
  const mdxList: AdminPostRow[] = mdxPosts.map((p) => ({
    id: `mdx:${p.slug}`,
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    source: "mdx",
  }));
  const mdxSlugs = new Set(mdxList.map((p) => p.slug));

  const hiddenDbDuplicateCount = dbRows.filter((r) => mdxSlugs.has(r.slug)).length;

  const dbOnly: AdminPostRow[] = dbRows
    .filter((r) => !mdxSlugs.has(r.slug))
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      date: r.date,
      excerpt: r.excerpt,
      source: "supabase" as const,
    }));

  const merged = [...mdxList, ...dbOnly].sort((a, b) => (a.date < b.date ? 1 : -1));

  return { posts: merged, hiddenDbDuplicateCount };
}

export async function GET() {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .select("id, slug, title, date, excerpt")
    .order("date", { ascending: false });

  if (error) {
    const { posts } = mergeAdminPosts(mdxManifest.posts, []);
    return NextResponse.json({
      posts,
      hiddenDbDuplicateCount: 0,
      supabaseError: error.message,
    });
  }

  const { posts, hiddenDbDuplicateCount } = mergeAdminPosts(mdxManifest.posts, data ?? []);

  return NextResponse.json({
    posts,
    hiddenDbDuplicateCount,
    supabaseError: null,
  });
}
