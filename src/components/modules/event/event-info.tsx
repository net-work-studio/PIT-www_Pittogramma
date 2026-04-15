import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventStatusConfig } from "@/lib/event-status";

interface Tag {
  _id: string;
  name: string | null;
}

interface Contributor {
  _id: string;
  name: string | null;
}

interface EventInfoProps {
  title?: string | null;
  type?: string | null;
  status?: string | null;
  ctaUrl?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  locationName?: string | null;
  locationAddress?: string | null;
  sponsor?: Contributor | null;
  partner?: Contributor | null;
  tags?: Tag[] | null;
  isPast?: boolean;
}

export default function EventInfo({
  title,
  type,
  status,
  ctaUrl,
  dateStart,
  dateEnd,
  locationName,
  locationAddress,
  sponsor,
  partner,
  tags,
  isPast,
}: EventInfoProps) {
  const statusConfig = getEventStatusConfig(status);
  const showCta = !isPast && statusConfig?.ctaLabel && ctaUrl;

  const location = [locationName, locationAddress].filter(Boolean).join(" — ");

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const dateDisplay = dateStart
    ? dateEnd && dateEnd !== dateStart
      ? `${formatDate(dateStart)} — ${formatDate(dateEnd)}`
      : formatDate(dateStart)
    : null;

  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <hgroup className="flex flex-col gap-2">
        {title ? (
          <h1 className="text-3xl leading-tight lg:text-[2rem]">{title}</h1>
        ) : null}
        {type ? (
          <h2 className="text-base text-muted-foreground leading-tight lg:text-2xl">
            {type}
          </h2>
        ) : null}
      </hgroup>

      <div className="flex flex-col gap-4">
        {statusConfig ? (
          <Badge variant={statusConfig.badgeVariant}>
            {statusConfig.label}
          </Badge>
        ) : null}

        {showCta ? (
          <a href={ctaUrl} rel="noopener noreferrer" target="_blank">
            <Button className="font-mono uppercase">
              {statusConfig.ctaLabel}
            </Button>
          </a>
        ) : null}
      </div>

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
        {sponsor ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Sponsor
            </dt>
            <dd className="text-sm">{sponsor.name}</dd>
          </div>
        ) : null}
        {partner ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Partner
            </dt>
            <dd className="text-sm">{partner.name}</dd>
          </div>
        ) : null}
        {tags?.length ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Disciplines
            </dt>
            <dd>
              <ul className="flex flex-col">
                {tags.map((tag: Tag) => (
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
