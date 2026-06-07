import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export const runtime = "edge";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]);

function extForType(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/gif") return "gif";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  return "bin";
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Unsupported type. Use JPEG, PNG, GIF, WebP, or SVG." },
      { status: 400 }
    );
  }

  const buf = await file.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = extForType(type);
  const safeBase = (file.name || "image")
    .replace(/\.[^/.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
    .slice(0, 80);
  const objectKey = `${crypto.randomUUID()}-${safeBase}.${ext}`;

  const accountId = process.env.R2_ACCOUNT_ID!;
  const bucket = process.env.R2_BUCKET_NAME!;
  const publicUrl = process.env.R2_PUBLIC_URL!;

  const r2 = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });

  try {
    const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${objectKey}`;
    const res = await r2.fetch(uploadUrl, {
      method: "PUT",
      body: buf,
      headers: {
        "Content-Type": type,
        "Content-Length": buf.byteLength.toString(),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Upload failed: ${text}` }, { status: 500 });
    }

    return NextResponse.json({ url: `${publicUrl}/${objectKey}`, path: objectKey });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
