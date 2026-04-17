"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const STORAGE_KEY = "admin_pw";

/** Opens /admin with ?edit=slug for logged-in admins. */
export function EditPostButton({
  slug,
  /** Parent already verified admin (e.g. BlogPostAdminToolbar). */
  assumeAdmin = false,
}: {
  slug: string;
  assumeAdmin?: boolean;
}) {
  const [isAdmin, setIsAdmin] = useState(assumeAdmin);
  const router = useRouter();

  useEffect(() => {
    if (assumeAdmin) return;
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, [assumeAdmin]);

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => router.push(`/admin?edit=${encodeURIComponent(slug)}`)}
      className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-zinc-300 hover:text-white transition-colors duration-200"
    >
      <Pencil className="h-3 w-3" />
      Edit post
    </button>
  );
}
