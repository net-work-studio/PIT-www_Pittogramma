import { Button } from "@/components/ui/button";

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
  introText?: string | null;
  interviewTo?: Person[] | null;
  studio?: string | null;
  city?: string | null;
  country?: string | null;
  readingTime?: number | null;
  tags?: Tag[] | null;
}

export default function InterviewInfo({
  title,
  introText,
  interviewTo,
  studio,
  city,
  country,
  readingTime,
  tags,
}: InterviewInfoProps) {
  const intervieweeNames = interviewTo
    ?.map((p) => p.name)
    .filter(Boolean)
    .join(", ");

  const location = [city, country].filter(Boolean).join(", ");

  return (
    <div className="sticky top-16 h-fit w-1/3">
      <hgroup className="text-3xl">
        {intervieweeNames ? <h2>{intervieweeNames}</h2> : null}
        {title ? <h1>{title}</h1> : null}
      </hgroup>
      <div>
        <p>{introText}</p>
        <Button variant="link">Read More</Button>
      </div>
      <dl className="grid grid-cols-2 gap-1">
        {studio ? <dt className="font-mono uppercase">Studio</dt> : null}
        {studio ? <dd>{studio}</dd> : null}
        {location ? <dt className="font-mono uppercase">Location</dt> : null}
        {location ? <dd>{location}</dd> : null}
        {readingTime ? (
          <dt className="font-mono uppercase">Reading Time</dt>
        ) : null}
        {readingTime ? <dd>{readingTime} min</dd> : null}
        {tags?.length ? <dt className="font-mono uppercase">Tags</dt> : null}
        {tags?.length ? (
          <dd>
            <ul>
              {tags.map((tag) => (
                <li key={tag._id}>{tag.name}</li>
              ))}
            </ul>
          </dd>
        ) : null}
      </dl>
    </div>
  );
}
