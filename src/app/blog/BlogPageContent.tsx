"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";
import type { PostEngagement } from "@/lib/engagement";

import { formatPostDate } from "@/lib/format-date";
import { Pagination } from "@/components/ui/Pagination";

/** Preserves the search `q` across pagination links. */
function buildBlogHref(page: number, q: string): string {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export function BlogPageContent({
  posts,
  engagement,
  page,
  pageCount,
  totalPosts,
  query,
}: {
  posts: PostMeta[];
  engagement: Record<string, PostEngagement>;
  page: number;
  pageCount: number;
  totalPosts: number;
  query: string;
}) {
  const router = useRouter();
  // Keep a local draft so typing feels snappy, and only commit to the URL on
  // submit / clear. The draft resyncs whenever the URL-driven `query` changes
  // (e.g. user hits back/forward).
  const [draft, setDraft] = useState(query);
  useEffect(() => {
    setDraft(query);
  }, [query]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = draft.trim();
    router.push(buildBlogHref(1, next));
  }

  function handleClear() {
    setDraft("");
    if (query) router.push("/blog");
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans">

      {/* Hero header */}
      <div className="relative w-full h-[70vh] min-h-[480px] flex flex-col justify-end overflow-hidden">

        {/* Painting — slow scale-up on enter */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            backgroundImage: "url('/images/blog-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
          }}
        />

        {/* Gradient overlay — fades in slightly after image */}
        <motion.div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/30 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        {/* Text — staggered slide up */}
        <div className="relative z-[2] container mx-auto px-4 md:px-6 pb-14 md:pb-20">
          <div className="overflow-hidden">
            <motion.h1
              className="font-brutal font-semibold text-5xl md:text-8xl text-white tracking-tight leading-none mb-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Blog
            </motion.h1>
          </div>

          <motion.div
            className="h-px max-w-xs bg-white/25 mb-6"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
          />

          <motion.p
            className="font-sans text-white/60 leading-relaxed max-w-md text-sm md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
          >
            Notes on engineering, design systems, mobile development, and the overlap between code and craft.
          </motion.p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-8">
        <form
          onSubmit={handleSubmit}
          role="search"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search by title or tag…"
              aria-label="Search posts"
              className="w-full rounded-md border border-white/15 bg-white/[0.04] py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35 focus:bg-white/[0.06]"
            />
            {draft && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
          <p className="font-brutal text-[10px] tracking-[0.18em] uppercase text-white/35">
            {hasQuery
              ? `${totalPosts} match${totalPosts === 1 ? "" : "es"} for “${query}”`
              : `${totalPosts} post${totalPosts === 1 ? "" : "s"}`}
          </p>
        </form>
      </div>

      {/* Posts list — cascade in */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-white/55">
              No posts match{" "}
              <span className="font-mono text-white">“{query}”</span>.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-4 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/55 underline-offset-4 transition hover:text-white hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: "easeOut" }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-10 border-b border-white/10 hover:border-white/30 transition-colors duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/40 border border-white/15 rounded-md px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-brutal font-semibold text-xl md:text-2xl text-white tracking-tight group-hover:text-white/85 transition-colors duration-300 mb-3">
                    {post.title}
                  </h2>
                  <p className="font-sans text-white/50 leading-relaxed text-sm max-w-2xl">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0 sm:pt-1">
                  <span className="font-brutal text-[10px] tracking-[0.15em] uppercase text-white/35">
                    {formatPostDate(post.date)}
                  </span>
                  <span className="font-brutal text-[10px] tracking-[0.15em] uppercase text-white/35">
                    {post.readTime}
                  </span>
                  {(() => {
                    const e = engagement[post.slug] ?? {
                      commentCount: 0,
                      likeCount: 0,
                      liked: false,
                    };
                    return (
                      <div className="flex items-center gap-3 font-brutal text-[10px] tracking-[0.12em] uppercase text-white/40">
                        <span className="inline-flex items-center gap-1" title="Comments">
                          <MessageCircle className="h-3.5 w-3.5 text-white/35" aria-hidden />
                          {e.commentCount}
                        </span>
                        <span className="inline-flex items-center gap-1" title="Likes">
                          <Heart className="h-3.5 w-3.5 text-white/35" aria-hidden />
                          {e.likeCount}
                        </span>
                      </div>
                    );
                  })()}
                  <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 hidden sm:block" />
                </div>
              </Link>
            </motion.div>
          ))
        )}

        <Pagination
          mode="link"
          page={page}
          pageCount={pageCount}
          buildHref={(p) => buildBlogHref(p, query)}
          className="pb-16 pt-8"
        />
      </div>
    </div>
  );
}
