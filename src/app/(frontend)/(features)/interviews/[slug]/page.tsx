import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import InterviewContent from "@/components/modules/interview/interview-content";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import EditorialPageHero from "@/components/modules/shared/editorial-page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getCachedLocalToday } from "@/lib/cached-date-utils";
import { DetailPageBadge } from "@/lib/content-type-badge";
import {
  buildLocalToday,
  formatEventDate,
  isPublicationDateReached,
} from "@/lib/date-utils";
import { selectRelatedInterviews } from "@/lib/select-related-interviews";
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
    `*[_type == "interview" && defined(slug.current) && defined(publishingDate.date) && publishingDate.date <= $today] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({
    params: { today: buildLocalToday() },
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
  const [{ data: interview }, today] = await Promise.all([
    sanityFetchMetadata({
      params: { slug },
      perspective,
      query: INTERVIEW_QUERY,
    }),
    getCachedLocalToday(),
  ]);

  if (
    !interview ||
    (perspective === "published" &&
      !isPublicationDateReached(interview.publishingDate?.date, today))
  ) {
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
  const [today, { data: interview }] = await Promise.all([
    getCachedLocalToday(),
    sanityFetch({
      params: { slug },
      perspective,
      query: INTERVIEW_QUERY,
      stega,
    }),
  ]);

  if (
    !interview ||
    (perspective === "published" &&
      !isPublicationDateReached(interview.publishingDate?.date, today))
  ) {
    notFound();
  }

  const imageUrl = interview.cover?.image?.asset
    ? urlForImage(interview.cover)?.url()
    : undefined;
  const interviewees = interview.designersAndProfessionals?.filter((person) =>
    Boolean(person?.name)
  );
  const interviewUrl = `${siteDefaults.baseUrl}/interviews/${slug}`;
  const relatedInterviews = selectRelatedInterviews({
    fallbackInterviews: interview.fallbackInterviews,
    relatedInterviews: interview.relatedInterviews,
  });

  return (
    <>
      <JsonLd
        data={{
          author: interviewees?.length
            ? interviewees.map((person) => ({
                "@type": "Person",
                name: person.name,
                url: person.slug?.current
                  ? `${siteDefaults.baseUrl}/designers/${person.slug.current}`
                  : undefined,
              }))
            : undefined,
          dateModified: interview._updatedAt,
          datePublished: interview.publishingDate?.date,
          description: interview.introText,
          headline: interview.title,
          image: imageUrl,
          mainEntityOfPage: {
            "@id": interviewUrl,
            "@type": "WebPage",
          },
          publisher: {
            "@id": `${siteDefaults.baseUrl}#organization`,
          },
          url: interviewUrl,
        }}
        type="Article"
      />

      <div className="flex flex-col pb-12">
        <EditorialPageHero
          badge={<DetailPageBadge type="interview" />}
          byline={interviewees?.map((person) => person.name).join(", ")}
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
          <DiscoverMore interviews={relatedInterviews} />
        </div>
      </div>
    </>
  );
}
