/** Allowed Chat Completions models for admin AI (server + client picker). */
export const OPENAI_CHAT_MODELS: { id: string; label: string }[] = [
  { id: "gpt-4o-mini", label: "GPT-4o mini" },
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini" },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { id: "o4-mini", label: "o4-mini" },
  { id: "o3-mini", label: "o3-mini" },
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
