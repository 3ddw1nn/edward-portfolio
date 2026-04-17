import { getAllPosts } from "@/lib/blog";
import { getPostEngagementStats } from "@/lib/engagement";
import { BlogPageContent } from "./BlogPageContent";

export const metadata = {
  title: "Blog — Edward Lee",
  description: "Writing on engineering, design, and the overlap between code and craft.",
};

const BLOG_PAGE_SIZE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const parsed = Number(pageParam);
  const requestedPage = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;

  const allPosts = await getAllPosts();
  const totalPosts = allPosts.length;
  const pageCount = Math.max(1, Math.ceil(totalPosts / BLOG_PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * BLOG_PAGE_SIZE;
  const posts = allPosts.slice(start, start + BLOG_PAGE_SIZE);

  // Engagement only for the slice so we don't pay for 100 lookups on a 10-post page.
  const engagement = await getPostEngagementStats(
    posts.map((p) => p.slug),
    null
  );

  return (
    <BlogPageContent
      posts={posts}
      engagement={engagement}
      page={page}
      pageCount={pageCount}
    />
  );
}
