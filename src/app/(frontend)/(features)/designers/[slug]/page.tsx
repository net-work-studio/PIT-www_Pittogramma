import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import BaseCard from "@/components/cards/base-card";
import DesignerInfo from "@/components/modules/designer/designer-info";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { urlForImage } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import { DESIGNER_QUERY } from "@/sanity/lib/queries";
import type { DESIGNER_QUERY_RESULT } from "@/sanity/types";

type RelatedInterview =
  NonNullable<DESIGNER_QUERY_RESULT>["relatedInterviews"][number];

export async function generateStaticParams() {
  const slugsQuery = defineQuery(
    `*[_type == "person" && "designer" in roles && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
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
  const { data: designer } = await sanityFetchMetadata({
    query: DESIGNER_QUERY,
    params: { slug },
    perspective,
  });

  if (!designer) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: designer.name,
      description: designer.bio ?? undefined,
      coverImage: designer.portrait ?? undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/designers/${slug}`,
    siteDefaults,
  });
}

export default async function DesignerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedDesignerPage perspective={perspective} slug={slug} stega={stega} />
  );
}

async function CachedDesignerPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data: designer } = await sanityFetch({
    query: DESIGNER_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!designer) {
    notFound();
  }

  const imageUrl = designer.portrait?.image
    ? urlForImage(designer.portrait)?.url()
    : undefined;

  const designerUrl = `${siteDefaults.baseUrl}/designers/${slug}`;

  const locationParts = [designer.place?.city, designer.place?.country].filter(
    Boolean
  );

  return (
    <>
      <JsonLd
        data={{
          name: designer.name,
          description: designer.bio,
          image: imageUrl,
          url: designerUrl,
          ...(locationParts.length
            ? {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: designer.place?.city,
                  addressCountry: designer.place?.country,
                },
              }
            : {}),
        }}
        type="Person"
      />
      <div className="flex flex-col pt-6 lg:flex-row">
        <DesignerInfo
          bio={designer.bio}
          birthYear={designer.birthYear}
          education={designer.education}
          name={designer.name}
          place={designer.place}
          socialLinks={designer.socialLinks}
        />
        <div className="w-full lg:w-2/3">
          <AspectRatio
            className="relative overflow-hidden rounded-3xl"
            ratio={3 / 4}
          >
            <SanityImage
              className="rounded-3xl"
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              source={designer.portrait}
            />
          </AspectRatio>
          <ShareLinks title={designer.name} url={designerUrl} />
        </div>
      </div>
      <DiscoverMore projects={designer.relatedProjects} />
      {designer.relatedInterviews?.length ? (
        <div className="flex flex-col border-foreground border-t-[0.5px] pt-2.5">
          <h2 className="mb-4 text-base">Related Interviews</h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {designer.relatedInterviews.map((interview: RelatedInterview) => {
              const interviewSlug = interview.slug?.current;
              if (!interviewSlug) {
                return null;
              }

              const authors = interview.designersAndProfessionals?.length
                ? interview.designersAndProfessionals.map(
                    (
                      d: NonNullable<
                        RelatedInterview["designersAndProfessionals"]
                      >[number]
                    ) => ({
                      name: d.name ?? "",
                    })
                  )
                : undefined;

              return (
                <BaseCard
                  authors={authors}
                  href={`/interviews/${interviewSlug}`}
                  image={interview.cover}
                  key={interview._id}
                  title={interview.title}
                  variant="interview"
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
