import ProjectDescription from "@/components/modules/project/project-description";
import ProjectMetaItem from "@/components/modules/project/project-meta-item";

interface Designer {
  _id: string;
  name: string | null;
  portrait: unknown;
  slug: unknown;
}

interface Teacher {
  _id: string;
  name: string | null;
}

interface ProjectInfoProps {
  description?: string | null;
  designers?: Designer[] | null;
  institute?: string | null;
  tags?: Array<{ _id: string; name: string }> | null;
  teachers?: Teacher[] | null;
  title?: string | null;
  year?: number | null;
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
    <div className="h-fit w-full pr-10 lg:sticky lg:top-20 lg:w-1/3">
      <div className="flex flex-col gap-12.5">
        <header className="flex flex-col gap-1">
          {designerNames ? (
            <h2 className="text-3xl text-muted-foreground">
              {designerNames}
            </h2>
          ) : null}
          {title ? (
            <h1 className="text-3xl">{title}</h1>
          ) : null}
        </header>

        <div className="flex flex-col gap-20">
          <ProjectDescription description={description ?? null} />

          <dl className="flex flex-col gap-0.5">
            {institute ? (
              <ProjectMetaItem label="Institute">{institute}</ProjectMetaItem>
            ) : null}
            {teacherNames ? (
              <ProjectMetaItem label="Teacher">{teacherNames}</ProjectMetaItem>
            ) : null}
            {year ? (
              <ProjectMetaItem label="Year">{year}</ProjectMetaItem>
            ) : null}
            {tags?.length ? (
              <ProjectMetaItem label="Disciplines">
                <ul className="flex flex-col gap-0.5">
                  {tags.map((tag) => (
                    <li className="text-sm underline" key={tag._id}>
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </ProjectMetaItem>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
}
