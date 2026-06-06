import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

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

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = coercePage(req.nextUrl.searchParams.get("page"));
  const limit = coerceLimit(req.nextUrl.searchParams.get("limit"));
  const offset = (page - 1) * limit;

  try {
    const rows = await sql`
      SELECT id, post_slug, name, body, gif_url, reply_to_id, reply_to_name, created_at,
             COUNT(*) OVER() AS total_count
      FROM comments
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      comments: rows.map(({ total_count, ...c }) => c),
      page,
      limit,
      total,
      pageCount,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
