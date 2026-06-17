import Link from "next/link";
import DesignerNamesRow from "@/components/modules/project/designer-names-row";
import ProjectDescription from "@/components/modules/project/project-description";
import ProjectMetaItem from "@/components/modules/shared/meta-item";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<PROJECT_QUERY_RESULT>["designers"][number];
type ProjectTag = NonNullable<
  NonNullable<PROJECT_QUERY_RESULT>["tags"]
>[number];

interface Teacher {
  _id: string;
  name: string | null;
}

interface ProjectInfoProps {
  description?: string | null;
  designers?: Designer[] | null;
  institute?: string | null;
  projectId?: string;
  tags?: ProjectTag[] | null;
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
  projectId,
}: ProjectInfoProps) {
  const teacherNames = teachers
    ?.map((t: Teacher) => t.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="h-fit w-full pr-10 lg:sticky lg:top-20 lg:w-1/3">
      <div className="flex flex-col gap-12.5">
        <DesignerNamesRow
          currentProjectId={projectId}
          designers={designers}
          title={title}
        />

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
                    <li className="text-sm" key={tag._id}>
                      {tag.slug ? (
                        <Link
                          className="underline"
                          href={`/projects?tags=${encodeURIComponent(tag.slug)}`}
                        >
                          {tag.name}
                        </Link>
                      ) : (
                        tag.name
                      )}
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
