"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";
import type { PostEngagement } from "@/lib/engagement";

import { formatPostDate } from "@/lib/format-date";
import { Pagination } from "@/components/ui/Pagination";

const BLOG_PAGE_SIZE = 10;

function matchesQuery(p: PostMeta, qLower: string): boolean {
  if (!qLower) return true;
  if (p.title.toLowerCase().includes(qLower)) return true;
  return p.tags.some((tag) => tag.toLowerCase().includes(qLower));
}

/** Mutates the URL without navigating, so no server refetch / animation replay. */
function syncUrl(query: string, page: number) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  const next = qs ? `/blog?${qs}` : "/blog";
  window.history.replaceState(window.history.state, "", next);
}

export function BlogPageContent({
  posts: allPosts,
  engagement,
  initialQuery,
  initialPage,
}: {
  posts: PostMeta[];
  engagement: Record<string, PostEngagement>;
  initialQuery: string;
  initialPage: number;
}) {
  // `query` is the committed search (drives filtering); `draft` is what's in the input.
  // Typing updates both immediately so filtering feels live.
  const [query, setQuery] = useState(initialQuery);
  const [draft, setDraft] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);

  const filtered = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    return qLower ? allPosts.filter((p) => matchesQuery(p, qLower)) : allPosts;
  }, [allPosts, query]);

  const totalFiltered = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalFiltered / BLOG_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  const pagePosts = filtered.slice(start, start + BLOG_PAGE_SIZE);

  // Keep the URL in sync whenever the committed query or page changes.
  useEffect(() => {
    syncUrl(query, safePage);
  }, [query, safePage]);

  const commitSearch = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setPage(1);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commitSearch(draft.trim());
  }

  function handleClearInput() {
    setDraft("");
    commitSearch("");
  }

  function handleShowAll() {
    setDraft("");
    commitSearch("");
    setPage(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePageChange(p: number) {
    setPage(p);
    if (typeof window !== "undefined") {
      // Scroll back up to the top of the list area when paging.
      const el = document.getElementById("posts-list");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans">

      {/* Hero header */}
      <div className="relative w-full h-[70vh] min-h-[480px] flex flex-col justify-end overflow-hidden">
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

        <motion.div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/30 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />

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
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search by title or tag…"
              aria-label="Search posts"
              className="w-full rounded-md border border-white/15 bg-white/[0.04] py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35 focus:bg-white/[0.06]"
            />
            {draft && (
              <button
                type="button"
                onClick={handleClearInput}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="font-brutal text-[10px] tracking-[0.18em] uppercase text-white/35">
              {hasQuery
                ? `${totalFiltered} match${totalFiltered === 1 ? "" : "es"} for “${query}”`
                : `${totalFiltered} post${totalFiltered === 1 ? "" : "s"}`}
            </p>
            {hasQuery && (
              <button
                type="button"
                onClick={handleShowAll}
                className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 underline-offset-4 transition hover:text-white hover:underline"
              >
                Show all posts
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts list */}
      <div id="posts-list" className="relative z-10 container mx-auto px-4 md:px-6 scroll-mt-4">
        {pagePosts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-white/55">
              No posts match{" "}
              <span className="font-mono text-white">“{query}”</span>.
            </p>
            <button
              type="button"
              onClick={handleShowAll}
              className="mt-4 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Show all posts
            </button>
          </div>
        ) : (
          pagePosts.map((post) => (
            <div key={post.slug}>
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
            </div>
          ))
        )}

        <Pagination
          mode="button"
          page={safePage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          className="pb-16 pt-8"
        />
      </div>
    </div>
  );
}
