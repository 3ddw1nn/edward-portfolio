"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const STORAGE_KEY = "admin_pw";

export function DeletePostButton({
  slug,
  canDeleteFromDb = true,
}: {
  slug: string;
  /** File-backed MDX posts cannot be removed from the database UI; delete the .mdx file instead. */
  canDeleteFromDb?: boolean;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!isAdmin || !canDeleteFromDb) return null;

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    const pw = localStorage.getItem(STORAGE_KEY);
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-password": pw ?? "" },
    });

    if (res.ok) {
      router.push("/blog");
    }
  }

  return (
    <button
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      className={`inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 ${
        confirming
          ? "text-red-400 hover:text-red-300"
          : "text-white/25 hover:text-red-400"
      }`}
    >
      <Trash2 className="h-3 w-3" />
      {confirming ? "Confirm delete" : "Delete post"}
    </button>
  );
}
