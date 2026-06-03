import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import InterviewContent from "@/components/modules/interview/interview-content";
import InterviewInfo from "@/components/modules/interview/interview-info";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
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
import { INTERVIEW_QUERY } from "@/sanity/lib/queries";

function getInterviewEntity({
  interviewToType,
  studioName,
  typeFoundryName,
}: {
  interviewToType?: "designers" | "studio" | "typeFoundry" | null;
  studioName?: string | null;
  typeFoundryName?: string | null;
}): { label: string; name: string } | null {
  if (interviewToType === "studio" && studioName) {
    return { label: "Studio", name: studioName };
  }
  if (interviewToType === "typeFoundry" && typeFoundryName) {
    return { label: "Type Foundry", name: typeFoundryName };
  }
  return null;
}

export async function generateStaticParams() {
  const slugsQuery = defineQuery(
    `*[_type == "interview" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
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
  const { data: interview } = await sanityFetchMetadata({
    query: INTERVIEW_QUERY,
    params: { slug },
    perspective,
  });

  if (!interview) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: interview.title,
      description: interview.introText ?? undefined,
      coverImage: interview.cover ?? undefined,
      seo: interview.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
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
    query: INTERVIEW_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!interview) {
    notFound();
  }

  const imageUrl = interview.cover?.image
    ? urlForImage(interview.cover.image)?.url()
    : undefined;

  const interviewees = interview.designersAndProfessionals
    ?.map((person: { name: string }) => person.name)
    .filter(Boolean);

  const interviewUrl = `${siteDefaults.baseUrl}/interviews/${slug}`;
  const interviewEntity = getInterviewEntity({
    interviewToType: interview.interviewToType,
    studioName: interview.studio?.name,
    typeFoundryName: interview.typeFoundry?.name,
  });

  return (
    <>
      <JsonLd
        data={{
          name: interview.title,
          description: interview.introText,
          author: interviewees?.length
            ? interviewees.map((name: string) => ({
                "@type": "Person",
                name,
              }))
            : undefined,
          image: imageUrl,
          url: interviewUrl,
        }}
        type="Article"
      />

      <div className="flex flex-col space-y-16">
        {/* Hero Section */}
        <div className="order-1 flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
          <InterviewInfo
            interviewTo={interview.designersAndProfessionals}
            interviewToType={interview.interviewToType}
            place={interview.place}
            publishingDate={interview.publishingDate?.date}
            readingTime={interview.readingTime}
            studio={
              interview.interviewToType === "studio"
                ? interview.studio?.name
                : undefined
            }
            tags={interview.tags}
            title={interview.title}
            typeFoundry={
              interview.interviewToType === "typeFoundry"
                ? interview.typeFoundry?.name
                : undefined
            }
          />
          <div className="w-full lg:w-[49%] lg:shrink-0">
            <AspectRatio
              className="relative w-full overflow-hidden rounded-lg"
              ratio={4 / 3}
            >
              <SanityImage
                className="rounded-lg object-cover"
                fill
                priority
                source={interview.cover}
              />
            </AspectRatio>
            {interview.cover?.alt ? (
              <p className="mt-1.5 font-mono text-[0.5rem] text-muted-foreground uppercase">
                {interview.cover.alt}
              </p>
            ) : null}
          </div>
        </div>

        {/* Bio Section */}
        {interview.introText ? (
          <div className="order-3 mx-auto w-fit space-y-2 rounded-lg border-foreground bg-muted p-4 lg:order-2 lg:p-8">
            <p className="font-mono text-base text-muted-foreground uppercase">
              Biography
            </p>
            <p className="max-w-prose text-xl">{interview.introText}</p>
          </div>
        ) : null}

        {/* Mobile-only metadata */}
        <dl className="order-4 mt-6 flex flex-col gap-1 px-2.5 lg:hidden">
          {interview.publishingDate?.date ? (
            <div className="flex gap-x-12">
              <dt className="w-34.5 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Date
              </dt>
              <dd className="text-sm">{interview.publishingDate.date}</dd>
            </div>
          ) : null}
          {interview.readingTime ? (
            <div className="flex gap-x-12">
              <dt className="w-34.5 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Reading Time
              </dt>
              <dd className="text-sm">{interview.readingTime} min</dd>
            </div>
          ) : null}
          {interview.place?.city || interview.place?.country ? (
            <div className="flex gap-x-12">
              <dt className="w-34.5 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Place
              </dt>
              <dd className="text-sm">
                {[interview.place?.city, interview.place?.country]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          ) : null}
          {interviewEntity ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                {interviewEntity.label}
              </dt>
              <dd className="text-sm">{interviewEntity.name}</dd>
            </div>
          ) : null}
          {interview.tags?.length ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Disciplines
              </dt>
              <dd>
                <ul className="flex flex-col">
                  {interview.tags.map(
                    (tag: { _id: string; name: string | null }) => (
                      <li className="text-sm underline" key={tag._id}>
                        {tag.name}
                      </li>
                    )
                  )}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>

        {/* Interview Content */}
        <div className="order-2 overflow-x-hidden py-10 lg:order-3 lg:py-16">
          <InterviewContent content={interview.interview} />
        </div>

        {/* Share Links */}
        <div className="order-5 px-2.5">
          <ShareLinks title={interview.title ?? ""} url={interviewUrl} />
        </div>

        {/* Related Content */}
        <div className="order-6 px-2.5 pt-10 pb-4">
          <DiscoverMore />
        </div>
      </div>
    </>
  );
}
