/**
 * Lightweight comment profanity check (Edge-safe, no extra deps).
 * Whole-word style matching on a normalized string.
 */

/** Shown when a comment (name/body/reply) fails the filter — server and client use the same copy. */
export const PROFANITY_COMMENT_WARNING =
  "Don't be a fucking cunt. I use this to get jobs asshole. Thanks";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lowercase alphanumerics; common leetspeak substitutions for matching. */
function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

// Stems / words to block (English; extend as needed).
const BLOCKED = [
  "fuck",
  "fucker",
  "fucking",
  "fucked",
  "fucks",
  "shit",
  "shits",
  "shitting",
  "shitty",
  "bitch",
  "bitches",
  "bitchy",
  "asshole",
  "bastard",
  "dick",
  "dicks",
  "cock",
  "cocks",
  "cunt",
  "cunts",
  "pussy",
  "pussies",
  "slut",
  "sluts",
  "whore",
  "whores",
  "nigger",
  "nigga",
  "retard",
  "retarded",
  "fag",
  "faggot",
  "rape",
  "rapist",
  "spic",
  "chink",
  "kike",
  "twat",
  "wank",
  "wanker",
  "bollocks",
  "piss",
  "pissed",
  "crap",
  "damn",
  "goddamn",
  "hell",
  "douche",
  "douchebag",
  "motherfucker",
  "bullshit",
  "jackass",
  "prick",
  "dumbass",
  "dipshit",
  "shithead",
  "dickhead",
  "cum",
  "jizz",
  "blowjob",
  "handjob",
  "ballsack",
  "nutsack",
  "testicle",
  "scrotum",
];

const PATTERN = new RegExp(
  `\\b(?:${BLOCKED.map(escapeRegex).join("|")})\\b`,
  "i"
);

export function isProfane(text: string): boolean {
  if (!text.trim()) return false;
  const normalized = normalizeForMatch(text);
  return PATTERN.test(normalized);
}

export function combinedCommentText(parts: {
  name?: string | null;
  body?: string | null;
  reply_to_name?: string | null;
}): string {
  return [parts.name, parts.body, parts.reply_to_name]
    .map((s) => (typeof s === "string" ? s : ""))
    .join(" ");
}
