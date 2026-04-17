import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getMdxSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/blog/CommentSection";
import { DeletePostButton } from "@/components/blog/DeletePostButton";

export async function generateStaticParams() {
  return getMdxSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return { title: `${post.title} — Edward Lee`, description: post.excerpt };
  } catch {
    return { title: "Post not found" };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* Hero header — gradient fade */}
      <div className="relative pt-28 pb-16 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">

          {/* Nav row */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
              All posts
            </Link>
            <DeletePostButton slug={slug} />
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
          <div className="flex items-center gap-5 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl py-14">
        <div className="prose-blog">
          <MDXRemote source={post.content} />
        </div>

        {/* Comments */}
        <CommentSection postSlug={slug} />
      </div>
    </div>
  );
}
