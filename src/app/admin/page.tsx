"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

const STORAGE_KEY = "admin_pw";
const FALLBACK_DISPLAY_NAME = "Mystery Goblin";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

type Comment = {
  id: string;
  post_slug: string;
  name: string | null;
  body: string;
  created_at: string;
};

export default function AdminPage() {
  const [pw, setPw]         = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab]       = useState<"new" | "posts" | "comments">("new");

  // New post form
  const [title, setTitle]       = useState("");
  const [slug, setSlug]         = useState("");
  const [excerpt, setExcerpt]   = useState("");
  const [tags, setTags]         = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent]   = useState("");
  const [postStatus, setPostStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [postError, setPostError]   = useState("");

  // Manage
  const [posts, setPosts]       = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts]       = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAuthed(true);
  }, []);

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  function storedPw() {
    return localStorage.getItem(STORAGE_KEY) ?? pw;
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.trim()) return;
    localStorage.setItem(STORAGE_KEY, pw);
    setAuthed(true);
    setAuthError("");
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPw("");
  }

  // ── Fetch posts / comments when switching to manage tabs ─────────────────

  useEffect(() => {
    if (!authed || tab !== "posts") return;
    setLoadingPosts(true);
    fetch("/api/admin/posts", {
      headers: { "x-admin-password": storedPw() },
    })
      .then((r) => r.json())
      .then((j) => setPosts(j.posts ?? []))
      .finally(() => setLoadingPosts(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab]);

  useEffect(() => {
    if (!authed || tab !== "comments") return;
    setLoadingComments(true);
    fetch("/api/admin/comments", {
      headers: { "x-admin-password": storedPw() },
    })
      .then((r) => r.json())
      .then((j) => setComments(j.comments ?? []))
      .finally(() => setLoadingComments(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab]);

  // ── Delete post ───────────────────────────────────────────────────────────

  async function deletePost(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-password": storedPw() },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  // ── Delete comment ────────────────────────────────────────────────────────

  async function deleteComment(id: string) {
    const res = await fetch(`/api/comments?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": storedPw() },
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  // ── Submit new post ───────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;

    setPostStatus("saving");
    setPostError("");

    const res = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPw(),
      },
      body: JSON.stringify({
        title, slug, excerpt, content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        date,
        read_time: readTime,
      }),
    });

    if (res.status === 401) {
      signOut();
      setAuthError("Wrong password. Try again.");
      return;
    }

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setPostError(json.error ?? "Something went wrong");
      setPostStatus("error");
      return;
    }

    setPostStatus("success");
    setTitle(""); setSlug(""); setExcerpt(""); setTags("");
    setReadTime("5 min read"); setContent("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  // ── Auth gate ─────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          <p className="font-brutal text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6">Admin access</p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-white/5 border border-white/15 px-4 py-3 font-brutal text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/40"
            autoFocus
          />
          {authError && (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-red-400">{authError}</p>
          )}
          <button
            type="submit"
            className="w-full border border-white/30 px-4 py-3 font-brutal text-[11px] tracking-[0.25em] uppercase text-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          {(["new", "posts", "comments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-brutal text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 ${
                tab === t ? "text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              {t === "new" ? "New post" : t === "posts" ? "Manage posts" : "Comments"}
            </button>
          ))}
        </div>
        <button
          onClick={signOut}
          className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* ── Tab: New post ── */}
      {tab === "new" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {postStatus === "success" && (
            <div className="border border-white/20 px-4 py-3">
              <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/60">
                Published.{" "}
                <Link href={`/blog/${slug}`} className="underline">View post →</Link>
              </p>
            </div>
          )}
          {postStatus === "error" && (
            <div className="border border-red-500/30 px-4 py-3">
              <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-red-400">{postError}</p>
            </div>
          )}

          <Field label="Title *">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              className={INPUT} placeholder="Post title" />
          </Field>
          <Field label="Slug">
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className={INPUT} placeholder="auto-generated" />
          </Field>
          <Field label="Excerpt">
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
              className={`${INPUT} resize-none`} placeholder="Short description shown on the blog index" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Tags (comma-sep)">
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className={INPUT} placeholder="engineering, design" />
            </Field>
            <Field label="Read time">
              <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} className={INPUT} />
            </Field>
            <Field label="Date">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT} />
            </Field>
          </div>

          <Field label="Content (markdown) *">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={24}
              className={`${INPUT} font-mono resize-y leading-relaxed`} placeholder="Write your post in Markdown..." />
          </Field>

          <button
            type="submit"
            disabled={postStatus === "saving"}
            className="border border-white/30 px-8 py-3 font-brutal text-[11px] tracking-[0.25em] uppercase text-white hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {postStatus === "saving" ? "Publishing..." : "Publish"}
          </button>
        </form>
      )}

      {/* ── Tab: Manage posts ── */}
      {tab === "posts" && (
        <div>
          {loadingPosts ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">No posts yet.</p>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4 py-5 border-b border-white/10"
                >
                  <div className="min-w-0">
                    <p className="font-brutal text-sm text-white truncate">{post.title}</p>
                    <p className="font-brutal text-[9px] tracking-[0.15em] uppercase text-white/30 mt-1">
                      {post.slug} · {post.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deletePost(post.slug)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="font-brutal text-[9px] tracking-[0.15em] uppercase text-white/20 mt-8">
            MDX posts (the built-in ones) are not listed here — delete them by removing the file.
          </p>
        </div>
      )}

      {/* ── Tab: Comments ── */}
      {tab === "comments" && (
        <div>
          {loadingComments ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">No comments yet.</p>
          ) : (
            <div className="space-y-0">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between gap-4 py-5 border-b border-white/10"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-brutal text-xs text-white">{c.name || FALLBACK_DISPLAY_NAME}</span>
                      <span className="font-brutal text-[9px] tracking-[0.15em] uppercase text-white/25">
                        {c.post_slug} · {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-white/50 leading-relaxed line-clamp-2">{c.body}</p>
                  </div>
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-white/20 hover:text-red-400 transition-colors shrink-0 mt-1"
                    title="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full bg-white/5 border border-white/15 px-4 py-3 font-brutal text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-brutal text-[9px] tracking-[0.25em] uppercase text-white/35">{label}</label>
      {children}
    </div>
  );
}
