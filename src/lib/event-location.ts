export type EventAttendanceMode = "online" | "offline";

export function isOnlineEvent(
  attendanceMode: string | null | undefined,
  locationName?: string | null
): boolean {
  return (
    attendanceMode === "online" ||
    locationName?.trim().toLowerCase() === "online"
  );
}

/** Card byline under event title: "at {venue}" or "online". */
export function formatEventCardLocation(
  attendanceMode: string | null | undefined,
  locationName?: string | null
): string | null {
  if (isOnlineEvent(attendanceMode, locationName)) {
    return "online";
  }

  if (!locationName) {
    return null;
  }

  return `at ${locationName}`;
}

/** Full location line on event detail pages. */
export function formatEventLocationDisplay(
  attendanceMode: string | null | undefined,
  locationName?: string | null,
  locationAddress?: string | null
): string | null {
  if (isOnlineEvent(attendanceMode, locationName)) {
    return "online";
  }

  const parts = [locationName, locationAddress].filter(Boolean);
  return parts.length > 0 ? parts.join(" — ") : null;
}

export function getSchemaEventAttendanceMode(
  attendanceMode: string | null | undefined,
  locationName?: string | null
): string {
  if (isOnlineEvent(attendanceMode, locationName)) {
    return "https://schema.org/OnlineEventAttendanceMode";
  }

  return "https://schema.org/OfflineEventAttendanceMode";
}
