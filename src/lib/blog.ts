import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { supabase } from "./supabase";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  source: "mdx" | "supabase";
};

export type Post = PostMeta & {
  content: string;
};

// ── MDX helpers (sync, file-system) ─────────────────────────────────────────

function getMdxPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
      tags: (data.tags as string[]) ?? [],
      readTime: data.readTime as string,
      source: "mdx" as const,
    };
  });
}

function getMdxPostBySlug(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    readTime: data.readTime as string,
    content,
    source: "mdx" as const,
  };
}

// ── Public API (async, merges MDX + Supabase) ────────────────────────────────

export async function getAllPosts(): Promise<PostMeta[]> {
  const mdxPosts = getMdxPosts();

  const { data: dbPosts } = await supabase
    .from("posts")
    .select("slug, title, date, excerpt, tags, read_time")
    .order("date", { ascending: false });

  const supabasePosts: PostMeta[] = (dbPosts ?? []).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
    readTime: p.read_time,
    source: "supabase" as const,
  }));

  // Merge, deduplicate (MDX takes precedence), sort by date desc
  const slugsSeen = new Set(mdxPosts.map((p) => p.slug));
  const merged = [
    ...mdxPosts,
    ...supabasePosts.filter((p) => !slugsSeen.has(p.slug)),
  ];
  return merged.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  // Try MDX first
  const mdx = getMdxPostBySlug(slug);
  if (mdx) return mdx;

  // Fall back to Supabase
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
    source: "supabase" as const,
  };
}

// Static MDX slugs only — Supabase posts render dynamically
export function getMdxSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
