"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getOrCreateBlogVisitorId } from "@/lib/blogVisitor";

type Props = {
  slug: string;
  initialLikeCount: number;
};

export function PostLikeButton({ slug, initialLikeCount }: Props) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const sync = useCallback(async () => {
    const visitorId = getOrCreateBlogVisitorId();
    if (!visitorId) {
      setLoading(false);
      return;
    }
    const res = await fetch(
      `/api/engagement?slugs=${encodeURIComponent(slug)}&visitor_id=${encodeURIComponent(visitorId)}`
    );
    if (res.ok) {
      const json = await res.json();
      const row = json.stats?.[slug];
      if (row) {
        setLikeCount(row.likeCount);
        setLiked(row.liked);
      }
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    sync();
  }, [sync]);

  async function toggle() {
    const visitorId = getOrCreateBlogVisitorId();
    if (!visitorId || pending) return;
    setPending(true);
    setError("");
    const res = await fetch("/api/engagement/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, visitor_id: visitorId }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setLikeCount(json.likeCount ?? 0);
      setLiked(!!json.liked);
    } else {
      const raw = typeof json.error === "string" ? json.error : "Could not save like";
      const hint =
        /post_likes|schema cache/i.test(raw)
          ? " Run supabase/post_likes.sql in the Supabase SQL editor, then try again."
          : "";
      setError(`${raw}${hint}`);
    }
    setPending(false);
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={loading || pending}
        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
      >
        <Heart
          className={`h-4 w-4 shrink-0 transition-colors ${liked ? "fill-red-400 text-red-400" : "text-white/50"}`}
        />
        <span className="font-brutal tracking-wide uppercase text-[10px] text-white/45">
          {loading ? "…" : `${likeCount} like${likeCount === 1 ? "" : "s"}`}
        </span>
      </button>
      {error ? (
        <p className="max-w-xs text-[10px] leading-snug text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
