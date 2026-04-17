import { supabase } from "./supabase";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
};

export type Post = PostMeta & {
  content: string;
};

type PostsListOptions = {
  /** Optional case-insensitive query applied to title and tags. */
  q?: string;
};

function normalizeQuery(q: string | undefined | null): string {
  return (q ?? "").trim().toLowerCase();
}

function matchesQuery(p: PostMeta, qLower: string): boolean {
  if (!qLower) return true;
  if (p.title.toLowerCase().includes(qLower)) return true;
  return p.tags.some((tag) => tag.toLowerCase().includes(qLower));
}

/**
 * List posts (Supabase-only). Edge-safe.
 *
 * Orders by `updated_at` desc when the column exists (so editing a post
 * surfaces it to the top); gracefully falls back to `date` desc on older
 * schemas that haven't run the `add_updated_at_to_posts` migration yet.
 *
 * Optional `q` does case-insensitive matching on title and tags.
 */
export async function getAllPosts(options: PostsListOptions = {}): Promise<PostMeta[]> {
  const qLower = normalizeQuery(options.q);

  // Try the new shape first — if the column is missing this whole select fails.
  let rows: Array<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[] | null;
    read_time: string;
  }> = [];

  const preferred = await supabase
    .from("posts")
    .select("slug, title, date, excerpt, tags, read_time, updated_at, created_at")
    .order("updated_at", { ascending: false });

  if (preferred.error) {
    const fallback = await supabase
      .from("posts")
      .select("slug, title, date, excerpt, tags, read_time")
      .order("date", { ascending: false });
    if (fallback.error) return [];
    rows = fallback.data ?? [];
  } else {
    rows = preferred.data ?? [];
  }

  const posts: PostMeta[] = rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
    readTime: p.read_time,
  }));

  return qLower ? posts.filter((p) => matchesQuery(p, qLower)) : posts;
}

/** Load a single post by slug. Edge-safe. Throws when not found. */
export async function getPostBySlug(slug: string): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) throw new Error(`Post not found: ${slug}`);

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    tags: data.tags ?? [],
    readTime: data.read_time,
    content: data.content,
  };
}
