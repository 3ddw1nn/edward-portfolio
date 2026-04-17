"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import type { IGif } from "@giphy/js-types";

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!);

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type Tab = "GIFs" | "Stickers";

export function GifPicker({
  onSelect,
  onClose,
}: {
  onSelect: (gif: { url: string; title: string }) => void;
  onClose: () => void;
}) {
  const [tab, setTab]               = useState<Tab>("GIFs");
  const [query, setQuery]           = useState("");
  const [width, setWidth]           = useState(440);
  const [isMobile, setIsMobile]     = useState(false);
  // Visual-viewport metrics track the *visible* area on mobile (i.e. with the
  // soft keyboard subtracted). We use these to keep the sheet pinned above
  // the keyboard and sized to fit what the user can actually see.
  const [vv, setVv]                 = useState<{ h: number; bottomInset: number } | null>(null);
  const containerRef                = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const debouncedQuery              = useDebounce(query, 400);

  // Keep the Giphy Grid width in sync with the actual container size; this
  // matters because the container collapses from 460px → full-width on
  // mobile and can resize on orientation changes / keyboard toggles.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(Math.max(0, el.offsetWidth - 16));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // Track which breakpoint we're at so we can opt mobile-only styles in/out.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Follow the visual viewport on mobile so the sheet sits above the soft
  // keyboard instead of getting buried by it. On iOS `position: fixed` uses
  // the layout viewport (full screen), so we convert visualViewport metrics
  // into a bottom inset + a max-height that matches what's actually visible.
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const update = () => {
      const bottomInset = Math.max(
        0,
        window.innerHeight - (viewport.offsetTop + viewport.height)
      );
      setVv({ h: viewport.height, bottomInset });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close when tapping/clicking outside. Listen to `pointerdown` so this
  // works for both mouse and touch without the 300 ms delay of `click`.
  useEffect(() => {
    function handler(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [onClose]);

  // Close on Escape for keyboard users / iOS Bluetooth keyboards.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while the sheet is open on mobile so the background
  // doesn't drift behind the keyboard when the user types in the search.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSmall = window.matchMedia("(max-width: 639px)").matches;
    if (!isSmall) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const fetchGifs = (offset: number) => {
    const isSticker = tab === "Stickers";
    if (debouncedQuery.trim()) {
      return isSticker
        ? gf.search(debouncedQuery, { offset, limit: 20, rating: "g", type: "stickers" })
        : gf.search(debouncedQuery, { offset, limit: 20, rating: "g" });
    }
    return isSticker
      ? gf.trending({ offset, limit: 20, rating: "g", type: "stickers" })
      : gf.trending({ offset, limit: 20, rating: "g" });
  };

  function handleGifClick(gif: IGif, e: React.SyntheticEvent) {
    e.preventDefault();
    const url = gif.images.downsized?.url || gif.images.original?.url || "";
    onSelect({ url, title: gif.title });
    onClose();
  }

  return (
    <>
      {/* Mobile-only dim backdrop so the sheet reads as a modal and taps on it
          close the picker. Hidden on `sm+` where we keep the popover style. */}
      <div
        aria-hidden
        onClick={onClose}
        className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      <div
        ref={containerRef}
        className={[
          // ── Mobile: fixed full-width bottom sheet, safe from keyboard ──
          "fixed inset-x-2 flex flex-col",
          // Fallback bottom + height in case visualViewport isn't available.
          "bottom-[max(0.5rem,env(safe-area-inset-bottom))] max-h-[min(55vh,24rem)]",
          // ── Desktop (sm+): restore the original anchored dropdown ──
          "sm:absolute sm:inset-x-auto sm:bottom-full sm:right-0 sm:mb-2",
          "sm:w-[460px] sm:max-w-[calc(100vw-2rem)] sm:max-h-none",
          // ── Chrome ──
          "bg-[#2b2d31] border border-[#1e1f22] rounded-lg shadow-2xl z-50 overflow-hidden",
        ].join(" ")}
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          // Mobile only: lift the sheet above the soft keyboard and cap its
          // height to ~55% of the actually-visible viewport (capped at 22rem).
          ...(isMobile && vv
            ? {
                bottom: `calc(${vv.bottomInset}px + max(0.5rem, env(safe-area-inset-bottom)))`,
                maxHeight: `${Math.min(vv.h * 0.55, 352)}px`,
              }
            : {}),
        }}
        role="dialog"
        aria-modal="true"
        aria-label="GIF picker"
      >
        {/* Drag handle (mobile affordance only) */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-[#1e1f22] shrink-0">
          {(["GIFs", "Stickers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setQuery(""); }}
              className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
                tab === t
                  ? "text-white"
                  : "text-[#949ba4] hover:text-[#dbdee1]"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5865f2] rounded-t-sm" />
              )}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={onClose}
            aria-label="Close GIF picker"
            className="p-2 mr-1 text-[#949ba4] hover:text-white transition-colors rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2 bg-[#1e1f22] rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-[#949ba4] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${tab}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#dbdee1] placeholder:text-[#6d6f78] focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[#949ba4] hover:text-white transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid — flex-1 on mobile so it always fills the remaining sheet
            height and shrinks gracefully when the keyboard appears. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 giphy-grid sm:h-72 sm:flex-none">
          <Grid
            key={`${tab}-${debouncedQuery}`}
            fetchGifs={fetchGifs}
            width={width}
            columns={3}
            gutter={4}
            noResultsMessage={
              <p className="text-sm text-[#949ba4] text-center py-8">No results found.</p>
            }
            onGifClick={handleGifClick}
            hideAttribution
          />
        </div>

        {/* GIPHY branding (required) */}
        <div className="px-3 py-1.5 border-t border-[#1e1f22] flex justify-end shrink-0">
          <span className="text-[10px] text-[#4e5058] tracking-wide">Powered by GIPHY</span>
        </div>
      </div>
    </>
  );
}
