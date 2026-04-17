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
  const containerRef                = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const debouncedQuery              = useDebounce(query, 400);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth - 16);
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

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
    <div
      ref={containerRef}
      className="absolute bottom-full right-0 mb-2 w-[460px] max-w-[calc(100vw-2rem)] bg-[#2b2d31] border border-[#1e1f22] rounded-lg shadow-2xl z-50 overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
    >
      {/* Tabs */}
      <div className="flex items-center border-b border-[#1e1f22]">
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
          className="p-2 mr-1 text-[#949ba4] hover:text-white transition-colors rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
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

      {/* Grid */}
      <div className="h-72 overflow-y-auto px-3 pb-3 giphy-grid">
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
      <div className="px-3 py-1.5 border-t border-[#1e1f22] flex justify-end">
        <span className="text-[10px] text-[#4e5058] tracking-wide">Powered by GIPHY</span>
      </div>
    </div>
  );
}
