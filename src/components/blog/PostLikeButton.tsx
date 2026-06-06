"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getOrCreateBlogVisitorId } from "@/lib/blogVisitor";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialLikeCount: number;
  /** `hero` = end-of-article CTA (slightly emphasized, left-aligned); `inline` = compact (default). */
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
          ? " The post_likes table may not exist yet — run neon/schema.sql against your database."
          : "";
      setError(`${raw}${hint}`);
    }
    setPending(false);
  }

  const hero = size === "hero";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        hero ? "w-full items-start text-left" : "inline-flex items-start gap-1"
      )}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={loading || pending}
        className={cn(
          "inline-flex items-center font-brutal uppercase tracking-wide transition-colors disabled:opacity-50",
          hero
            ? "gap-2.5 rounded-md border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-[11px] tracking-[0.12em] text-white/50 hover:border-white/16 hover:bg-white/[0.04] hover:text-white/70"
            : "gap-2 rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-white/70 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        )}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
      >
        <Heart
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            liked ? "fill-red-400 text-red-400" : hero ? "text-white/40" : "text-white/50"
          )}
        />
        <span className={hero ? "text-white/45" : "text-[10px] text-white/45"}>
          {loading ? "…" : `${likeCount} like${likeCount === 1 ? "" : "s"}`}
        </span>
      </button>
      {error ? (
        <p
          className={cn(
            "text-[10px] leading-snug text-red-400/90",
            hero ? "max-w-lg" : "max-w-xs"
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
