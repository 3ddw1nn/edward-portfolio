import { createAdminClient } from "@/lib/supabase";

export type PostEngagement = {
  commentCount: number;
  likeCount: number;
  liked: boolean;
};

function emptyStats(slugs: string[], liked: boolean): Record<string, PostEngagement> {
  return Object.fromEntries(
    slugs.map((slug) => [slug, { commentCount: 0, likeCount: 0, liked }])
  );
}

export async function getPostEngagementStats(
  slugs: string[],
  visitorId: string | null
): Promise<Record<string, PostEngagement>> {
  const unique = [...new Set(slugs)].filter(Boolean);
  if (unique.length === 0) return {};

  const admin = createAdminClient();
  const base = emptyStats(unique, false);

  const [{ data: commentRows }, { data: likeRows }, { data: myLikes }] = await Promise.all([
    admin.from("comments").select("post_slug").in("post_slug", unique),
    admin.from("post_likes").select("post_slug").in("post_slug", unique),
    visitorId
      ? admin.from("post_likes").select("post_slug").eq("visitor_id", visitorId).in("post_slug", unique)
      : Promise.resolve({ data: null as { post_slug: string }[] | null }),
  ]);

  for (const row of commentRows ?? []) {
    const slug = row.post_slug;
    if (slug && slug in base) base[slug].commentCount += 1;
  }

  for (const row of likeRows ?? []) {
    const slug = row.post_slug;
    if (slug && slug in base) base[slug].likeCount += 1;
  }

  for (const row of myLikes ?? []) {
    const slug = row.post_slug;
    if (slug && slug in base) base[slug].liked = true;
  }

  return base;
}

export async function getSinglePostEngagement(
  slug: string,
  visitorId: string | null
): Promise<PostEngagement> {
  const map = await getPostEngagementStats([slug], visitorId);
  return map[slug] ?? { commentCount: 0, likeCount: 0, liked: false };
}
