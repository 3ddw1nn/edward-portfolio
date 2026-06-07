import type { ImgHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MessageCircle } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug } from "@/lib/blog";
import { getSinglePostEngagement } from "@/lib/engagement";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/blog/CommentSection";
import { BlogPostAdminToolbar } from "@/components/blog/BlogPostAdminToolbar";
import { PostLikeButton } from "@/components/blog/PostLikeButton";
import { formatPostDate, formatPostDateTime } from "@/lib/format-date";

// Render server-side on every request so engagement counts (comments, likes)
// and the `updated_at` timestamp reflect the latest DB state after admin
// deletes / edits, instead of being frozen at build time. Edge runtime can't
// coexist with `generateStaticParams`, so no pre-rendering here.
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Post not found" };
  return { title: `${post.title} — Edward Lee`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const engagement = await getSinglePostEngagement(slug, null).catch(() => ({
    commentCount: 0,
    likeCount: 0,
    liked: false,
  }));

  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* Hero header — gradient fade */}
      <div className="relative pt-28 pb-16 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">

          {/* Nav row */}
          <div className="flex items-center justify-between mb-12 gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
              All posts
            </Link>
            <BlogPostAdminToolbar slug={slug} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium tracking-wide px-3 py-1 rounded-md border border-white/20 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-brutal text-4xl md:text-6xl font-semibold text-white leading-[1.05] tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 border-t border-white/10">
            <div
              className="flex items-center gap-1.5 text-xs text-white/50"
              title={`Last updated ${formatPostDateTime(post.updatedAt)}`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatPostDate(post.updatedAt)}
            </div>
            <div className="w-px h-3 bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </div>
            <div className="w-px h-3 bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <MessageCircle className="h-3.5 w-3.5" />
              {engagement.commentCount} comment{engagement.commentCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl py-14">
        <div className="prose-blog">
          <MDXRemote
            source={post.content}
            components={{
              img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
                <figure className="not-prose mx-auto my-8 w-full max-w-[min(100%,min(36ch,26rem))] overflow-hidden rounded-lg border border-white/[0.08] bg-zinc-900/35 text-[1.0625rem] shadow-[0_12px_40px_-24px_rgba(0,0,0,0.75)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote blog uploads (Supabase etc.) */}
                  <img
                    {...props}
                    alt={props.alt ?? ""}
                    className="mx-auto block h-auto w-full max-w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ),
            }}
          />
        </div>

        <section className="mt-12 border-t border-white/[0.06] pt-8" aria-label="Post reactions">
          <p className="font-brutal text-[9px] uppercase tracking-[0.2em] text-white/35">
            Enjoyed this post?
          </p>
          <div className="mt-2.5">
            <PostLikeButton slug={slug} initialLikeCount={engagement.likeCount} size="hero" />
          </div>
        </section>

        {/* Comments */}
        <CommentSection postSlug={slug} />
      </div>
    </div>
  );
}
