import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import ProjectGallery from "@/components/modules/project/project-gallery";
import ProjectInfo from "@/components/modules/project/project-info";
import ShareLinks from "@/components/modules/project/share-links";
import CoverMedia from "@/components/modules/shared/cover-media";
import DiscoverMore from "@/components/modules/shared/discover-more";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

export async function generateStaticParams() {
  const slugsQuery = defineQuery(
    `*[_type == "project" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({ query: slugsQuery });
  return data as { slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data: project } = await sanityFetchMetadata({
    query: PROJECT_QUERY,
    params: { slug },
    perspective,
  });

  if (!project) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: project.title,
      description: project.description ?? undefined,
      coverImage: project.cover ?? undefined,
      seo: project.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/projects/${slug}`,
    siteDefaults,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedProjectPage perspective={perspective} slug={slug} stega={stega} />
  );
}

async function CachedProjectPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!project) {
    notFound();
  }

  const imageUrl = project.cover?.image?.asset
    ? urlForImage(project.cover)?.url()
    : undefined;

  const projectUrl = `${siteDefaults.baseUrl}/projects/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          name: project.title,
          description: project.description,
          creator: project.designers?.length
            ? project.designers.map(
                (
                  d: NonNullable<PROJECT_QUERY_RESULT>["designers"][number]
                ) => ({
                  "@type": "Person",
                  name: d.name,
                })
              )
            : undefined,
          dateCreated: project.year ? String(project.year) : undefined,
          image: imageUrl,
          url: projectUrl,
        }}
        type="CreativeWork"
      />
      <div className="flex flex-col py-6 lg:flex-row">
        <ProjectInfo
          description={project.description}
          designers={project.designers}
          institute={project.institute?.name}
          projectId={project._id}
          tags={project.tags}
          teachers={project.teachers}
          title={project.title}
          year={project.year}
        />
        <div className="w-full lg:w-2/3">
          <AspectRatio
            className="relative overflow-hidden rounded-3xl"
            ratio={4 / 3}
          >
            <CoverMedia
              className="rounded-3xl"
              cover={project.cover}
              fill
              priority
            />
          </AspectRatio>
          <ProjectGallery gallery={project.gallery} />
          <ShareLinks title={project.title} url={projectUrl} />
        </div>
      </div>
      <DiscoverMore projects={project.relatedProjects} />
    </>
  );
}
