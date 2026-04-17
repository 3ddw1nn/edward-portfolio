import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function coerceLimit(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(n)));
}

function coercePage(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.max(1, Math.floor(n));
}

/** GET /api/admin/comments?page=1&limit=10 — newest first, offset paginated. */
export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = coercePage(req.nextUrl.searchParams.get("page"));
  const limit = coerceLimit(req.nextUrl.searchParams.get("limit"));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const admin = createAdminClient();
  const { data, error, count } = await admin
    .from("comments")
    .select("id, post_slug, name, body, gif_url, reply_to_id, reply_to_name, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return NextResponse.json({
    comments: data ?? [],
    page,
    limit,
    total,
    pageCount,
  });
}
