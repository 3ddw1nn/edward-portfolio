"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getOrCreateBlogVisitorId } from "@/lib/blogVisitor";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialLikeCount: number;
  /** `hero` = large CTA (e.g. end of article); `inline` = compact (default). */
  size?: "inline" | "hero";
};

export function PostLikeButton({ slug, initialLikeCount, size = "inline" }: Props) {
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

  const hero = size === "hero";

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        hero ? "w-full max-w-md items-center text-center" : "inline-flex items-start gap-1"
      )}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={loading || pending}
        className={cn(
          "inline-flex items-center justify-center font-brutal uppercase tracking-wide transition-colors disabled:opacity-50",
          hero
            ? "gap-3 rounded-xl border-2 border-white/20 bg-white/[0.06] px-10 py-5 text-sm text-white/80 hover:border-white/35 hover:bg-white/[0.1] hover:text-white md:px-12 md:py-6 md:text-base"
            : "gap-2 rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-white/70 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        )}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
      >
        <Heart
          className={cn(
            "shrink-0 transition-colors",
            hero ? "h-7 w-7 md:h-8 md:w-8" : "h-4 w-4",
            liked ? "fill-red-400 text-red-400" : "text-white/50"
          )}
        />
        <span className={hero ? "text-white/70" : "text-[10px] text-white/45"}>
          {loading ? "…" : `${likeCount} like${likeCount === 1 ? "" : "s"}`}
        </span>
      </button>
      {error ? (
        <p
          className={cn(
            "text-[10px] leading-snug text-red-400/90",
            hero ? "max-w-md px-2" : "max-w-xs"
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
