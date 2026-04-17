"use client";

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { MessageCircleReply, Trash2, X } from "lucide-react";
import Image from "next/image";
import { GifPicker } from "./GifPicker";

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
  const textareaRef                       = useRef<HTMLTextAreaElement>(null);
  const gifBtnRef                         = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`);
    if (res.ok) {
      const json = await res.json();
      setComments(json.comments ?? []);
    }
    setLoading(false);
  }, [postSlug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

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
    if (submitting || (!body.trim() && !selectedGif)) return;
    setSubmitting(true);
    setErrorMsg("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_slug: postSlug,
        name: name.trim() || null,
        body: body.trim(),
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
    const guideIndentClass = isReply ? "ml-28" : "ml-14";

    return (
      <div key={comment.id}>
        <div
          className={`group flex gap-4 px-4 py-2 rounded-md hover:bg-white/[0.03] transition-colors duration-100 relative ${isReply ? "ml-14" : ""}`}
          onMouseEnter={() => setHoveredId(comment.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="shrink-0 mt-0.5">
            <Avatar name={comment.name} commentId={comment.id} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[15px] font-semibold text-white leading-none">
                {comment.name || FALLBACK_DISPLAY_NAME}
              </span>
              <span className="text-[11px] text-[#949ba4]">
                {formatTime(comment.created_at)}
              </span>
              <button
                onClick={() => handleReply(comment)}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[#949ba4] hover:text-[#84a7ff] hover:bg-[#84a7ff]/10 transition-colors"
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
          </div>

          {hoveredId === comment.id && isAdmin && (
            <div className="absolute right-4 top-0 -translate-y-1/2 flex items-center gap-1 bg-[#2b2d31] border border-[#1e1f22] rounded-md shadow-xl px-1 py-1 z-10">
              <button
                onClick={() => handleDelete(comment.id)}
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
                className="text-[11px] font-medium text-[#84a7ff] hover:text-[#a9c0ff] transition-colors"
              >
                {isThreadExpanded
                  ? `Hide replies (${replies.length})`
                  : `Show replies (${replies.length})`}
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
          <div className="space-y-5 px-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-white/10 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#949ba4] text-sm">No messages yet.</p>
            <p className="text-[#6d6f78] text-xs mt-1">Be the first to say something!</p>
          </div>
        ) : (
          <div>{topLevelComments.map((comment) => renderComment(comment))}</div>
        )}
      </div>

      {/* Message input — Discord style */}
      <div className="px-4 pb-4">
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

        {/* Name input — always visible */}
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg px-3 py-2 text-sm text-[#dbdee1] placeholder:text-[#6d6f78] focus:outline-none focus:border-[#5865f2] transition-colors mb-2"
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
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            placeholder={replyTarget ? `Reply to @${replyTarget.name}` : `Message as ${name || FALLBACK_DISPLAY_NAME}`}
            value={body}
            onChange={(e) => { setBody(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            rows={1}
            className="flex-1 bg-transparent text-[15px] text-[#dbdee1] placeholder:text-[#6d6f78] focus:outline-none resize-none py-2.5 pl-3 leading-relaxed overflow-hidden"
            style={{ maxHeight: "200px" }}
          />

          {/* Right toolbar */}
          <div className="shrink-0 flex h-full items-center gap-2 px-3 py-2.5">
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
    </section>
  );
}
