/**
 * Format a blog post date string for display.
 *
 * Important: blog post dates are stored as plain `YYYY-MM-DD` strings. They
 * represent a *calendar date*, not a UTC timestamp. If you do
 * `new Date("2026-04-17")` the JS engine parses it as **UTC midnight**, which
 * means viewers west of UTC (e.g. PDT = UTC−7) will render the *previous day*.
 *
 * To avoid that, we split `YYYY-MM-DD` into y/m/d numbers and construct a
 * local-midnight Date. For anything else (ISO timestamps with a time/TZ),
 * we fall back to the normal Date constructor.
 */
export function formatPostDate(dateStr: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
