/**
 * Upserts all src/content/blog/*.mdx rows into public.posts (same slugs as files).
 *
 * The blog loads a Supabase row when one exists for the slug; otherwise it uses the
 * .mdx file. After seeding, seeded posts are editable in admin and served from the DB
 * even if the .mdx file remains (keep file + DB in sync, or re-seed after editing MDX).
 *
 * Run: pnpm seed:posts   (same as node --env-file=.env.local scripts/seed-posts-from-mdx.mjs)
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Prerequisite: run supabase/posts.sql in the SQL editor.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const POSTS_DIR = path.join(root, "src/content/blog");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing env. Example: node --env-file=.env.local scripts/seed-posts-from-mdx.mjs"
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const row = {
      slug,
      title: data.title,
      excerpt: data.excerpt ?? "",
      content,
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date,
      read_time: data.readTime ?? "5 min read",
    };
    const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error(slug, error.message);
      process.exit(1);
    }
    console.log("Upserted", slug);
  }
  console.log("Done. Regenerate MDX manifest if you changed files: pnpm prebuild");
}

main();
