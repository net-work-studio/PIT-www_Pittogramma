import { Button } from "@/components/ui/button";

type ProjectHeaderProps = {
  designer: string;
  title: string;
  description: string;
  year: number;
  tags: string[];
  teacher: string;
  institute: string;
};

export default function ProjectHeader({
  designer,
  title,
  description,
  year,
  tags,
  teacher,
  institute,
}: ProjectHeaderProps) {
  return (
    <div className="sticky top-16 h-fit w-1/3">
      <hgroup className="text-3xl">
        {designer ? <h2>{designer}</h2> : null}
        {title ? <h1>{title}</h1> : null}
      </hgroup>
      <div>
        <p>{description}</p>
        <Button variant="link">Read More</Button>
      </div>
      <dl className="grid grid-cols-2 gap-1">
        {institute ? <dt className="font-mono uppercase">Institute</dt> : null}
        {institute ? <dd>{institute}</dd> : null}
        {teacher ? <dt className="font-mono uppercase">Teacher</dt> : null}
        {teacher ? <dd>{teacher}</dd> : null}
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
