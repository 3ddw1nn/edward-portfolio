"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminEditFromUrl } from "./AdminEditFromUrl";
import {
  ExternalLink,
  FilePenLine,
  ImagePlus,
  LogOut,
  MessageSquareText,
  Newspaper,
  Pencil,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  DEFAULT_OPENAI_CHAT_MODEL,
  OPENAI_CHAT_MODEL_IDS,
  OPENAI_CHAT_MODELS,
} from "@/lib/openai-chat-models";

const STORAGE_KEY = "admin_pw";
const OPENAI_MODEL_STORAGE_KEY = "admin_openai_model";
const FALLBACK_DISPLAY_NAME = "Mystery Goblin";

/** Body copy: 14px+; small UI chrome: 12px minimum */
const t = {
  body: "text-sm sm:text-base text-white leading-relaxed",
  label: "text-xs sm:text-sm font-medium text-white tracking-wide",
  meta: "text-xs text-white leading-snug",
  title: "text-base sm:text-lg font-semibold text-white tracking-tight",
  /** Sidebar item label: no text-* so active pill inherits `text-black` from the button */
  navLabel: "text-xs sm:text-sm font-medium tracking-wide",
};

const card =
  "rounded-2xl border border-white/[0.12] bg-zinc-950/70 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-md";
const inputClass =
  "w-full min-h-[44px] rounded-xl border border-white/[0.14] bg-black/50 px-4 py-3 text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/25";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] hover:border-white/25";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-zinc-500 disabled:text-zinc-900";
const btnNav = (active: boolean) =>
  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${active ? "bg-white text-black shadow-lg shadow-black/30" : "text-white hover:bg-white/[0.06]"}`;

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
  tags: string[];
  source: "mdx" | "supabase";
};

type Comment = {
  id: string;
  post_slug: string;
  name: string | null;
  body: string;
  created_at: string;
};

type Tab = "new" | "posts" | "comments";

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("new");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  /** When AI sets both title+slug, skip one slugify(title) pass so the model slug is kept */
  const skipSlugifyRef = useRef(false);

  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [generatorPrompt, setGeneratorPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState<null | "autofill" | "prompt" | "polish">(null);
  const [aiError, setAiError] = useState("");
  const [openAiModel, setOpenAiModel] = useState(DEFAULT_OPENAI_CHAT_MODEL);
  const [imageUploadState, setImageUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [imageUploadError, setImageUploadError] = useState("");
  const [postStatus, setPostStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [postError, setPostError] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [successLinkSlug, setSuccessLinkSlug] = useState<string | null>(null);
  const [lastSaveWasEdit, setLastSaveWasEdit] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsFetchError, setPostsFetchError] = useState("");
  const [postsActionError, setPostsActionError] = useState("");
  const [supabasePostsWarning, setSupabasePostsWarning] = useState<string | null>(null);
  const [hiddenDupCount, setHiddenDupCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAuthed(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(OPENAI_MODEL_STORAGE_KEY);
    if (saved && OPENAI_CHAT_MODEL_IDS.includes(saved)) setOpenAiModel(saved);
  }, []);

  useEffect(() => {
    if (editingSlug) return;
    if (skipSlugifyRef.current) {
      skipSlugifyRef.current = false;
      return;
    }
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

  function persistOpenAiModel(id: string) {
    setOpenAiModel(id);
    if (OPENAI_CHAT_MODEL_IDS.includes(id)) {
      localStorage.setItem(OPENAI_MODEL_STORAGE_KEY, id);
    }
  }

  async function postAdminAi(payload: Record<string, unknown>) {
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPw() ?? "",
      },
      body: JSON.stringify({ ...payload, model: openAiModel }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(typeof j.error === "string" ? j.error : "AI request failed");
    return j;
  }

  async function handleAutofillEmpty() {
    setAiError("");
    if (!content.trim()) {
      setAiError("Write something in the Content field first — auto-fill uses it for context.");
      return;
    }
    const fillKeys: string[] = [];
    if (!title.trim()) fillKeys.push("title");
    if (!editingSlug && !slug.trim()) fillKeys.push("slug");
    if (!excerpt.trim()) fillKeys.push("excerpt");
    if (!tags.trim()) fillKeys.push("tags");
    if (!readTime.trim()) fillKeys.push("read_time");
    if (!date.trim()) fillKeys.push("date");
    if (fillKeys.length === 0) {
      setAiError("All metadata fields are already filled.");
      return;
    }
    setAiBusy("autofill");
    try {
      const context = {
        title,
        slug,
        excerpt,
        tags,
        read_time: readTime,
        date,
        contentPreview: content.slice(0, 2000),
      };
      const data = (await postAdminAi({
        action: "autofillEmpty",
        fillKeys,
        context,
      })) as { fields?: Record<string, unknown> };
      const fields = data.fields ?? {};
      const wantTitle = fillKeys.includes("title") && typeof fields.title === "string" && fields.title.trim();
      const wantSlug =
        fillKeys.includes("slug") && typeof fields.slug === "string" && fields.slug.trim() && !editingSlug;
      if (wantTitle && wantSlug) skipSlugifyRef.current = true;
      if (wantTitle) setTitle(String(fields.title).trim());
      if (wantSlug) setSlug(String(fields.slug).trim().toLowerCase().replace(/[^\w-]+/g, "-").replace(/^-|-$/g, ""));
      if (fillKeys.includes("excerpt") && typeof fields.excerpt === "string" && fields.excerpt.trim()) {
        setExcerpt(fields.excerpt.trim());
      }
      if (fillKeys.includes("tags") && Array.isArray(fields.tags)) {
        const arr = fields.tags.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
        if (arr.length) setTags(arr.join(", "));
      }
      if (fillKeys.includes("read_time") && typeof fields.read_time === "string" && fields.read_time.trim()) {
        setReadTime(fields.read_time.trim());
      }
      if (fillKeys.includes("date") && typeof fields.date === "string" && fields.date.trim()) {
        setDate(fields.date.trim().slice(0, 10));
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Auto-fill failed");
    } finally {
      setAiBusy(null);
    }
  }

  async function handleFromPromptGenerate() {
    setAiError("");
    const p = generatorPrompt.trim();
    if (!p) {
      setAiError("Enter a prompt first.");
      return;
    }
    setAiBusy("prompt");
    try {
      const data = (await postAdminAi({
        action: "fromPrompt",
        prompt: p,
      })) as {
        title?: string;
        slug?: string;
        excerpt?: string;
        tags?: string[];
        read_time?: string;
        date?: string;
        content?: string;
      };
      if (!editingSlug) {
        if (data.title && data.slug) skipSlugifyRef.current = true;
        if (typeof data.title === "string") setTitle(data.title);
        if (typeof data.slug === "string") {
          setSlug(data.slug.trim().toLowerCase().replace(/[^\w-]+/g, "-").replace(/^-|-$/g, ""));
        }
        if (typeof data.date === "string") setDate(data.date.slice(0, 10));
      } else if (typeof data.title === "string") {
        setTitle(data.title);
      }
      if (typeof data.excerpt === "string") setExcerpt(data.excerpt);
      if (Array.isArray(data.tags)) {
        setTags(data.tags.filter((x) => typeof x === "string").map((x) => x.trim()).filter(Boolean).join(", "));
      }
      if (typeof data.read_time === "string") setReadTime(data.read_time);
      if (typeof data.content === "string") setContent(data.content);
      setShowPromptGenerator(false);
      setGeneratorPrompt("");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setAiBusy(null);
    }
  }

  async function handlePolishContent() {
    setAiError("");
    if (!content.trim()) {
      setAiError("Add some markdown first, then polish.");
      return;
    }
    setAiBusy("polish");
    try {
      const data = (await postAdminAi({
        action: "improveContent",
        content,
      })) as { content?: string };
      if (typeof data.content === "string") setContent(data.content);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Polish failed");
    } finally {
      setAiBusy(null);
    }
  }

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
        setPosts(
          (j.posts ?? []).map((p) => ({
            ...p,
            tags: Array.isArray(p.tags) ? p.tags : [],
          }))
        );
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

  async function deleteComment(id: string) {
    const res = await fetch(`/api/comments?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": storedPw() },
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

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
    setTitle("");
    setSlug("");
    setExcerpt("");
    setTags("");
    setReadTime("5 min read");
    setContent("");
    setDate(new Date().toISOString().slice(0, 10));
    setTab("new");
  }

  if (!authed) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 pb-16 pt-4">
        <div className={`w-full max-w-md overflow-hidden ${card} p-0`}>
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.1]">
            <Image
              src="/images/Guts.png"
              alt=""
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width: 448px) 100vw, 448px"
              priority
            />
          </div>
          <div className="space-y-6 p-8 sm:p-10">
            <div>
              <h1 className={`${t.title} text-2xl`}>Admin</h1>
              <p className={`${t.meta} mt-2`}>Sign in to manage posts and comments.</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label htmlFor="admin-pw" className={`mb-2 block ${t.label}`}>
                  Password
                </label>
                <input
                  id="admin-pw"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className={inputClass}
                  placeholder="Enter password"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                  {authError}
                </p>
              )}
              <button type="submit" className={`${btnPrimary} w-full`}>
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Suspense fallback={null}>
        <AdminEditFromUrl authed={authed} loadPostForEdit={loadPostForEdit} />
      </Suspense>

      <aside className="shrink-0 border-b border-white/[0.1] bg-zinc-950/80 px-4 py-5 lg:w-56 lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
        <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
          <button type="button" onClick={() => setTab("new")} className={btnNav(tab === "new")}>
            <FilePenLine className="h-4 w-4 shrink-0" aria-hidden />
            <span className={t.navLabel}>Create Post</span>
          </button>
          <button type="button" onClick={() => setTab("posts")} className={btnNav(tab === "posts")}>
            <Newspaper className="h-4 w-4 shrink-0" aria-hidden />
            <span className={t.navLabel}>Posts</span>
          </button>
          <button type="button" onClick={() => setTab("comments")} className={btnNav(tab === "comments")}>
            <MessageSquareText className="h-4 w-4 shrink-0" aria-hidden />
            <span className={t.navLabel}>Comments</span>
          </button>
        </nav>

        <div className="mt-8 hidden border-t border-white/[0.08] pt-8 lg:block">
          <button
            type="button"
            onClick={signOut}
            className={`${btnGhost} w-full justify-start border-white/[0.1] bg-transparent text-sm hover:border-red-400/40 hover:text-red-200`}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>

        <div className="mt-6 lg:hidden">
          <button type="button" onClick={signOut} className={`${btnGhost} w-full text-sm`}>
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 lg:pb-14 lg:pt-10">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          {tab === "new" && (
            <div className={`${card} p-6 sm:p-8 lg:p-10`}>
              <header className="mb-8 flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className={`${t.title} text-xl sm:text-2xl`}>{editingSlug ? "Edit post" : "New post"}</h2>
                  <p className={`${t.meta} mt-2 max-w-xl`}>
                    {editingSlug
                      ? "Changes go live after save. The post date on the blog index updates to today."
                      : "Publish markdown to your blog. Slug is generated from the title until you edit it."}
                  </p>
                </div>
                <div className="flex w-full min-w-0 flex-col gap-3 sm:ml-auto sm:w-full sm:max-w-md">
                  <div>
                    <label htmlFor="admin-openai-model" className={`mb-1.5 block ${t.label}`}>
                      Model
                    </label>
                    <select
                      id="admin-openai-model"
                      value={openAiModel}
                      onChange={(e) => persistOpenAiModel(e.target.value)}
                      className={`${inputClass} cursor-pointer py-2.5`}
                    >
                      {OPENAI_CHAT_MODELS.map((m) => (
                        <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAiError("");
                        setShowPromptGenerator((v) => !v);
                      }}
                      className={`${btnGhost} min-w-0 justify-center px-2 py-2.5 text-center text-xs leading-tight sm:px-3 sm:text-sm`}
                    >
                      <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="min-w-0">Prompt generator</span>
                    </button>
                    <button
                      type="button"
                      disabled={aiBusy !== null || !content.trim()}
                      onClick={() => void handleAutofillEmpty()}
                      title={!content.trim() ? "Write something in Content first — AI uses it for tone" : undefined}
                      className={`${btnGhost} min-w-0 justify-center px-2 py-2.5 text-center text-xs leading-tight sm:px-3 sm:text-sm disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-zinc-900/60 disabled:text-zinc-500`}
                    >
                      <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="min-w-0">{aiBusy === "autofill" ? "Filling…" : "Auto-fill empty"}</span>
                    </button>
                  </div>
                </div>
              </header>

              {showPromptGenerator && (
                <div className="mb-6 space-y-3 rounded-xl border border-violet-400/25 bg-violet-950/20 p-4 sm:p-5">
                  <p className={`${t.label}`}>Describe the post you want</p>
                  <textarea
                    value={generatorPrompt}
                    onChange={(e) => setGeneratorPrompt(e.target.value)}
                    rows={5}
                    className={`${inputClass} min-h-[120px] resize-y py-3`}
                    placeholder="e.g. A post about how we built our recommendation engine with embeddings…"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={aiBusy !== null}
                      onClick={() => void handleFromPromptGenerate()}
                      className={btnPrimary}
                    >
                      {aiBusy === "prompt" ? "Generating…" : "Generate draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromptGenerator(false);
                        setAiError("");
                      }}
                      className={btnGhost}
                    >
                      Close
                    </button>
                  </div>
                  <p className={`${t.meta} text-sm`}>
                    Fills title, slug, excerpt, tags, read time, date, and markdown body. Images are never added by
                    AI — use Upload & insert after.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {editingSlug && (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-400/30 bg-amber-950/25 px-4 py-4 sm:px-5">
                    <p className={`${t.body} text-white`}>
                      Editing <span className="font-semibold">{editingSlug}</span>
                    </p>
                    <button type="button" onClick={cancelEditDraft} className={btnGhost}>
                      Cancel edit
                    </button>
                  </div>
                )}

                {postStatus === "success" && successLinkSlug && (
                  <div className="rounded-xl border border-emerald-400/35 bg-emerald-950/30 px-4 py-4 sm:px-5">
                    <p className={`${t.body} text-white`}>
                      {lastSaveWasEdit ? "Saved." : "Published."}{" "}
                      <Link href={`/blog/${successLinkSlug}`} className="font-semibold underline underline-offset-4">
                        View post
                      </Link>
                    </p>
                  </div>
                )}
                {postStatus === "error" && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/35 px-4 py-4">
                    <p className={`${t.body} text-red-100`}>{postError}</p>
                  </div>
                )}
                {aiError && (
                  <div className="rounded-xl border border-amber-400/35 bg-amber-950/25 px-4 py-3">
                    <p className={`${t.body} text-amber-100`}>{aiError}</p>
                  </div>
                )}

                <Field label="Title *">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Post title"
                  />
                </Field>
                <Field label="Slug">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    readOnly={!!editingSlug}
                    className={`${inputClass} ${editingSlug ? "cursor-not-allowed border-white/[0.08] bg-zinc-900/80" : ""}`}
                    placeholder="url-friendly-slug"
                  />
                </Field>
                <Field label="Excerpt">
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className={`${inputClass} min-h-[88px] resize-y py-3`}
                    placeholder="Short description for the blog index"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Tags (comma-separated)">
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className={inputClass}
                      placeholder="design, engineering"
                    />
                  </Field>
                  <Field label="Read time">
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className={inputClass}
                      placeholder="5 min read"
                    />
                  </Field>
                  <Field label={editingSlug ? "Date (updated on save)" : "Date"}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={!!editingSlug}
                      className={`${inputClass} ${editingSlug ? "cursor-not-allowed border-white/[0.08] bg-zinc-900/90" : ""}`}
                    />
                  </Field>
                </div>

                <div className="rounded-xl border border-white/[0.1] bg-black/30 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`${t.label}`}>Images</span>
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
                      className={`${btnGhost} disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-zinc-800`}
                    >
                      <ImagePlus className="h-4 w-4" aria-hidden />
                      {imageUploadState === "uploading" ? "Uploading…" : "Upload & insert"}
                    </button>
                  </div>
                  <p className={`${t.meta} mt-3`}>
                    Inserts markdown at the cursor. Bucket: <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs text-white">blog-images</code>
                  </p>
                  {imageUploadState === "error" && imageUploadError && (
                    <p className="mt-3 text-sm text-red-200">{imageUploadError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-white sm:text-sm">
                      Content (markdown) *
                    </label>
                    <button
                      type="button"
                      disabled={aiBusy !== null || !content.trim()}
                      onClick={() => void handlePolishContent()}
                      title={!content.trim() ? "Add markdown in Content first" : undefined}
                      className={`${btnGhost} shrink-0 text-sm disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-zinc-900/60 disabled:text-zinc-500`}
                    >
                      <Wand2 className="h-4 w-4" aria-hidden />
                      {aiBusy === "polish" ? "Polishing…" : "Polish content"}
                    </button>
                  </div>
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={22}
                    className={`${inputClass} min-h-[320px] resize-y font-mono text-[13px] leading-relaxed sm:text-sm`}
                    placeholder="Write your post…"
                  />
                  <p className={`${t.meta} text-sm`}>
                    Auto-fill and Polish need text in Content first. Polish rewrites your markdown for clarity and
                    never adds images — upload those yourself.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" disabled={postStatus === "saving"} className={btnPrimary}>
                    {postStatus === "saving"
                      ? editingSlug
                        ? "Saving…"
                        : "Publishing…"
                      : editingSlug
                        ? "Save changes"
                        : "Publish"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === "posts" && (
            <div className={`${card} p-6 sm:p-8 lg:p-10`}>
              <header className="mb-8 border-b border-white/[0.08] pb-6">
                <h2 className={`${t.title} text-xl sm:text-2xl`}>Posts</h2>
                <p className={`${t.meta} mt-2`}>Every entry on your blog. Database posts can be edited or removed here.</p>
              </header>

              {postsActionError && (
                <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/35 px-4 py-3 text-sm text-red-100">
                  {postsActionError}
                </p>
              )}
              {postsFetchError && (
                <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/35 px-4 py-3 text-sm text-red-100">
                  {postsFetchError}
                </p>
              )}
              {supabasePostsWarning && (
                <p className="mb-4 rounded-xl border border-amber-400/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
                  Database list error: {supabasePostsWarning} — optional MDX manifest entries may still show.
                </p>
              )}

              {loadingPosts ? (
                <p className={`${t.body} py-12 text-center`}>Loading posts…</p>
              ) : posts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.2] bg-black/25 px-6 py-12 text-center">
                  <p className={`${t.body}`}>
                    No posts yet. Run <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-sm text-white">supabase/schema_seed.sql</code> in Supabase, then publish from Create Post — or add optional <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-sm text-white">.mdx</code> files under{" "}
                    <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-sm text-white">src/content/blog</code>.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className="flex flex-col gap-4 rounded-xl border border-white/[0.1] bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        {post.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-full border border-white/[0.18] bg-white/[0.06] px-3 py-1 text-xs font-medium text-white"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className={`${t.meta} text-sm`}>No tags</p>
                        )}
                        <p className={`${t.title} mt-3 line-clamp-2`}>{post.title}</p>
                        <p className={`${t.meta} mt-2 font-mono text-xs sm:text-sm`}>
                          {post.slug} · {post.date}
                        </p>
                        {post.excerpt ? (
                          <p className={`${t.body} mt-2 line-clamp-2 text-sm`}>{post.excerpt}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row lg:items-center">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className={`${btnGhost} justify-center text-sm`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          View
                        </Link>
                        {post.source === "supabase" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => loadPostForEdit(post.slug)}
                              className={`${btnGhost} justify-center border-white/[0.2] bg-white/[0.08] text-sm`}
                            >
                              <Pencil className="h-4 w-4" aria-hidden />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePost(post)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-950/30 px-4 py-2.5 text-sm font-medium text-red-100 transition hover:border-red-400/60 hover:bg-red-950/50"
                              title="Delete from database"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className={`${t.meta} rounded-lg border border-white/[0.08] px-3 py-2 text-center text-xs`}>
                            File-backed — remove the <code className="text-white">.mdx</code> in the repo to drop it.
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {hiddenDupCount > 0 && (
                <p className={`${t.meta} mt-8 rounded-xl border border-white/[0.1] bg-black/20 p-4`}>
                  {hiddenDupCount} slug(s) have both an MDX file and a database row — the site uses the database copy.
                  Re-run <code className="rounded bg-white/10 px-1 py-0.5 text-white">pnpm seed:posts</code> after file edits, or remove one source.
                </p>
              )}
              <p className={`${t.meta} mt-6`}>
                Supabase holds live posts. Optional <code className="rounded bg-white/10 px-1 py-0.5 text-white">.mdx</code> in{" "}
                <code className="rounded bg-white/10 px-1 py-0.5 text-white">src/content/blog</code> appear here after{" "}
                <code className="rounded bg-white/10 px-1 py-0.5 text-white">pnpm prebuild</code>.
              </p>
            </div>
          )}

          {tab === "comments" && (
            <div className={`${card} p-6 sm:p-8 lg:p-10`}>
              <header className="mb-8 border-b border-white/[0.08] pb-6">
                <h2 className={`${t.title} text-xl sm:text-2xl`}>Comments</h2>
                <p className={`${t.meta} mt-2`}>Moderate reader comments across all posts.</p>
              </header>

              {loadingComments ? (
                <p className={`${t.body} py-12 text-center`}>Loading comments…</p>
              ) : comments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.2] bg-black/25 px-6 py-12 text-center">
                  <p className={`${t.body}`}>No comments yet.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-4 rounded-xl border border-white/[0.1] bg-black/30 p-5 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`${t.title} text-base`}>{c.name || FALLBACK_DISPLAY_NAME}</p>
                        <p className={`${t.meta} mt-1 font-mono text-xs sm:text-sm`}>
                          {c.post_slug} · {new Date(c.created_at).toLocaleDateString()}
                        </p>
                        <p className={`${t.body} mt-3 line-clamp-4`}>{c.body}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteComment(c.id)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-red-500/35 bg-red-950/30 px-4 py-2.5 text-sm font-medium text-red-100 transition hover:border-red-400/60 hover:bg-red-950/50"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-widest text-white sm:text-sm">{label}</label>
      {children}
    </div>
  );
}
