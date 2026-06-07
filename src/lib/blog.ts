import { sql } from "./db";

function toISOString(v: unknown, fallback: string): string {
  if (!v) return fallback;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export type PostMeta = {
  slug: string;
  title: string;
  /** Editorial publish date the admin sets (YYYY-MM-DD). */
  date: string;
  /** Row last-touched timestamp (ISO). */
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

export function extractFirstImage(content: string | null | undefined): string | undefined {
  if (!content) return undefined;
  const md = MARKDOWN_IMG.exec(content);
  if (md?.[1]) return md[1];
  const html = HTML_IMG.exec(content);
  if (html?.[1]) return html[1];
  return undefined;
}

export async function getAllPosts(options: PostsListOptions = {}): Promise<PostMeta[]> {
  const qLower = normalizeQuery(options.q);

  const rows = await sql`
    SELECT slug, title, date, excerpt, tags, read_time, content, updated_at
    FROM posts
    ORDER BY updated_at DESC, date DESC
  `;

  const posts: PostMeta[] = rows.map((p) => ({
    slug: p.slug as string,
    title: p.title as string,
    date: p.date as string,
    updatedAt: toISOString(p.updated_at, p.date as string),
    excerpt: p.excerpt as string,
    tags: (p.tags as string[]) ?? [],
    readTime: p.read_time as string,
    coverImage: extractFirstImage(p.content as string),
  }));

  return qLower ? posts.filter((p) => matchesQuery(p, qLower)) : posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await sql`SELECT * FROM posts WHERE slug = ${slug}`;
  if (rows.length === 0) return null;
  const p = rows[0];

  return {
    slug: p.slug as string,
    title: p.title as string,
    date: p.date as string,
    updatedAt: toISOString(p.updated_at, p.date as string),
    excerpt: p.excerpt as string,
    tags: (p.tags as string[]) ?? [],
    readTime: p.read_time as string,
    content: p.content as string,
    coverImage: extractFirstImage(p.content as string),
  };
}
