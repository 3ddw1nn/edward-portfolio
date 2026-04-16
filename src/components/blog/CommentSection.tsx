"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, MessageCircle, Send } from "lucide-react";

const STORAGE_KEY = "admin_pw";

type Comment = {
  id: string;
  name: string | null;
  body: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Avatar({ name }: { name: string | null }) {
  const letter = (name || "A")[0].toUpperCase();
  const colors = [
    "bg-rose-500", "bg-orange-500", "bg-amber-500",
    "bg-emerald-500", "bg-cyan-500", "bg-violet-500", "bg-pink-500",
  ];
  const color = colors[letter.charCodeAt(0) % colors.length];
  return (
    <div className={`shrink-0 w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white`}>
      {letter}
    </div>
  );
}

export function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments]         = useState<Comment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [name, setName]                 = useState("");
  const [body, setBody]                 = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]         = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setErrorMsg("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_slug: postSlug, name: name.trim() || null, body: body.trim() }),
    });

    if (res.ok) {
      const json = await res.json();
      setComments((prev) => [...prev, json.comment]);
      setBody(""); setName("");
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error ?? "Failed to post comment");
      setSubmitStatus("error");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-24 pt-16 border-t border-white/10">

      {/* Section header */}
      <div className="flex items-center gap-3 mb-10">
        <MessageCircle className="h-5 w-5 text-white/60" />
        <h2 className="text-lg font-semibold text-white">
          {loading ? "Comments" : comments.length === 0 ? "Comments" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </h2>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4 mb-12">
          {[1,2].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="mb-12 py-10 rounded-2xl border border-white/10 text-center">
          <p className="text-white/50 text-sm">No comments yet.</p>
          <p className="text-white/30 text-xs mt-1">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors duration-200">
              <Avatar name={c.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white">
                      {c.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-white/25 hover:text-red-400 transition-colors duration-200"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6">
        <h3 className="text-sm font-semibold text-white mb-5">Leave a reply</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all duration-200"
          />
          <textarea
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={2000}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all duration-200 resize-none"
          />

          <div className="flex items-center justify-between gap-4">
            <div>
              {submitStatus === "success" && (
                <p className="text-xs text-emerald-400">Comment posted!</p>
              )}
              {submitStatus === "error" && (
                <p className="text-xs text-red-400">{errorMsg}</p>
              )}
              {body.length > 1800 && (
                <p className="text-xs text-white/40">{2000 - body.length} characters left</p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Posting..." : "Post reply"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
