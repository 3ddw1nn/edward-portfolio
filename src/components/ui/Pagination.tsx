"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BaseProps = {
  page: number;
  pageCount: number;
  /** How many numeric pages to surround the current one. Default 1 -> "prev 1 … 4 5 6 … 10 next" */
  siblingCount?: number;
  className?: string;
};

type ControlledProps = BaseProps & {
  mode: "button";
  onPageChange: (page: number) => void;
};

type LinkedProps = BaseProps & {
  mode: "link";
  /** Build a href for a given page number (e.g. (p) => `?page=${p}`). */
  buildHref: (page: number) => string;
};

export type PaginationProps = ControlledProps | LinkedProps;

/** Build the list of page tokens to display, inserting "ellipsis" where gaps exist. */
function buildPages(page: number, pageCount: number, siblingCount: number): (number | "ellipsis")[] {
  const total = pageCount;
  if (total <= 1) return [];

  const first = 1;
  const last = total;
  const start = Math.max(first + 1, page - siblingCount);
  const end = Math.min(last - 1, page + siblingCount);

  const pages: (number | "ellipsis")[] = [first];
  if (start > first + 1) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < last - 1) pages.push("ellipsis");
  if (last > first) pages.push(last);
  return pages;
}

const baseBtn =
  "inline-flex min-w-[36px] h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition";
const inactive = "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/30";
const active = "border-white bg-white text-black cursor-default";
const disabled = "border-white/10 bg-white/[0.02] text-white/40 cursor-not-allowed pointer-events-none";

export function Pagination(props: PaginationProps) {
  const { page, pageCount, siblingCount = 1, className } = props;
  if (pageCount <= 1) return null;

  const pages = buildPages(page, pageCount, siblingCount);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;

  const renderItem = (p: number | "ellipsis", i: number) => {
    if (p === "ellipsis") {
      return (
        <span
          key={`e-${i}`}
          aria-hidden
          className="inline-flex h-9 min-w-[24px] items-center justify-center text-sm text-white/50"
        >
          …
        </span>
      );
    }
    const isActive = p === page;
    if (props.mode === "link") {
      return isActive ? (
        <span key={p} aria-current="page" className={`${baseBtn} ${active}`}>
          {p}
        </span>
      ) : (
        <Link key={p} href={props.buildHref(p)} className={`${baseBtn} ${inactive}`}>
          {p}
        </Link>
      );
    }
    return (
      <button
        key={p}
        type="button"
        onClick={() => !isActive && props.onPageChange(p)}
        aria-current={isActive ? "page" : undefined}
        className={`${baseBtn} ${isActive ? active : inactive}`}
      >
        {p}
      </button>
    );
  };

  const prev = page - 1;
  const next = page + 1;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`mt-8 flex flex-wrap items-center justify-center gap-2 ${className ?? ""}`}
    >
      {props.mode === "link" ? (
        prevDisabled ? (
          <span className={`${baseBtn} ${disabled}`} aria-disabled>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            <span className="ml-1 hidden sm:inline">Prev</span>
          </span>
        ) : (
          <Link href={props.buildHref(prev)} className={`${baseBtn} ${inactive}`}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            <span className="ml-1 hidden sm:inline">Prev</span>
          </Link>
        )
      ) : (
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => !prevDisabled && props.onPageChange(prev)}
          className={`${baseBtn} ${prevDisabled ? disabled : inactive}`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="ml-1 hidden sm:inline">Prev</span>
        </button>
      )}

      {pages.map(renderItem)}

      {props.mode === "link" ? (
        nextDisabled ? (
          <span className={`${baseBtn} ${disabled}`} aria-disabled>
            <span className="mr-1 hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        ) : (
          <Link href={props.buildHref(next)} className={`${baseBtn} ${inactive}`}>
            <span className="mr-1 hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )
      ) : (
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => !nextDisabled && props.onPageChange(next)}
          className={`${baseBtn} ${nextDisabled ? disabled : inactive}`}
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </nav>
  );
}
