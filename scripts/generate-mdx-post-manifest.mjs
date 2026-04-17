/**
 * Writes src/generated/mdx-post-manifest.json from src/content/blog/*.mdx
 * so Edge route handlers can list MDX posts without Node fs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const POSTS_DIR = path.join(root, "src/content/blog");
const OUT_DIR = path.join(root, "src/generated");
const OUT_FILE = path.join(OUT_DIR, "mdx-post-manifest.json");

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn("No MDX blog dir:", POSTS_DIR);
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(
      OUT_FILE,
      JSON.stringify({ generatedAt: new Date().toISOString(), posts: [] }, null, 2)
    );
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data } = matter(raw);
    const rawTags = data.tags;
    const tags = Array.isArray(rawTags)
      ? rawTags.filter((t) => typeof t === "string" && t.trim())
      : [];
    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      tags,
    };
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), posts }, null, 2)
  );
  console.log("Wrote", OUT_FILE, `(${posts.length} posts)`);
}

main();
