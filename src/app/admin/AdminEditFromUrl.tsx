"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  authed: boolean;
  loadPostForEdit: (slug: string) => Promise<boolean>;
};

/**
 * When visiting /admin?edit=slug (e.g. from the blog “Edit post” button), load that post into the editor.
 */
export function AdminEditFromUrl({ authed, loadPostForEdit }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadRef = useRef(loadPostForEdit);
  loadRef.current = loadPostForEdit;

  useEffect(() => {
    if (!authed) return;
    const slug = searchParams.get("edit");
    if (!slug) return;

    let cancelled = false;
    (async () => {
      const ok = await loadRef.current(slug);
      if (!cancelled && ok) {
        router.replace("/admin", { scroll: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authed, searchParams, router]);

  return null;
}
