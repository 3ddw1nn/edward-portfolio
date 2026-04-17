/**
 * Lightweight comment profanity check (Edge-safe, no extra deps).
 * Whole-word style matching on a normalized string, plus blocked phrases.
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

/** Collapse punctuation/spaces for phrase matching. */
function collapseForPhrases(s: string): string {
  return normalizeForMatch(s)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Single-token slurs / insults (profanity, sexual, ableist, anti-LGBTQ+, racial/ethnic, etc.).
const BLOCKED = [
  // Profanity / sexual
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
  // Ableist / anti-LGBTQ+
  "retard",
  "retarded",
  "fag",
  "faggot",
  "dyke",
  "tranny",
  "troon",
  // Sexual violence
  "rape",
  "rapist",
  // Anti-Black / anti-African American
  "nigger",
  "nigga",
  "niggas",
  "coon",
  "coons",
  "jigaboo",
  "jiggaboo",
  "pickaninny",
  "porchmonkey",
  "spearchucker",
  "darkie",
  "darkies",
  "sambo",
  "buckwheat",
  // Hispanic / Latino-directed
  "spic",
  "spics",
  "spick",
  "wetback",
  "wetbacks",
  "beaner",
  "beaners",
  "greaser",
  // East / Southeast Asian–directed
  "chink",
  "chinks",
  "chinky",
  "gook",
  "gooks",
  "jap",
  "japs",
  "zipperhead",
  "zipperheads",
  "slopehead",
  // South Asian / Middle Eastern–directed
  "paki",
  "pakies",
  "raghead",
  "ragheads",
  "towelhead",
  "towelheads",
  "sandnigger",
  "cameljockey",
  "hajji",
  "hadji",
  // Jewish-directed
  "kike",
  "kikes",
  "hymie",
  "sheeny",
  "shylock",
  // Native / Indigenous-directed
  "redskin",
  "redskins",
  "injun",
  "injuns",
  "squaw",
  "squaws",
  // Other ethnic / white-supremacist pejoratives
  "honky",
  "honkie",
  "honkies",
  "peckerwood",
  "peckerwoods",
  "wog",
  "wogs",
  "mick",
  "micks",
  "polack",
  "polacks",
  "gypsy", // often used as slur against Roma; "Roma" preferred
  "gyp",
  "gypped",
  "mongoloid",
  "mulatto",
  "mulattoes",
  "negress",
  "mudshark",
  "mudsharks",
  "shitskin",
  "shitskins",
  "wigger",
  "wigga",
  "wiggar",
  "coonass",
];

// Multi-word hate phrases / slogans (checked after collapsing spaces).
const BLOCKED_PHRASES = [
  "white power",
  "heil hitler",
  "sieg heil",
  "blood and soil",
  "gas the jews",
  "gas the kikes",
  "jews will not replace us",
  "jews will not replace",
  "white genocide",
  "race traitor",
  "race traitors",
  "jungle bunny",
  "jungle bunnies",
  "porch monkey",
  "porch monkeys",
  "sand nigger",
  "sand niggers",
  "moon cricket",
  "moon crickets",
  "we wuz kangz",
  "we wuz kings",
  "small hats",
  "day of the rope",
  "camel jockey",
  "camel jockeys",
  "dirty jew",
  "dirty jews",
  "filthy jew",
  "filthy jews",
];

// Numeric / symbol hate codes (whole-token only).
const HATE_CODE_RE = /\b(?:1488|8814)\b/i;

const PATTERN = new RegExp(
  `\\b(?:${BLOCKED.map(escapeRegex).join("|")})\\b`,
  "i"
);

export function isProfane(text: string): boolean {
  if (!text.trim()) return false;
  const normalized = normalizeForMatch(text);
  if (PATTERN.test(normalized)) return true;
  if (HATE_CODE_RE.test(normalized)) return true;

  const collapsed = collapseForPhrases(text);
  if (!collapsed) return false;
  for (const phrase of BLOCKED_PHRASES) {
    if (collapsed.includes(phrase)) return true;
  }
  return false;
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
