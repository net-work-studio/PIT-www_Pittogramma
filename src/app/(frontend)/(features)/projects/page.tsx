import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterBar from "@/components/feat/filter/filter";
import Pagination from "@/components/feat/pagination/pagination";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import type SanityImage from "@/components/modules/shared/sanity-image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  getProjectsFilteredQuery,
  PROJECTS_COUNT_QUERY,
  PROJECTS_PAGE_QUERY,
  PROJECTS_TAGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  PROJECTS_FILTERED_QUERY_RESULT,
  PROJECTS_TAGS_QUERY_RESULT,
} from "@/sanity/types";

const PAGE_SIZE = 48;

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: PROJECTS_PAGE_QUERY,
    stega: false,
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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  const { tags: tagsParam, page: pageParam, sort: sortParam } =
    await searchParams;
  const sort = isValidSort(sortParam) ? sortParam : "newest";
  const tagSlugs = tagsParam?.split(",").filter(Boolean) ?? [];
  const hasTags = tagSlugs.length > 0;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10));
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [
    { data: projects },
    { data: totalCount },
    { data: availableTags },
    { data: pageSettings },
  ] = await Promise.all([
    sanityFetch({
      query: getProjectsFilteredQuery(sort),
      params: { tags: tagSlugs, hasTags, start, end },
    }),
    sanityFetch({
      query: PROJECTS_COUNT_QUERY,
      params: { tags: tagSlugs, hasTags },
    }),
    sanityFetch({ query: PROJECTS_TAGS_QUERY }),
    sanityFetch({ query: PROJECTS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const tags = (availableTags ?? []) as PROJECTS_TAGS_QUERY_RESULT;
  const uniqueTags = Array.from(
    new Map(tags.map((t) => [t._id, t])).values()
  );

  type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

  interface ProjectCard {
    authors: { name: string }[] | undefined;
    href: string;
    id: string;
    image: SanityImageSource;
    title: string;
  }

  const items = (projects ?? []) as PROJECTS_FILTERED_QUERY_RESULT;
  const projectCards: ProjectCard[] = items.map(
    (project) => ({
      authors: project.designers?.length
        ? project.designers.map((d) => ({
            name: d.name ?? "",
          }))
        : undefined,
      href: `/projects/${project.slug.current}`,
      id: project._id,
      image: project.cover,
      title: project.title,
    })
  );

  return (
    <>
      <PageHeader
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Projects"}
      />
      <div className="space-y-10 pb-10">
        <div className="flex items-start justify-between gap-4">
          <FilterBar
            availableTags={uniqueTags}
            totalCount={totalCount}
            label="projects"
          />
          <SortDropdown />
        </div>
        {projectCards.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No results found
          </p>
        ) : (
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
        )}
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
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
