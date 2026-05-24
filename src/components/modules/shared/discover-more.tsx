import BaseCard from "@/components/cards/base-card";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type RelatedProject =
  NonNullable<PROJECT_QUERY_RESULT>["relatedProjects"][number];

interface DiscoverMoreProps {
  projects?: RelatedProject[];
}

export default function DiscoverMore({ projects }: DiscoverMoreProps) {
  if (!projects?.length) {
    return null;
  }

  return (
    <div className="flex flex-col border-border border-t pt-2.5">
      <h2 className="mb-4 text-base">Discover More</h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project: RelatedProject) => {
          const slug = project.slug?.current;
          if (!slug) {
            return null;
          }

          const authors = project.designers?.length
            ? project.designers.map(
                (d: RelatedProject["designers"][number]) => ({
                  name: d.name ?? "",
                })
              )
            : undefined;

          return (
            <BaseCard
              authors={authors}
              href={`/projects/${slug}`}
              image={project.cover}
              key={project._id}
              title={project.title}
            />
          );
        })}
      </div>
    </div>
  );
}
