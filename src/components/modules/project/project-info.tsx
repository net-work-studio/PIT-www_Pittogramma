import { Button } from "@/components/ui/button";

interface Designer {
  _id: string;
  name: string | null;
  slug: unknown;
  portrait: unknown;
}

interface Teacher {
  _id: string;
  name: string | null;
}

interface ProjectHeaderProps {
  designers?: Designer[] | null;
  title?: string | null;
  description?: string | null;
  year?: number | null;
  tags?: Array<{ _id: string; name: string; slug: unknown }> | null;
  teachers?: Teacher[] | null;
  institute?: string | null;
}

export default function ProjectHeader({
  designers,
  title,
  description,
  year,
  tags,
  teachers,
  institute,
}: ProjectHeaderProps) {
  const designerNames = designers
    ?.map((d) => d.name)
    .filter(Boolean)
    .join(", ");

  const teacherNames = teachers
    ?.map((t) => t.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="sticky top-16 h-fit w-1/3">
      <hgroup className="text-3xl">
        {designerNames ? <h2>{designerNames}</h2> : null}
        {title ? <h1>{title}</h1> : null}
      </hgroup>
      <div>
        <p>{description}</p>
        <Button variant="link">Read More</Button>
      </div>
      <dl className="grid grid-cols-2 gap-1">
        {institute ? <dt className="font-mono uppercase">Institute</dt> : null}
        {institute ? <dd>{institute}</dd> : null}
        {teacherNames ? <dt className="font-mono uppercase">Teacher</dt> : null}
        {teacherNames ? <dd>{teacherNames}</dd> : null}
        {year ? <dt className="font-mono uppercase">Year</dt> : null}
        {year ? <dd>{year}</dd> : null}
        {tags ? <dt className="font-mono uppercase">Tags</dt> : null}
        {tags ? (
          <dd>
            <ul>
              {tags.map((tag) => (
                /* TODO add link to search page */
                <li key={tag._id}>{tag.name}</li>
              ))}
            </ul>
          </dd>
        ) : null}
      </dl>
    </div>
  );
}
