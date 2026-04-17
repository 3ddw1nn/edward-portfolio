import { getAllPosts } from "@/lib/blog";
import { getPostEngagementStats } from "@/lib/engagement";
import { BlogPageContent } from "./BlogPageContent";

export const metadata = {
  title: "Blog — Edward Lee",
  description: "Writing on engineering, design, and the overlap between code and craft.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const engagement = await getPostEngagementStats(
    posts.map((p) => p.slug),
    null
  );
  return <BlogPageContent posts={posts} engagement={engagement} />;
}
