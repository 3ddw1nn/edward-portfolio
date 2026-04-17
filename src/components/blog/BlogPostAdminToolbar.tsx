"use client";

import { useEffect, useState } from "react";
import { EditPostButton } from "./EditPostButton";
import { DeletePostButton } from "./DeletePostButton";

const STORAGE_KEY = "admin_pw";

/** Clustered admin controls shown at the top of a post page when logged in. */
export function BlogPostAdminToolbar({ slug }: { slug: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sync = () => setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-white/20 bg-zinc-900/85 px-3 py-2 shadow-lg backdrop-blur-sm">
      <EditPostButton slug={slug} assumeAdmin />
      <DeletePostButton slug={slug} assumeAdmin />
    </div>
  );
}
