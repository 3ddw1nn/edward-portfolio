"use client";

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { Heart, MessageCircleReply, Trash2, X } from "lucide-react";
import { getOrCreateBlogVisitorId } from "@/lib/blogVisitor";
import { combinedCommentText, isProfane, PROFANITY_COMMENT_WARNING } from "@/lib/profanity";
import Image from "next/image";
import { GifPicker } from "./GifPicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STORAGE_KEY = "admin_pw";
const FALLBACK_DISPLAY_NAME = "Mystery Goblin";

type Comment = {
  id: string;
  name: string | null;
  body: string;
  gif_url: string | null;
  reply_to_id: string | null;
  reply_to_name: string | null;
  created_at: string;
  like_count: number;
  liked: boolean;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const AVATAR_COLORS = [
  "#5865f2", "#eb459e", "#ed4245", "#fee75c",
  "#57f287", "#1abc9c", "#e67e22", "#3498db",
];

const AVATAR_BG_COLORS = [
  "#5865f2",
  "#eb459e",
  "#ed4245",
  "#fee75c",
  "#57f287",
  "#1abc9c",
  "#e67e22",
  "#3498db",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#22c55e",
];

function getStableColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_BG_COLORS[hash % AVATAR_BG_COLORS.length];
}

function Avatar({ name, commentId }: { name: string | null; commentId: string }) {
  if (!name) {
    return (
      <div
        className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center select-none overflow-hidden"
        style={{ backgroundColor: getStableColor(commentId) }}
      >
        <Image
          src="/images/MysteryGoblin.png"
          alt="Mystery Goblin avatar"
          width={34}
          height={34}
          className="object-contain"
          unoptimized
        />
      </div>
    );
  }

  const letter = (name || "A")[0].toUpperCase();
  const bg = AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold text-white select-none"
      style={{ backgroundColor: bg }}
    >
      {letter}
    </div>
  );
}

function GifBadge({ active }: { active?: boolean }) {
  return (
    <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", borderRadius: "8px" }} className={`inline-flex items-center justify-center px-3 py-1.5 text-[13px] font-bold leading-none transition-colors ${
      active ? "bg-[#5865f2] text-white" : "bg-white text-black"
    }`}>
      GIF
    </span>
  );
}

export function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments]           = useState<Comment[]>([]);
  const [loading, setLoading]             = useState(true);
  const [isAdmin, setIsAdmin]             = useState(false);
  const [name, setName]                   = useState("");
  const [body, setBody]                   = useState("");
  const [selectedGif, setSelectedGif]     = useState<{ url: string; title: string } | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [errorMsg, setErrorMsg]           = useState("");
  const [hoveredId, setHoveredId]         = useState<string | null>(null);
  const [replyTarget, setReplyTarget]     = useState<{ id: string; name: string; preview: string } | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const [pendingLikeId, setPendingLikeId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const textareaRef                       = useRef<HTMLTextAreaElement>(null);
  const gifBtnRef                         = useRef<HTMLButtonElement>(null);
  const sentinelRef                       = useRef<HTMLDivElement>(null);
  /** Tracks the cursor for the current in-flight request so we ignore stale responses. */
  const loadRequestRef                    = useRef(0);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  const loadPage = useCallback(
    async (nextCursor: string | null, replace: boolean) => {
      const requestId = ++loadRequestRef.current;
      const visitorId = getOrCreateBlogVisitorId();
      const params = new URLSearchParams({ slug: postSlug, limit: "10" });
      if (visitorId) params.set("visitor_id", visitorId);
      if (nextCursor) params.set("cursor", nextCursor);

      const res = await fetch(`/api/comments?${params}`);
      if (requestId !== loadRequestRef.current) return; // stale — abandon
      if (!res.ok) {
        if (replace) setLoading(false);
        setLoadingMore(false);
        return;
      }
      const json = await res.json();
      const rows: Comment[] = (json.comments ?? []).map((c: Comment) => ({
        ...c,
        like_count: typeof c.like_count === "number" ? c.like_count : 0,
        liked: !!c.liked,
      }));

      setComments((prev) => {
        if (replace) return rows;
        // Dedupe by id — an optimistically-inserted new comment might be re-fetched.
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...rows.filter((r) => !seen.has(r.id))];
      });
      setCursor(json.nextCursor ?? null);
      setHasMore(!!json.hasMore);
      if (replace) setLoading(false);
      setLoadingMore(false);
    },
    [postSlug]
  );

  // Initial load + reset on slug change.
  useEffect(() => {
    setLoading(true);
    setComments([]);
    setCursor(null);
    setHasMore(true);
    void loadPage(null, true);
  }, [loadPage]);

  // Infinite scroll: observe a sentinel element below the list.
  useEffect(() => {
    if (loading || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          void loadPage(cursor, false);
        }
      },
      { rootMargin: "400px 0px" } // start fetching before the sentinel is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, hasMore, loadingMore, cursor, loadPage]);

  async function toggleCommentLike(commentId: string) {
    const visitorId = getOrCreateBlogVisitorId();
    if (!visitorId || pendingLikeId === commentId) return;
    setPendingLikeId(commentId);
    const res = await fetch("/api/comments/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId, visitor_id: visitorId }),
    });
    if (res.ok) {
      const json = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, like_count: json.like_count ?? 0, liked: !!json.liked }
            : c
        )
      );
    }
    // On failure: leave the optimistic state alone rather than re-fetching the
    // whole list and resetting the infinite-scroll cursor. Next full load will
    // self-heal anyway.
    setPendingLikeId(null);
  }

  async function handleDelete(id: string) {
    const pw = localStorage.getItem(STORAGE_KEY);
    if (!pw) return;
    const res = await fetch(`/api/comments?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": pw },
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function submit() {
    if (submitting) return;
    setErrorMsg("");

    const nameTrim = name.trim();
    const bodyTrim = body.trim();
    const profanitySource = combinedCommentText({
      name: nameTrim || null,
      body: bodyTrim || null,
      reply_to_name: replyTarget?.name ?? null,
    });
    if (profanitySource.trim() && isProfane(profanitySource)) {
      setErrorMsg(PROFANITY_COMMENT_WARNING);
      return;
    }

    if (!bodyTrim && !selectedGif) return;

    setSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_slug: postSlug,
        name: nameTrim || null,
        body: bodyTrim,
        gif_url: selectedGif?.url ?? null,
        reply_to_id: replyTarget?.id ?? null,
        reply_to_name: replyTarget?.name ?? null,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      setComments((prev) => [...prev, json.comment]);
      if (replyTarget?.id) {
        setExpandedThreads((prev) => ({ ...prev, [replyTarget.id]: true }));
      }
      setBody("");
      setSelectedGif(null);
      setReplyTarget(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error ?? "Failed to post");
    }
    setSubmitting(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  const canSend = body.trim().length > 0 || !!selectedGif;
  const topLevelComments = comments.filter((comment) => !comment.reply_to_id);
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (!comment.reply_to_id) return acc;
    if (!acc[comment.reply_to_id]) {
      acc[comment.reply_to_id] = [];
    }
    acc[comment.reply_to_id].push(comment);
    return acc;
  }, {});

  function handleReply(comment: Comment) {
    const targetName = comment.name || FALLBACK_DISPLAY_NAME;
    const mention = `@${targetName} `;
    const trimmedBody = comment.body.trim();
    const preview = trimmedBody.length > 0 ? trimmedBody : (comment.gif_url ? "GIF attachment" : "Reply");
    setReplyTarget({ id: comment.id, name: targetName, preview });
    setBody((prev) => {
      if (prev.startsWith(mention)) return prev;
      return prev.trim().length > 0 ? `${mention}${prev}` : mention;
    });
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function renderComment(comment: Comment, isReply = false) {
    const replies = repliesByParent[comment.id] ?? [];
    const isThreadExpanded = !!expandedThreads[comment.id];
    // Tighter indents on mobile so long names + GIFs don't get squeezed.
    const guideIndentClass = isReply ? "ml-10 sm:ml-28" : "ml-6 sm:ml-14";

    return (
      <div key={comment.id}>
        <div
          className={`group flex gap-2 sm:gap-4 px-1 sm:px-4 py-2 rounded-md hover:bg-white/[0.03] transition-colors duration-100 relative ${isReply ? "ml-6 sm:ml-14" : ""}`}
          onMouseEnter={() => setHoveredId(comment.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="shrink-0 mt-0.5">
            <Avatar name={comment.name} commentId={comment.id} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header: on mobile, name and timestamp stack on two lines with
                Reply pinned to the right, and we add extra bottom space so
                the timestamp isn't glued to the comment body; on sm+ they
                all sit on one row with minimal margin. */}
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-0.5">
              <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <span className="text-[15px] font-semibold text-white leading-tight truncate">
                  {comment.name || FALLBACK_DISPLAY_NAME}
                </span>
                <span className="text-[11px] text-[#949ba4] leading-tight whitespace-nowrap">
                  {formatTime(comment.created_at)}
                </span>
              </div>
              <button
                onClick={() => handleReply(comment)}
                className="shrink-0 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[#949ba4] hover:text-[#84a7ff] hover:bg-[#84a7ff]/10 transition-colors"
                title="Reply"
              >
                <MessageCircleReply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
            {comment.reply_to_name && (
              <p className="mb-1 text-[11px] text-[#949ba4]">
                Replying to <span className="text-[#84a7ff] font-semibold">@{comment.reply_to_name}</span>
              </p>
            )}
            {comment.body && (
              <p className="text-[15px] text-[#dbdee1] leading-relaxed whitespace-pre-wrap break-words">
                {comment.body}
              </p>
            )}
            {comment.gif_url && (
              <div className="mt-2 rounded-lg overflow-hidden inline-block max-w-[300px]">
                <Image
                  src={comment.gif_url}
                  alt="GIF"
                  width={300}
                  height={200}
                  className="block w-full h-auto"
                  unoptimized
                />
              </div>
            )}
            <div className="mt-2.5 flex items-center">
              <button
                type="button"
                onClick={() => void toggleCommentLike(comment.id)}
                disabled={pendingLikeId === comment.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#3f4147] bg-[#1e1f22]/80 px-2.5 py-1.5 text-[11px] text-[#b5bac1] transition-colors hover:border-red-400/40 hover:bg-red-400/5 hover:text-red-200 disabled:opacity-50"
                title={comment.liked ? "Unlike" : "Like"}
                aria-pressed={comment.liked}
              >
                <Heart
                  className={`h-3.5 w-3.5 shrink-0 ${comment.liked ? "fill-red-400 text-red-400" : "text-[#949ba4]"}`}
                />
                <span className="tabular-nums font-medium">{comment.like_count}</span>
                <span className="text-[#6d6f78]">{comment.like_count === 1 ? "like" : "likes"}</span>
              </button>
            </div>
          </div>

          {hoveredId === comment.id && isAdmin && (
            <div className="absolute right-4 top-0 -translate-y-1/2 flex items-center gap-1 bg-[#2b2d31] border border-[#1e1f22] rounded-md shadow-xl px-1 py-1 z-10">
              <button
                onClick={() => setPendingDeleteId(comment.id)}
                className="p-1.5 rounded text-[#949ba4] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {replies.length > 0 && (
          <div className="mt-1">
            <div className={`${guideIndentClass} mb-1 flex items-center gap-2`}>
              <span className="h-px w-6 bg-[#3f4147]" />
              <button
                type="button"
                onClick={() =>
                  setExpandedThreads((prev) => ({
                    ...prev,
                    [comment.id]: !isThreadExpanded,
                  }))
                }
                className="inline-flex items-center gap-2 text-left text-[11px] font-medium text-[#84a7ff] hover:text-[#a9c0ff] transition-colors"
              >
                {isThreadExpanded ? (
                  <>
                    <span>Hide thread</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[#b5bac1]">
                      {replies.length} {replies.length === 1 ? "reply" : "replies"}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Show replies</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[#b5bac1]">
                      {replies.length}
                    </span>
                  </>
                )}
              </button>
            </div>

            {isThreadExpanded && (
              <div className={`${guideIndentClass} border-l border-[#3f4147] pl-4`}>
                {replies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mt-24 pt-12 border-t border-white/10">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#949ba4]">
          {loading ? "Comments" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </span>
        <div className="flex-1 h-px bg-[#3f4147]" />
      </div>

      {/* Comment list — Discord chat log style */}
      <div className="mb-4">
        {loading ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-[#949ba4]">Loading comments…</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#949ba4] text-sm">No messages yet.</p>
            <p className="text-[#6d6f78] text-xs mt-1">Be the first to say something!</p>
          </div>
        ) : (
          <>
            <div>{topLevelComments.map((comment) => renderComment(comment))}</div>
            {/* Sentinel — IntersectionObserver triggers the next page load here. */}
            <div ref={sentinelRef} className="h-px" aria-hidden />
            {loadingMore && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-[#6d6f78]">Loading more…</p>
              </div>
            )}
            {!hasMore && topLevelComments.length >= 10 && (
              <div className="px-4 py-6 text-center">
                <p className="text-[11px] uppercase tracking-wider text-[#6d6f78]">End of thread</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message input — Discord style */}
      <div className="px-1 sm:px-4 pb-4">
        {errorMsg && (
          <p className="text-xs text-red-400 mb-2 px-1">{errorMsg}</p>
        )}

        {/* GIF preview above name */}
        {selectedGif && (
          <div className="relative inline-block mb-3 ml-1">
            <Image
              src={selectedGif.url}
              alt={selectedGif.title}
              width={200}
              height={130}
              className="rounded-lg max-w-[200px] h-auto"
              unoptimized
            />
            <button
              type="button"
              onClick={() => setSelectedGif(null)}
              className="absolute -top-2 -right-2 bg-[#1e1f22] border border-[#3f4147] rounded-md p-0.5 text-[#949ba4] hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Name input — always visible. Uses 16px on mobile so iOS Safari
            doesn't auto-zoom when it receives focus. */}
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg px-2 sm:px-3 py-2 text-base sm:text-sm text-[#dbdee1] placeholder:text-[#6d6f78] focus:outline-none focus:border-[#5865f2] transition-colors mb-2"
        />

        {replyTarget && (
          <div className="mb-2 flex items-center justify-between gap-3 rounded-md border border-[#3f4147] bg-[#2b2d31] px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs text-[#b5bac1]">
                Replying to <span className="text-[#84a7ff] font-semibold">@{replyTarget.name}</span>
              </p>
              <p className="mt-0.5 max-w-full truncate text-[11px] text-[#949ba4]">
                {replyTarget.preview}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              className="rounded p-1 text-[#949ba4] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cancel reply"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Main input box */}
        <div className="flex items-end gap-0 bg-[#383a40] rounded-lg">
          {/* Textarea — 16px on mobile (Safari auto-zoom threshold),
              15px on desktop to match the rest of the comment typography. */}
          <textarea
            ref={textareaRef}
            placeholder={replyTarget ? `Reply to @${replyTarget.name}` : `Message as ${name || FALLBACK_DISPLAY_NAME}`}
            value={body}
            onChange={(e) => { setBody(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            rows={1}
            className="flex-1 bg-transparent text-base sm:text-[15px] text-[#dbdee1] placeholder:text-[#6d6f78] focus:outline-none resize-none py-2.5 pl-2 sm:pl-3 leading-relaxed overflow-hidden"
            style={{ maxHeight: "200px" }}
          />

          {/* Right toolbar */}
          <div className="shrink-0 flex h-full items-center gap-2 px-1.5 sm:px-3 py-2.5">
            {/* GIF button */}
            <div className="relative">
              <button
                ref={gifBtnRef}
                type="button"
                onClick={() => setShowGifPicker((v) => !v)}
                title="GIF"
                className="group p-1 rounded hover:bg-white/10 transition-colors"
              >
                <GifBadge active={showGifPicker || !!selectedGif} />
              </button>

              {showGifPicker && (
                <GifPicker
                  onSelect={(gif) => { setSelectedGif(gif); setShowGifPicker(false); textareaRef.current?.focus(); }}
                  onClose={() => setShowGifPicker(false)}
                />
              )}
            </div>

            {/* Send button — only visible when there's content */}
            {canSend && (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="ml-1 flex items-center justify-center w-7 h-7 rounded-md bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 transition-colors"
                title="Send"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                  <path d="M3.4 2.74c-.84-.44-1.82.28-1.63 1.21L3.5 12 1.78 20.06c-.2.93.79 1.65 1.63 1.2L22 12 3.4 2.74Z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-[10px] text-[#6d6f78] mt-1.5 px-1">
          Press <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(v) => !v && setPendingDeleteId(null)}
        title="Delete comment?"
        description="The comment and its likes will be permanently removed. This cannot be undone."
        confirmLabel="Delete comment"
        onConfirm={async () => {
          if (pendingDeleteId) await handleDelete(pendingDeleteId);
        }}
      />
    </section>
  );
}
