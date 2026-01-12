import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import Filter from "@/components/feat/filter/filter";
import SubmitBanner from "@/components/feat/submit/submit-project-banner";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { PROJECTS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The most interesting and visionary projects designed by talented young graphic designers around the world who highlights new styles and trends",
};

export default async function ProjectsPage() {
  const { data: projects } = await sanityFetch({
    query: PROJECTS_QUERY,
  });

  const projectCards = projects.map(
    (project: PROJECTS_QUERY_RESULT[number]) => {
      const image = project.cover?.image
        ? urlFor(project.cover.image).width(1200).height(900).url()
        : "";

      return {
        authors: project.designer?.name
          ? [{ name: project.designer.name }]
          : undefined,
        href: `/projects/${project.slug.current}`,
        id: project._id,
        image,
        title: project.title,
      };
    }
  );

  return (
    <>
      <PageHeader
        subtitle="The most interesting and visionary projects designed by talented young graphic designers around the world who highlights new styles and trends"
        title="Projects"
      />
      <div className="space-y-10 pb-10">
        <Filter />
        <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
          {projectCards.map((project) => (
            <BaseCard
              authors={project.authors}
              href={project.href}
              image={project.image}
              key={project.id}
              title={project.title}
              variant="project"
            />
          ))}
        </section>
        <div className="flex items-center justify-center gap-2">
          <Button className="rounded-full font-mono uppercase">1</Button>
          <Button className="rounded-full font-mono uppercase">2</Button>
          <Button className="rounded-full font-mono uppercase">3</Button>
        </div>
      </div>
      <SubmitBanner />
    </>
  );
}
