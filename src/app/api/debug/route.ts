import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      runtime: "edge",
      checks: {
        adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD),
        databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
        blobTokenConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
