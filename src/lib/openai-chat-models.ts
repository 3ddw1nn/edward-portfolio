/** Allowed Chat Completions models for admin AI (server + client picker).
 *
 * Pricing is approximate USD per 1M tokens (input/output) from OpenAI’s published
 * Chat Completions rates. Treat it as a *ballpark*; always confirm on
 * https://openai.com/api/pricing before budgeting real usage.
 */
export type OpenAiChatModel = {
  id: string;
  label: string;
  /** Coarse relative cost: 1=cheapest, 5=most expensive */
  tier: 1 | 2 | 3 | 4 | 5;
  /** Approximate $/1M input tokens */
  inputPerM: number;
  /** Approximate $/1M output tokens */
  outputPerM: number;
  /** Short hint shown next to the model in the UI */
  note?: string;
};

export const OPENAI_CHAT_MODELS: OpenAiChatModel[] = [
  { id: "gpt-4o-mini",  label: "GPT-4o mini",  tier: 1, inputPerM: 0.15, outputPerM: 0.6,  note: "Fastest, cheapest" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini", tier: 2, inputPerM: 0.4,  outputPerM: 1.6,  note: "Balanced" },
  { id: "o3-mini",      label: "o3-mini",      tier: 3, inputPerM: 1.1,  outputPerM: 4.4,  note: "Reasoning, cheap" },
  { id: "o4-mini",      label: "o4-mini",      tier: 3, inputPerM: 1.1,  outputPerM: 4.4,  note: "Reasoning, newer" },
  { id: "gpt-4.1",      label: "GPT-4.1",      tier: 4, inputPerM: 2.0,  outputPerM: 8.0,  note: "Stronger writing" },
  { id: "gpt-4o",       label: "GPT-4o",       tier: 4, inputPerM: 2.5,  outputPerM: 10.0, note: "Flagship" },
  { id: "gpt-4-turbo",  label: "GPT-4 Turbo",  tier: 5, inputPerM: 10.0, outputPerM: 30.0, note: "Expensive, legacy" },
];

export const OPENAI_CHAT_MODEL_IDS = OPENAI_CHAT_MODELS.map((m) => m.id);

export const DEFAULT_OPENAI_CHAT_MODEL = "gpt-4o-mini";

export function resolveOpenAiChatModel(requested: unknown): string {
  const envRaw = typeof process !== "undefined" ? process.env.OPENAI_MODEL?.trim() : "";
  const envDefault =
    envRaw && OPENAI_CHAT_MODEL_IDS.includes(envRaw) ? envRaw : DEFAULT_OPENAI_CHAT_MODEL;

  if (typeof requested !== "string" || !requested.trim()) {
    return envDefault;
  }
  const id = requested.trim();
  return OPENAI_CHAT_MODEL_IDS.includes(id) ? id : envDefault;
}

export function formatTier(tier: 1 | 2 | 3 | 4 | 5): string {
  return "$".repeat(tier);
}

/** Compact human label: "$·$0.15/$0.60 per 1M" */
export function formatPricingShort(model: OpenAiChatModel): string {
  return `${formatTier(model.tier)} · $${model.inputPerM.toFixed(2)}/$${model.outputPerM.toFixed(2)} per 1M`;
}

/** Rough typical-blog-post cost estimate (≈ 1k input tokens + 4k output tokens). */
export function estimatePostCostUsd(model: OpenAiChatModel): number {
  const INPUT_TOKENS = 1_000;
  const OUTPUT_TOKENS = 4_000;
  return (
    (INPUT_TOKENS / 1_000_000) * model.inputPerM +
    (OUTPUT_TOKENS / 1_000_000) * model.outputPerM
  );
}

/** Format a small USD amount: sub-penny as "<$0.01", else dollars with 2 decimals. */
export function formatUsd(n: number): string {
  if (n < 0.01) return "<$0.01";
  if (n < 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}
