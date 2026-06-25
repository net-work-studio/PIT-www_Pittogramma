export type EventAttendanceMode = "online" | "offline";

/**
 * Legacy shim: pre-migration events may still have locationName "online"
 * without attendanceMode set. Remove the locationName check once
 * migrations/event-attendance-mode has run in production.
 */
export function isOnlineEvent(
  attendanceMode: EventAttendanceMode | null | undefined,
  locationName?: string | null
): boolean {
  return (
    attendanceMode === "online" ||
    locationName?.trim().toLowerCase() === "online"
  );
}

/** Card byline under event title: "at {venue}" or "online". */
export function formatEventCardLocation(
  attendanceMode: EventAttendanceMode | null | undefined,
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
  attendanceMode: EventAttendanceMode | null | undefined,
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
  attendanceMode: EventAttendanceMode | null | undefined,
  locationName?: string | null
): string {
  if (isOnlineEvent(attendanceMode, locationName)) {
    return "https://schema.org/OnlineEventAttendanceMode";
  }

  return "https://schema.org/OfflineEventAttendanceMode";
}

type SchemaEventLocation =
  | { "@type": "VirtualLocation"; url: string }
  | { "@type": "Place"; address?: string; name: string };

export function getSchemaEventLocation(
  attendanceMode: EventAttendanceMode | null | undefined,
  locationName: string | null | undefined,
  locationAddress: string | null | undefined,
  eventUrl: string
): SchemaEventLocation | null {
  if (isOnlineEvent(attendanceMode, locationName)) {
    return { "@type": "VirtualLocation", url: eventUrl };
  }

  if (!locationName) {
    return null;
  }

  return {
    "@type": "Place",
    name: locationName,
    ...(locationAddress ? { address: locationAddress } : {}),
  };
}
