import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
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
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans">

      {/* Header */}
      <div className="relative z-10 pt-32 pb-12 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200 mb-10 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-200" />
            All posts
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/40 border border-white/15 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-brutal font-semibold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6">
            <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">
              {formatDate(post.date)}
            </span>
            <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-3xl py-16 md:py-20">
        <div className="prose-blog">
          <MDXRemote source={post.content} />
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Written by</p>
            <p className="font-brutal text-sm tracking-wide text-white">Edward Lee</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
