import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import Filter from "@/components/feat/filter/filter";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_PAGE_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { PROJECTS_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: PROJECTS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Projects",
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/projects",
    siteDefaults,
  });
}

export default async function ProjectsPage() {
  const [{ data: projects }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: PROJECTS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;

  interface ProjectCard {
    authors: { name: string }[] | undefined;
    href: string;
    id: string;
    image: string;
    title: string;
  }

  const projectCards: ProjectCard[] = projects.map(
    (project: PROJECTS_QUERY_RESULT[number]) => {
      const image = project.cover?.image
        ? urlFor(project.cover.image).width(1200).height(900).url()
        : "";

      return {
        authors: project.designers?.length
          ? project.designers.map(
              (d: PROJECTS_QUERY_RESULT[number]["designers"][number]) => ({
                name: d.name ?? "",
              })
            )
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
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Projects"}
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
      {cta && (
        <CtaCard
          buttonText={cta.buttonText}
          externalUrl={cta.externalUrl}
          headline={cta.headline}
          image={cta.image}
          internalLink={cta.internalLink}
          linkType={cta.linkType}
          variant={cta.variant}
        />
      )}
    </>
  );
}
