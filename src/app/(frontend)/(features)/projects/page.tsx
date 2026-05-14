import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdvCard from "@/components/cards/adv-card";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterBar from "@/components/feat/filter/filter";
import LoadMore from "@/components/feat/load-more/load-more";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import type SanityImage from "@/components/modules/shared/sanity-image";
import PageHeader from "@/components/shared/page-header";
import { buildIndexSlots } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  getProjectsFilteredQuery,
  INDEX_GOLD_QUERY,
  PROJECTS_COUNT_QUERY,
  PROJECTS_PAGE_QUERY,
  PROJECTS_TAGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  PROJECTS_FILTERED_QUERY_RESULT,
  PROJECTS_TAGS_QUERY_RESULT,
} from "@/sanity/types";

const PAGE_SIZE = 48;
const MAX_PAGE = 100;

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
  const {
    tags: tagsParam,
    page: pageParam,
    sort: sortParam,
  } = await searchParams;
  const sort = isValidSort(sortParam) ? sortParam : "newest";
  const tagSlugs = tagsParam?.split(",").filter(Boolean) ?? [];
  const hasTags = tagSlugs.length > 0;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  if (requestedPage > MAX_PAGE) {
    notFound();
  }
  const page = requestedPage;
  const start = 0;
  const end = page * PAGE_SIZE;
  const today = buildLocalToday();

  const [
    { data: projects },
    { data: totalCount },
    { data: availableTags },
    { data: pageSettings },
    { data: goldAdv },
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
    sanityFetch({ query: INDEX_GOLD_QUERY, params: { today } }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  if (page > totalPages) {
    notFound();
  }

  const tags = (availableTags ?? []) as PROJECTS_TAGS_QUERY_RESULT;
  const uniqueTags = Array.from(new Map(tags.map((t) => [t._id, t])).values());

  type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

  interface ProjectCard {
    authors: { name: string }[] | undefined;
    href: string;
    id: string;
    image: SanityImageSource;
    title: string;
  }

  const items = (projects ?? []) as PROJECTS_FILTERED_QUERY_RESULT;
  const projectCards: ProjectCard[] = items.map((project) => ({
    authors: project.designers?.length
      ? project.designers.map((d) => ({
          name: d.name ?? "",
        }))
      : undefined,
    href: `/projects/${project.slug.current}`,
    id: project._id,
    image: project.cover,
    title: project.title,
  }));

  // Inject gold ADV at row 1 / position 3 on every render. The query caps at
  // a single active gold, so the ADV appears exactly once in the rendered
  // list. Pagination math (totalCount, totalPages) uses editorial counts only.
  const slots = buildIndexSlots(projectCards, goldAdv?.[0]);

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
            label="projects"
            totalCount={totalCount}
          />
          <SortDropdown />
        </div>
        {projectCards.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No results found
          </p>
        ) : (
          <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
            {slots.map((slot) => {
              if (slot.kind === "adv") {
                const adv = slot.item;
                if (!adv.cover?.image?.asset) {
                  return null;
                }
                return (
                  <AdvCard
                    cover={adv.cover}
                    description={adv.description ?? undefined}
                    externalUrl={adv.externalUrl}
                    key={adv._id}
                    sponsorName={adv.sponsor?.name ?? ""}
                    title={adv.title ?? ""}
                  />
                );
              }
              const project = slot.item;
              return (
                <BaseCard
                  authors={project.authors}
                  href={project.href}
                  image={project.image}
                  key={project.id}
                  title={project.title}
                />
              );
            })}
          </section>
        )}
        <LoadMore currentPage={page} totalPages={totalPages} />
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
