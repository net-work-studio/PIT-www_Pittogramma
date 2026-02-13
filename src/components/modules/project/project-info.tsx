import ProjectDescription from "@/components/modules/project/project-description";

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

interface ProjectInfoProps {
  designers?: Designer[] | null;
  title?: string | null;
  description?: string | null;
  year?: number | null;
  tags?: Array<{ _id: string; name: string }> | null;
  teachers?: Teacher[] | null;
  institute?: string | null;
}

export default function ProjectInfo({
  designers,
  title,
  description,
  year,
  tags,
  teachers,
  institute,
}: ProjectInfoProps) {
  const designerNames = designers
    ?.map((d: Designer) => d.name)
    .filter(Boolean)
    .join(", ");

  const teacherNames = teachers
    ?.map((t: Teacher) => t.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="h-fit w-full pr-10 lg:sticky lg:top-14 lg:w-1/3">
      <div className="flex flex-col gap-[50px]">
        <hgroup className="flex flex-col gap-1">
          {designerNames ? (
            <h2 className="text-[2rem] text-muted-foreground leading-tight">
              {designerNames}
            </h2>
          ) : null}
          {title ? (
            <h1 className="text-[2rem] leading-tight">{title}</h1>
          ) : null}
        </hgroup>

        <div className="flex flex-col gap-20">
          <ProjectDescription description={description ?? null} />

          <dl className="flex flex-col gap-4">
            {institute ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Institute
                </dt>
                <dd className="text-sm">{institute}</dd>
              </div>
            ) : null}
            {teacherNames ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Teacher
                </dt>
                <dd className="text-sm">{teacherNames}</dd>
              </div>
            ) : null}
            {year ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Year
                </dt>
                <dd className="text-sm">{year}</dd>
              </div>
            ) : null}
            {tags?.length ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Disciplines
                </dt>
                <dd>
                  <ul className="flex flex-col">
                    {tags.map((tag: { _id: string; name: string }) => (
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
      </div>
    </div>
  );
}
