import { Badge } from "@/components/ui/badge";
import { DETAIL_PAGE_BADGE_VARIANT } from "@/lib/content-type-badge";

interface Person {
  _id: string;
  name: string | null;
  portrait: unknown;
}

interface Tag {
  _id: string;
  name: string | null;
}

interface PlaceData {
  city?: string | null;
  country?: string | null;
}

interface InterviewInfoProps {
  interviewTo?: Person[] | null;
  interviewToType?: "designers" | "studio" | "typeFoundry" | null;
  place?: PlaceData | null;
  publishingDate?: string | null;
  readingTime?: number | null;
  studio?: string | null;
  tags?: Tag[] | null;
  title?: string | null;
  typeFoundry?: string | null;
}

function getEntityName({
  interviewToType,
  studio,
  typeFoundry,
}: Pick<InterviewInfoProps, "interviewToType" | "studio" | "typeFoundry">):
  | string
  | null
  | undefined {
  if (interviewToType === "studio") {
    return studio;
  }
  if (interviewToType === "typeFoundry") {
    return typeFoundry;
  }
  return null;
}

function getEntityLabel({ studio, typeFoundry }: InterviewInfoProps) {
  if (studio) {
    return "Studio";
  }
  if (typeFoundry) {
    return "Type Foundry";
  }
  return null;
}

export default function InterviewInfo({
  title,
  interviewTo,
  interviewToType,
  studio,
  typeFoundry,
  place,
  readingTime,
  publishingDate,
  tags,
}: InterviewInfoProps) {
  const entityName = getEntityName({ interviewToType, studio, typeFoundry });
  const entityLabel = getEntityLabel({ studio, typeFoundry });
  const intervieweeNames = interviewTo
    ?.map((p: Person) => p.name)
    .filter(Boolean)
    .join(", ");

  const location = [place?.city, place?.country].filter(Boolean).join(", ");

  // The prominent subject: entity name (studio/foundry) or designer names
  const primarySubject = entityName || intervieweeNames;

  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <hgroup className="flex flex-col gap-2">
        <Badge variant={DETAIL_PAGE_BADGE_VARIANT}>Interview</Badge>
        {title ? (
          <h1 className="text-2xl leading-tight lg:text-[2rem]">{title}</h1>
        ) : null}
        {primarySubject ? (
          <h2 className="text-base text-muted-foreground leading-tight lg:text-[2rem]">
            <span className="hidden lg:inline">Interview to </span>
            {primarySubject}
          </h2>
        ) : null}
        {entityName && intervieweeNames ? (
          <p className="font-mono text-muted-foreground text-xs uppercase">
            {intervieweeNames}
          </p>
        ) : null}
      </hgroup>

      <dl className="hidden flex-col gap-1 lg:flex">
        {publishingDate ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Date
            </dt>
            <dd className="text-sm">{publishingDate}</dd>
          </div>
        ) : null}
        {readingTime ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Reading Time
            </dt>
            <dd className="text-sm">{readingTime} min</dd>
          </div>
        ) : null}
        {location ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Place
            </dt>
            <dd className="text-sm">{location}</dd>
          </div>
        ) : null}
        {entityName ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              {entityLabel}
            </dt>
            <dd className="text-sm">{entityName}</dd>
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
