"use client";

import dynamicImport from "next/dynamic";

// @giphy/js-util references Node.js `global`, which isn't defined in the edge
// runtime. Loading CommentSection only on the client avoids the SSR crash.
const CommentSection = dynamicImport(
  () => import("./CommentSection").then((m) => ({ default: m.CommentSection })),
  { ssr: false }
);

export function CommentSectionLoader({ postSlug }: { postSlug: string }) {
  return <CommentSection postSlug={postSlug} />;
}
