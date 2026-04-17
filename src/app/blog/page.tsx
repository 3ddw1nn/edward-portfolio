import { getAllPosts } from "@/lib/blog";
import { getPostEngagementStats } from "@/lib/engagement";
import { BlogPageContent } from "./BlogPageContent";

// Cloudflare Pages requires dynamic routes to run on the edge runtime. This
// page is dynamic because it reads `searchParams` for the initial q/page state.
export const runtime = "edge";

export const metadata = {
  title: "Blog — Edward Lee",
  description: "Writing on engineering, design, and the overlap between code and craft.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const { page: pageParam, q: qParam, sort: sortParam } = await searchParams;
  const parsed = Number(pageParam);
  const initialPage = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  const initialQuery = (qParam ?? "").trim();
  const initialSort: "recent" | "popular" = sortParam === "popular" ? "popular" : "recent";

  // Fetch the full list once. Filtering, sorting, and pagination happen
  // client-side so the hero doesn't re-animate every time state changes.
  const allPosts = await getAllPosts();
  const engagement = await getPostEngagementStats(
    allPosts.map((p) => p.slug),
    null
  );

  return (
    <BlogPageContent
      posts={allPosts}
      engagement={engagement}
      initialPage={initialPage}
      initialQuery={initialQuery}
      initialSort={initialSort}
    />
  );
}
