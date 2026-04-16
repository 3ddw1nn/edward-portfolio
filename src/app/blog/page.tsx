import { getAllPosts } from "@/lib/blog";
import { BlogPageContent } from "./BlogPageContent";

export const metadata = {
  title: "Blog — Edward Lee",
  description: "Writing on engineering, design, and the overlap between code and craft.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogPageContent posts={posts} />;
}
