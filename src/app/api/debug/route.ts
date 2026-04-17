import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    // Keep this route Edge-compatible for Cloudflare Pages deployments.
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      runtime: "edge",
      checks: {
        adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD),
        supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        supabaseAnonKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
