import Link from "next/link";

import CoverPosterThumb from "@/components/modules/shared/cover-poster-thumb";
import type {
  DESIGNERS_QUERY_RESULT,
  PROJECT_QUERY_RESULT,
} from "@/sanity/types";

type DesignerProject =
  | NonNullable<DESIGNERS_QUERY_RESULT[number]["projects"]>[number]
  | NonNullable<
      NonNullable<PROJECT_QUERY_RESULT>["designers"][number]["projects"]
    >[number];

interface DesignerProjectLinkProps {
  project: DesignerProject;
}

export default function DesignerProjectLink({
  project,
}: DesignerProjectLinkProps) {
  return (
    <Link
      className="group/project inline-flex w-fit items-center gap-2"
      href={`/projects/${project.slug.current}`}
    >
      <CoverPosterThumb
        className="transition-opacity duration-100 ease-out group-hover/project:opacity-80"
        cover={project.cover}
      />
      <span className="line-clamp-1 transition-opacity duration-100 ease-out group-hover/project:opacity-60">
        {project.title}
      </span>
    </Link>
  );
}
