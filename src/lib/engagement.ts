import { sql } from "./db";

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

  const base = emptyStats(unique, false);

  const [commentRows, likeRows, myLikeRows] = await Promise.all([
    sql`SELECT post_slug FROM comments WHERE post_slug = ANY(${unique})`,
    sql`SELECT post_slug FROM post_likes WHERE post_slug = ANY(${unique})`,
    visitorId
      ? sql`SELECT post_slug FROM post_likes WHERE visitor_id = ${visitorId}::uuid AND post_slug = ANY(${unique})`
      : Promise.resolve([] as { post_slug: string }[]),
  ]);

  for (const row of commentRows) {
    const s = row.post_slug as string;
    if (s && s in base) base[s].commentCount += 1;
  }
  for (const row of likeRows) {
    const s = row.post_slug as string;
    if (s && s in base) base[s].likeCount += 1;
  }
  for (const row of myLikeRows) {
    const s = row.post_slug as string;
    if (s && s in base) base[s].liked = true;
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
