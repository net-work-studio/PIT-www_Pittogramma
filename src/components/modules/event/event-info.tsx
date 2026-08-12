import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/date-utils";
import {
  type EventAttendanceMode,
  formatEventLocationDisplay,
} from "@/lib/event-location";
import {
  EVENT_TYPE_DETAIL_BADGE_VARIANT,
  getEventTypeLabel,
} from "@/lib/event-type";

interface Tag {
  _id: string;
  name: string | null;
}

interface EventInfoProps {
  attendanceMode?: EventAttendanceMode | null;
  dateEnd?: string | null;
  dateStart?: string | null;
  locationAddress?: string | null;
  locationName?: string | null;
  tags?: Tag[] | null;
  title?: string | null;
  type?: string | null;
}

export default function EventInfo({
  title,
  type,
  dateStart,
  dateEnd,
  attendanceMode,
  locationName,
  locationAddress,
  tags,
}: EventInfoProps) {
  const typeLabel = getEventTypeLabel(type);

  const location = formatEventLocationDisplay(
    attendanceMode,
    locationName,
    locationAddress
  );

  const dateDisplay = formatDateRange(dateStart, dateEnd);

  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <hgroup className="flex flex-col gap-2">
        {typeLabel ? (
          <Badge variant={EVENT_TYPE_DETAIL_BADGE_VARIANT}>{typeLabel}</Badge>
        ) : null}
        {title ? (
          <h1 className="text-3xl leading-tight lg:text-[2rem]">{title}</h1>
        ) : null}
      </hgroup>

      <dl className="hidden flex-col gap-1 lg:flex">
        {dateDisplay ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Date
            </dt>
            <dd className="text-sm">{dateDisplay}</dd>
          </div>
        ) : null}
        {location ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Location
            </dt>
            <dd className="text-sm">{location}</dd>
          </div>
        ) : null}
        {tags?.filter(Boolean).some((t) => t.name) ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Disciplines
            </dt>
            <dd>
              <ul className="flex flex-col">
                {tags
                  .filter(Boolean)
                  .filter((tag) => tag.name)
                  .map((tag) => (
                    <li className="text-sm underline" key={tag._id}>
                      {tag.name}
                    </li>
                  ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
