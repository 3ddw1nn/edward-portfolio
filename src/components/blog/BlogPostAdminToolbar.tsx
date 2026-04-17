"use client";

import { useEffect, useState } from "react";
import { EditPostButton } from "./EditPostButton";
import { DeletePostButton } from "./DeletePostButton";

const STORAGE_KEY = "admin_pw";

/**
 * Clustered admin controls on the post page. Comment deletes use a visible chip;
 * post edit/delete used to be text-white/25 and were effectively invisible on the hero.
 */
export function BlogPostAdminToolbar({
  slug,
  source,
}: {
  slug: string;
  source: "mdx" | "supabase";
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sync = () => setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (!isAdmin) return null;

  if (source === "mdx") {
    return (
      <div className="max-w-[min(100%,26rem)] rounded-md border border-white/20 bg-zinc-900/85 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="font-brutal text-[8px] uppercase tracking-[0.2em] text-zinc-400">Admin</p>
        <p className="mt-1.5 font-sans text-[11px] leading-snug text-zinc-300">
          This URL still reads the <span className="text-zinc-100">.mdx file first</span>, even if the same slug
          exists in Supabase. Run <code className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-zinc-100">pnpm seed:posts</code> to upsert your MDX into the database (for backups / admin list). To use{" "}
          <span className="text-zinc-100">Edit post</span> here, remove or rename{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-zinc-100">src/content/blog/{slug}.mdx</code>{" "}
          after seeding so only the database copy is left.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-white/20 bg-zinc-900/85 px-3 py-2 shadow-lg backdrop-blur-sm">
      <EditPostButton slug={slug} canEditFromDb assumeAdmin />
      <DeletePostButton slug={slug} canDeleteFromDb assumeAdmin />
    </div>
  );
}
