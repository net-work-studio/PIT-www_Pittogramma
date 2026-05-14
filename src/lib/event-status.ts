export type EventStatus =
  | "coming-soon"
  | "tickets-available"
  | "free-rsvp"
  | "free-entry"
  | "sold-out"
  | "waitlist"
  | "postponed"
  | "cancelled";

interface EventStatusConfig {
  badgeVariant:
    | "event-coming-soon"
    | "event-available"
    | "event-sold-out"
    | "event-waitlist"
    | "event-postponed"
    | "event-cancelled";
  ctaLabel: string | null;
  label: string;
}

const STATUS_CONFIG: Record<EventStatus, EventStatusConfig> = {
  "coming-soon": {
    label: "Coming soon",
    ctaLabel: null,
    badgeVariant: "event-coming-soon",
  },
  "tickets-available": {
    label: "Tickets available",
    ctaLabel: "Get tickets",
    badgeVariant: "event-available",
  },
  "free-rsvp": {
    label: "Free RSVP",
    ctaLabel: "Register",
    badgeVariant: "event-available",
  },
  "free-entry": {
    label: "Free entry",
    ctaLabel: null,
    badgeVariant: "event-available",
  },
  "sold-out": {
    label: "Sold out",
    ctaLabel: null,
    badgeVariant: "event-sold-out",
  },
  waitlist: {
    label: "Waitlist",
    ctaLabel: "Join waitlist",
    badgeVariant: "event-waitlist",
  },
  postponed: {
    label: "Postponed",
    ctaLabel: null,
    badgeVariant: "event-postponed",
  },
  cancelled: {
    label: "Cancelled",
    ctaLabel: null,
    badgeVariant: "event-cancelled",
  },
};

export function getEventStatusConfig(
  status: string | null | undefined
): EventStatusConfig | null {
  if (!status) {
    return null;
  }
  return STATUS_CONFIG[status as EventStatus] ?? null;
}
