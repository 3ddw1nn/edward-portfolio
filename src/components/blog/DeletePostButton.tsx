"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STORAGE_KEY = "admin_pw";

export function DeletePostButton({
  slug,
  assumeAdmin = false,
}: {
  slug: string;
  assumeAdmin?: boolean;
}) {
  const [isAdmin, setIsAdmin] = useState(assumeAdmin);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (assumeAdmin) return;
    setIsAdmin(!!localStorage.getItem(STORAGE_KEY));
  }, [assumeAdmin]);

  if (!isAdmin) return null;

  async function confirmDelete() {
    const pw = localStorage.getItem(STORAGE_KEY);
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-password": pw ?? "" },
    });
    if (res.ok) router.push("/blog");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-zinc-400 transition-colors duration-200 hover:text-red-400"
      >
        <Trash2 className="h-3 w-3" />
        Delete post
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete post?"
        description={
          <>
            This will permanently remove{" "}
            <span className="font-mono text-white">{slug}</span> from the database
            along with its comments and likes. This cannot be undone.
          </>
        }
        confirmLabel="Delete post"
        onConfirm={confirmDelete}
      />
    </>
  );
}
