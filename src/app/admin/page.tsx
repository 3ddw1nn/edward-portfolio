"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AdminEditFromUrl } from "./AdminEditFromUrl";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";

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
  source: "mdx" | "supabase";
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
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadState, setImageUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [imageUploadError, setImageUploadError] = useState("");
  const [postStatus, setPostStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [postError, setPostError]   = useState("");
  /** When set, the New post form PATCHes this slug and refreshes `date` to today on save. */
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [successLinkSlug, setSuccessLinkSlug] = useState<string | null>(null);
  const [lastSaveWasEdit, setLastSaveWasEdit] = useState(false);

  // Manage
  const [posts, setPosts]       = useState<Post[]>([]);
  const [postsFetchError, setPostsFetchError] = useState("");
  const [postsActionError, setPostsActionError] = useState("");
  const [supabasePostsWarning, setSupabasePostsWarning] = useState<string | null>(null);
  const [hiddenDupCount, setHiddenDupCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts]       = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAuthed(true);
  }, []);

  useEffect(() => {
    if (editingSlug) return;
    setSlug(slugify(title));
  }, [title, editingSlug]);

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
    setPostsFetchError("");
    setPostsActionError("");
    fetch("/api/admin/posts", {
      headers: { "x-admin-password": storedPw() },
    })
      .then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as {
          posts?: Post[];
          supabaseError?: string | null;
          hiddenDbDuplicateCount?: number;
          error?: string;
        };
        if (!r.ok) throw new Error(j.error ?? "Failed to load posts");
        setPosts(j.posts ?? []);
        setSupabasePostsWarning(j.supabaseError ?? null);
        setHiddenDupCount(
          typeof j.hiddenDbDuplicateCount === "number" ? j.hiddenDbDuplicateCount : 0
        );
      })
      .catch((e: unknown) => {
        setPosts([]);
        setPostsFetchError(e instanceof Error ? e.message : "Failed to load posts");
      })
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

  async function deletePost(post: Post) {
    if (post.source === "mdx") return;
    if (!confirm(`Delete "${post.slug}" from the database? This cannot be undone.`)) return;
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(post.slug)}`, {
      method: "DELETE",
      headers: { "x-admin-password": storedPw() },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
      if (editingSlug === post.slug) cancelEditDraft();
    }
  }

  function cancelEditDraft() {
    setEditingSlug(null);
    setSuccessLinkSlug(null);
    setLastSaveWasEdit(false);
    setPostStatus("idle");
    setPostError("");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setTags("");
    setReadTime("5 min read");
    setContent("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  async function loadPostForEdit(postSlug: string): Promise<boolean> {
    setPostStatus("idle");
    setPostError("");
    setPostsActionError("");
    setSuccessLinkSlug(null);
    setLastSaveWasEdit(false);
    const res = await fetch(`/api/admin/post?slug=${encodeURIComponent(postSlug)}`, {
      headers: { "x-admin-password": storedPw() ?? "" },
    });
    const json = (await res.json().catch(() => ({}))) as {
      post?: {
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        tags: string[];
        read_time: string;
        date: string;
      };
      error?: string;
    };
    const errMsg = json.error ?? "Could not load post";
    if (!res.ok) {
      setPostsActionError(errMsg);
      setPostError(errMsg);
      return false;
    }
    const p = json.post;
    if (!p) {
      setPostsActionError(errMsg);
      setPostError(errMsg);
      return false;
    }
    setEditingSlug(p.slug);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt ?? "");
    setTags(Array.isArray(p.tags) ? p.tags.join(", ") : "");
    setReadTime(p.read_time ?? "5 min read");
    setDate(p.date);
    setContent(p.content ?? "");
    setTab("new");
    return true;
  }

  async function handleBlogImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImageUploadState("uploading");
    setImageUploadError("");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": storedPw() ?? "" },
      body: fd,
    });

    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok) {
      setImageUploadError(json.error ?? "Upload failed");
      setImageUploadState("error");
      return;
    }

    const url = json.url;
    if (!url) {
      setImageUploadError("No URL returned");
      setImageUploadState("error");
      return;
    }

    const insert = `\n\n![Image](${url})\n`;
    const ta = contentRef.current;
    setContent((prev) => {
      if (ta && typeof ta.selectionStart === "number") {
        const start = ta.selectionStart;
        const end = ta.selectionEnd ?? start;
        const next = prev.slice(0, start) + insert + prev.slice(end);
        queueMicrotask(() => {
          ta.focus();
          const pos = start + insert.length;
          ta.setSelectionRange(pos, pos);
        });
        return next;
      }
      return prev + insert;
    });

    setImageUploadState("idle");
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
    setSuccessLinkSlug(null);

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const viewSlug = editingSlug ?? slug;

    const res = editingSlug
      ? await fetch("/api/blog", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": storedPw() ?? "",
          },
          body: JSON.stringify({
            slug: editingSlug,
            title,
            excerpt,
            content,
            tags: tagList,
            read_time: readTime,
          }),
        })
      : await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": storedPw() ?? "",
          },
          body: JSON.stringify({
            title,
            slug,
            excerpt,
            content,
            tags: tagList,
            date,
            read_time: readTime,
          }),
        });

    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      post?: { date?: string; slug?: string };
    };

    if (res.status === 401) {
      setPostStatus("idle");
      signOut();
      setAuthError("Wrong password. Try again.");
      return;
    }

    if (!res.ok) {
      setPostError(json.error ?? "Something went wrong");
      setPostStatus("error");
      return;
    }

    const wasEditing = editingSlug !== null;
    const nextSlug = json.post?.slug ?? viewSlug;

    setSuccessLinkSlug(nextSlug);
    setLastSaveWasEdit(wasEditing);
    setPostStatus("success");
    setEditingSlug(null);
    setPostError("");
    // Blank “new post” form after any successful save (create or edit).
    setTitle("");
    setSlug("");
    setExcerpt("");
    setTags("");
    setReadTime("5 min read");
    setContent("");
    setDate(new Date().toISOString().slice(0, 10));
    setTab("new");
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
      <Suspense fallback={null}>
        <AdminEditFromUrl authed={authed} loadPostForEdit={loadPostForEdit} />
      </Suspense>

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
          {editingSlug && (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-white/15 px-4 py-3 bg-white/[0.03]">
              <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/55">
                Editing <span className="text-white">{editingSlug}</span>
                <span className="block font-sans normal-case text-[11px] text-white/35 mt-1 tracking-normal">
                  Saving sets the post date to today on the blog index.
                </span>
              </p>
              <button
                type="button"
                onClick={cancelEditDraft}
                className="font-brutal text-[9px] tracking-[0.2em] uppercase text-white/40 hover:text-white border border-white/15 px-3 py-2"
              >
                Cancel
              </button>
            </div>
          )}
          {postStatus === "success" && successLinkSlug && (
            <div className="border border-white/20 px-4 py-3">
              <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/60">
                {lastSaveWasEdit ? "Saved — date set to today on the blog." : "Published."}{" "}
                <Link href={`/blog/${successLinkSlug}`} className="underline">
                  View post →
                </Link>
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
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              readOnly={!!editingSlug}
              className={`${INPUT} ${editingSlug ? "opacity-60 cursor-not-allowed" : ""}`}
              placeholder="auto-generated"
            />
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
            <Field label={editingSlug ? "Date (set on save)" : "Date"}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!!editingSlug}
                className={`${INPUT} ${editingSlug ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </Field>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-brutal text-[9px] tracking-[0.25em] uppercase text-white/35">
                Images
              </span>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleBlogImageChange}
              />
              <button
                type="button"
                disabled={imageUploadState === "uploading"}
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 font-brutal text-[9px] tracking-[0.2em] uppercase text-white/70 hover:text-white hover:border-white/40 transition-colors disabled:opacity-40"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                {imageUploadState === "uploading" ? "Uploading…" : "Upload & insert"}
              </button>
              <span className="font-sans text-[11px] text-white/35">
                Inserts markdown at the cursor (Supabase bucket <code className="text-white/50">blog-images</code>).
              </span>
            </div>
            {imageUploadState === "error" && imageUploadError && (
              <p className="font-brutal text-[9px] uppercase text-red-400">{imageUploadError}</p>
            )}
          </div>

          <Field label="Content (markdown) *">
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={24}
              className={`${INPUT} font-mono resize-y leading-relaxed`}
              placeholder="Write your post in Markdown..."
            />
          </Field>

          <button
            type="submit"
            disabled={postStatus === "saving"}
            className="border border-white/30 px-8 py-3 font-brutal text-[11px] tracking-[0.25em] uppercase text-white hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {postStatus === "saving"
              ? editingSlug
                ? "Saving..."
                : "Publishing..."
              : editingSlug
                ? "Save changes"
                : "Publish"}
          </button>
        </form>
      )}

      {/* ── Tab: Manage posts ── */}
      {tab === "posts" && (
        <div>
          {postsActionError && (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-red-400 mb-4">
              {postsActionError}
            </p>
          )}
          {postsFetchError && (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-red-400 mb-4">
              {postsFetchError}
            </p>
          )}
          {supabasePostsWarning && (
            <p className="font-brutal text-[9px] tracking-[0.15em] uppercase text-amber-400/90 mb-4 leading-relaxed">
              Database list error: {supabasePostsWarning} — optional MDX files (if any) still show from the manifest.
            </p>
          )}
          {loadingPosts ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25">
              No posts found. Run supabase/posts.sql, then publish from New post — or add optional .mdx files under
              src/content/blog.
            </p>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4 py-5 border-b border-white/10"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-block font-brutal text-[8px] tracking-[0.2em] uppercase text-white/40 border border-white/15 rounded-sm px-2 py-0.5">
                        {post.source === "mdx" ? "MDX file" : "Database"}
                      </span>
                    </div>
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
                    {post.source === "supabase" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => loadPostForEdit(post.slug)}
                          className="font-brutal text-[9px] tracking-[0.2em] uppercase text-zinc-200 hover:text-white transition-colors inline-flex items-center gap-1.5 rounded border border-white/25 bg-white/[0.06] px-2.5 py-1.5 hover:border-white/40"
                          title="Edit in admin"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePost(post)}
                          className="rounded border border-white/15 bg-transparent p-1.5 text-zinc-400 hover:border-red-400/40 hover:text-red-400 transition-colors"
                          title="Delete post from database"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <span
                        className="font-brutal text-[8px] tracking-[0.15em] uppercase text-white/15 max-w-[7rem] text-right leading-tight"
                        title="File-only post: delete the .mdx under src/content/blog to remove it"
                      >
                        File-backed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {hiddenDupCount > 0 && (
            <p className="font-brutal text-[9px] tracking-[0.15em] uppercase text-white/25 mt-8 leading-relaxed">
              {hiddenDupCount} slug(s) have both an MDX file and a database row — the live site uses the{" "}
              <span className="text-white/55">database</span> copy. Keep them in sync (edit in admin or re-run{" "}
              <code className="text-white/45">pnpm seed:posts</code> after changing the file), or remove one source.
            </p>
          )}
          <p className="font-brutal text-[9px] tracking-[0.15em] uppercase text-white/20 mt-8 leading-relaxed">
            Posts are stored in Supabase (New post). Optional .mdx files in src/content/blog merge into the admin
            list after <code className="text-white/45">pnpm prebuild</code>.
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
