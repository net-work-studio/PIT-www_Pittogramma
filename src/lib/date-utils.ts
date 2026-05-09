/**
 * Build a YYYY-MM-DD string for "today" in the server's local timezone.
 *
 * Important: do NOT use `new Date().toISOString().split("T")[0]` — that
 * returns UTC, which flips day boundaries for non-UTC servers and breaks
 * comparisons against Sanity `date` fields (which are local-calendar dates).
 */
export function buildLocalToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
