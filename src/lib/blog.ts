import { supabase } from "./supabase";

export type PostMeta = {
  slug: string;
  title: string;
  /** Editorial publish date the admin sets (YYYY-MM-DD). */
  date: string;
  /** Row last-touched timestamp (ISO). Falls back to `date` on old schemas. */
  updatedAt: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  /** First image found in the post body, if any. Used as a card thumbnail. */
  coverImage?: string;
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

const MARKDOWN_IMG = /!\[[^\]]*\]\(\s*([^)\s]+?)(?:\s+"[^"]*")?\s*\)/;
const HTML_IMG = /<img\s[^>]*?src=["']([^"']+)["']/i;

/**
 * Pulls the first image URL out of a markdown body.
 * Returns undefined when no image is present.
 */
export function extractFirstImage(content: string | null | undefined): string | undefined {
  if (!content) return undefined;
  const md = MARKDOWN_IMG.exec(content);
  if (md?.[1]) return md[1];
  const html = HTML_IMG.exec(content);
  if (html?.[1]) return html[1];
  return undefined;
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

  // We select `content` purely to extract the first image for the card
  // thumbnail. It's not cheap to ship every post's body, but this list is
  // small (portfolio scale) and the client already filters in memory.
  let rows: Array<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[] | null;
    read_time: string;
    content: string | null;
    updated_at?: string | null;
  }> = [];

  // Primary sort: updated_at desc. Secondary: date desc (handles ties cleanly
  // for rows migrated in the same batch, or when updated_at is still default).
  const preferred = await supabase
    .from("posts")
    .select("slug, title, date, excerpt, tags, read_time, content, updated_at, created_at")
    .order("updated_at", { ascending: false })
    .order("date", { ascending: false });

  if (preferred.error) {
    const fallback = await supabase
      .from("posts")
      .select("slug, title, date, excerpt, tags, read_time, content")
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
    updatedAt: p.updated_at ?? p.date,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
    readTime: p.read_time,
    coverImage: extractFirstImage(p.content),
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
    updatedAt: data.updated_at ?? data.date,
    excerpt: data.excerpt,
    tags: data.tags ?? [],
    readTime: data.read_time,
    content: data.content,
    coverImage: extractFirstImage(data.content),
  };
}
