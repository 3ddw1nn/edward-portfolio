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

/** List posts (Supabase-only). Edge-safe. */
export async function getAllPosts(): Promise<PostMeta[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, date, excerpt, tags, read_time")
    .order("date", { ascending: false });

  if (error) return [];

  return (data ?? []).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
    readTime: p.read_time,
  }));
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
