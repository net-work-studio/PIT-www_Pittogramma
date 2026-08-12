import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import InterviewContent from "@/components/modules/interview/interview-content";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import EditorialPageHero from "@/components/modules/shared/editorial-page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { DetailPageBadge } from "@/lib/content-type-badge";
import { formatEventDate } from "@/lib/date-utils";
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
import { INTERVIEW_QUERY } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const interviewSlugsQuery = defineQuery(
    `*[_type == "interview" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({
    query: interviewSlugsQuery,
  });
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
  const { data: interview } = await sanityFetchMetadata({
    params: { slug },
    perspective,
    query: INTERVIEW_QUERY,
  });

  if (!interview) {
    return {};
  }

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      coverImage: interview.cover ?? undefined,
      description: interview.introText ?? undefined,
      seo: interview.seo as SeoModule | undefined,
      title: interview.title,
    },
    path: `/interviews/${slug}`,
    siteDefaults,
  });
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedInterviewPage perspective={perspective} slug={slug} stega={stega} />
  );
}

async function CachedInterviewPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data: interview } = await sanityFetch({
    params: { slug },
    perspective,
    query: INTERVIEW_QUERY,
    stega,
  });

  if (!interview) {
    notFound();
  }

  const imageUrl = interview.cover?.image?.asset
    ? urlForImage(interview.cover)?.url()
    : undefined;
  const interviewees = interview.designersAndProfessionals
    ?.map((person: { name: string }) => person.name)
    .filter(Boolean);
  const interviewUrl = `${siteDefaults.baseUrl}/interviews/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          author: interviewees?.length
            ? interviewees.map((name: string) => ({
                "@type": "Person",
                name,
              }))
            : undefined,
          description: interview.introText,
          image: imageUrl,
          name: interview.title,
          url: interviewUrl,
        }}
        type="Article"
      />

      <div className="flex flex-col pb-12">
        <EditorialPageHero
          badge={<DetailPageBadge type="interview" />}
          byline={interviewees?.join(", ")}
          cover={interview.cover}
          date={
            interview.publishingDate?.date
              ? formatEventDate(interview.publishingDate.date)
              : undefined
          }
          title={interview.title}
        />

        <div className="overflow-x-hidden py-16 lg:py-24">
          <InterviewContent content={interview.interview} />
        </div>

        <div className="px-2.5">
          <ShareLinks title={interview.title ?? ""} url={interviewUrl} />
        </div>

        <div className="px-2.5 pt-10 pb-4">
          <DiscoverMore />
        </div>
      </div>
    </>
  );
}
