"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPageContent({ posts }: { posts: PostMeta[] }) {
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
          <motion.p
            className="font-display italic text-base md:text-lg text-white/55 tracking-wide mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            Writing
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              className="font-brutal font-semibold text-5xl md:text-8xl text-white tracking-tight leading-none mb-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Blog
            </motion.h1>
          </div>

          <motion.div
            className="h-px max-w-xs bg-white/25 mb-6"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          />

          <motion.p
            className="font-sans text-white/60 leading-relaxed max-w-md text-sm md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          >
            Notes on engineering, design systems, mobile development, and the overlap between code and craft.
          </motion.p>
        </div>
      </div>

      {/* Posts list — cascade in */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.1, ease: "easeOut" }}
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
                      className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/40 border border-white/15 px-2 py-0.5"
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
                  {formatDate(post.date)}
                </span>
                <span className="font-brutal text-[10px] tracking-[0.15em] uppercase text-white/35">
                  {post.readTime}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 hidden sm:block" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
