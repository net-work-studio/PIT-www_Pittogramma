interface Person {
  _id: string;
  name: string | null;
  portrait: unknown;
}

interface Tag {
  _id: string;
  name: string | null;
}

interface InterviewInfoProps {
  title?: string | null;
  interviewTo?: Person[] | null;
  studio?: string | null;
  city?: string | null;
  country?: string | null;
  readingTime?: number | null;
  publishingDate?: string | null;
  tags?: Tag[] | null;
}

export default function InterviewInfo({
  title,
  interviewTo,
  studio,
  city,
  country,
  readingTime,
  publishingDate,
  tags,
}: InterviewInfoProps) {
  const intervieweeNames = interviewTo
    ?.map((p: Person) => p.name)
    .filter(Boolean)
    .join(", ");

  const location = [city, country].filter(Boolean).join(", ");

  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <hgroup className="flex flex-col gap-2">
        {title ? <h1 className="text-[2rem] leading-tight">{title}</h1> : null}
        {intervieweeNames ? (
          <h2 className="text-[2rem] text-muted-foreground leading-tight">
            Interview to {intervieweeNames}
          </h2>
        ) : null}
      </hgroup>

      <dl className="flex flex-col gap-1">
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
        {studio ? (
          <div className="flex gap-x-8">
            <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
              Studio
            </dt>
            <dd className="text-sm">{studio}</dd>
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
