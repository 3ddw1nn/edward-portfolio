"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const STORAGE_KEY = "admin_pw";

/** Opens /admin with ?edit=slug when a DB-backed post can be edited (same admin cookie as delete). */
export function EditPostButton({
  slug,
  canEditFromDb,
}: {
  slug: string;
  /** MDX file posts are edited in the repo, not via PATCH. */
  canEditFromDb: boolean;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!isAdmin || !canEditFromDb) return null;

  return (
    <button
      type="button"
      onClick={() => router.push(`/admin?edit=${encodeURIComponent(slug)}`)}
      className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-white transition-colors duration-200"
    >
      <Pencil className="h-3 w-3" />
      Edit post
    </button>
  );
}
