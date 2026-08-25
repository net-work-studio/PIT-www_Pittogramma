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

/** An event remains homepage-eligible through its final calendar day. */
export function isUpcomingEvent(
  dateStart: string | null | undefined,
  dateEnd: string | null | undefined,
  today: string
): boolean {
  const endDate = dateEnd ?? dateStart;
  return Boolean(endDate && endDate >= today);
}

export function formatEventDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(
  dateStart: string | null | undefined,
  dateEnd: string | null | undefined
): string | null {
  if (!dateStart) {
    return null;
  }

  if (dateEnd && dateEnd !== dateStart) {
    return `${formatEventDate(dateStart)} — ${formatEventDate(dateEnd)}`;
  }

  return formatEventDate(dateStart);
}
