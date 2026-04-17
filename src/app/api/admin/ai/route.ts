import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Action = "autofillEmpty" | "improveContent" | "fromPrompt";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/** Remove markdown images / HTML img so AI never injects image URLs */
function stripImageMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)\s]+\)/g, "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseJsonFromAssistant(content: string): Record<string, unknown> {
  const trimmed = content.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(trimmed);
  const raw = (fence ? fence[1] : trimmed).trim();
  return JSON.parse(raw) as Record<string, unknown>;
}

async function openaiChatJson(system: string, user: string): Promise<Record<string, unknown>> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.includes("mock")) {
    throw new Error("OPENAI_API_KEY is not set (add a real key in .env.local; see .env.example)");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (!res.ok) {
    throw new Error(json.error?.message ?? `OpenAI error ${res.status}`);
  }

  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");
  return parseJsonFromAssistant(text);
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    action?: Action;
    /** Current form snapshot (autofill / fromPrompt context) */
    context?: Record<string, unknown>;
    /** Keys the model may return for autofillEmpty */
    fillKeys?: string[];
    content?: string;
    prompt?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action;
  if (!action || !["autofillEmpty", "improveContent", "fromPrompt"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    if (action === "improveContent") {
      const raw = typeof body.content === "string" ? body.content : "";
      if (!raw.trim()) {
        return NextResponse.json({ error: "content is required" }, { status: 400 });
      }

      const system = `You improve blog post body copy in Markdown.
Rules: keep headings and structure sensible; fix clarity and flow; do NOT add images, image markdown (![]()), or bare image URLs. Return JSON: {"content":"<markdown>"}.`;

      const out = await openaiChatJson(
        system,
        `Improve this markdown (no images):\n\n${raw.slice(0, 120_000)}`
      );
      const content = typeof out.content === "string" ? stripImageMarkdown(out.content) : "";
      if (!content) throw new Error("Model returned no content");
      return NextResponse.json({ content });
    }

    if (action === "autofillEmpty") {
      const ctx = body.context ?? {};
      const fillKeys = Array.isArray(body.fillKeys) ? body.fillKeys.filter((k) => typeof k === "string") : [];
      if (fillKeys.length === 0) {
        return NextResponse.json({ error: "fillKeys must list empty fields to fill" }, { status: 400 });
      }

      const system = `You help fill metadata for a technical blog post. Never include image markdown or URLs.
Return a single JSON object with ONLY these keys (omit keys you cannot infer): ${fillKeys.join(", ")}.
Use types: title string, slug string (lowercase kebab-case), excerpt string (1-2 sentences), tags string[] (2-6 short tags), read_time string like "6 min read", date string YYYY-MM-DD.
Do NOT return a "content" key.`;

      const user = `Fill only the listed empty fields. Context (may include partial content for tone — do not echo it back):\n${JSON.stringify(ctx, null, 2)}`;

      const out = await openaiChatJson(system, user);
      const cleaned: Record<string, unknown> = {};
      for (const k of fillKeys) {
        if (k in out && k !== "content") cleaned[k] = out[k];
      }
      return NextResponse.json({ fields: cleaned });
    }

    if (action === "fromPrompt") {
      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      if (!prompt) {
        return NextResponse.json({ error: "prompt is required" }, { status: 400 });
      }

      const system = `You draft a full blog post from the user's idea. Output JSON with keys:
title, slug (kebab-case), excerpt (1-2 sentences), tags (array of 2-6 strings), read_time (e.g. "7 min read"), date (YYYY-MM-DD), content (markdown body).
Rules: content must be substantive markdown with headings where helpful; NEVER include images, ![alt](url), or bare image URLs — the author uploads images separately.`;

      const out = await openaiChatJson(system, `Idea / instructions:\n${prompt.slice(0, 20_000)}`);

      const content =
        typeof out.content === "string" ? stripImageMarkdown(out.content) : "";
      const tags = Array.isArray(out.tags) ? out.tags.filter((t) => typeof t === "string") : [];

      return NextResponse.json({
        title: typeof out.title === "string" ? out.title : "",
        slug: typeof out.slug === "string" ? out.slug : "",
        excerpt: typeof out.excerpt === "string" ? out.excerpt : "",
        tags,
        read_time: typeof out.read_time === "string" ? out.read_time : "5 min read",
        date: typeof out.date === "string" ? out.date : new Date().toISOString().slice(0, 10),
        content,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
