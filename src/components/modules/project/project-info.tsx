import Link from "next/link";
import DesignerNamesRow from "@/components/modules/project/designer-names-row";
import ProjectDescription from "@/components/modules/project/project-description";
import ProjectMetaItem from "@/components/modules/shared/meta-item";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<PROJECT_QUERY_RESULT>["designers"][number];
interface ProjectInfoProps {
  description?: string | null;
  designers?: Designer[] | null;
  institute?: string | null;
  projectId?: string;
  tags?: NonNullable<PROJECT_QUERY_RESULT>["tags"];
  teachers?: NonNullable<PROJECT_QUERY_RESULT>["teachers"];
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
  const teacherNames = teachers?.map((t) => t.name).join(", ");

  return (
    <div className="flex h-fit w-full flex-col gap-12.5 pr-0 pb-10 lg:sticky lg:top-20 lg:h-[calc(100dvh-5rem)] lg:w-1/3 lg:pr-10 lg:pb-0">
      <DesignerNamesRow
        currentProjectId={projectId}
        designers={designers}
        title={title}
      />

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-10">
        <ProjectDescription description={description ?? null} />

        <dl className="flex shrink-0 flex-col gap-0.5">
          {institute ? (
            <ProjectMetaItem label="Institute">{institute}</ProjectMetaItem>
          ) : null}
          {teacherNames ? (
            <ProjectMetaItem label="Teacher">{teacherNames}</ProjectMetaItem>
          ) : null}
          {year ? <ProjectMetaItem label="Year">{year}</ProjectMetaItem> : null}
          {tags?.length ? (
            <ProjectMetaItem label="Disciplines">
              <ul className="flex flex-col gap-0.5">
                {tags.map((tag) => (
                  <li className="text-sm" key={tag._id}>
                    {tag.slug ? (
                      <Link
                        className="underline decoration-1 underline-offset-2 hover:text-muted-foreground"
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
  );
}
