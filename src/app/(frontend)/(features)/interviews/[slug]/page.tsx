import type { Metadata } from "next";
import { notFound } from "next/navigation";

import InterviewContent from "@/components/modules/interview/interview-content";
import InterviewInfo from "@/components/modules/interview/interview-info";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/JsonLd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { INTERVIEW_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: interview } = await sanityFetch({
    query: INTERVIEW_QUERY,
    params: { slug },
    stega: false,
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
  const { slug } = await params;
  const { data: interview } = await sanityFetch({
    query: INTERVIEW_QUERY,
    params: { slug },
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

      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="order-1 flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
          <InterviewInfo
            city={interview.city?.name}
            country={interview.country?.name}
            interviewTo={interview.designersAndProfessionals}
            publishingDate={interview.publishingDate?.date}
            readingTime={interview.readingTime}
            studio={interview.studio?.name}
            tags={interview.tagSelector?.tags}
            title={interview.title}
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
          <div className="order-3 border-foreground border-t-[0.5px] px-2.5 pt-6 lg:order-2 lg:border-t-0 lg:pt-20">
            <p className="font-mono text-muted-foreground text-xs uppercase lg:text-2xl">
              Bio
            </p>
            <p className="text-base leading-normal lg:text-[2rem] lg:leading-tight">
              {interview.introText}
            </p>
          </div>
        ) : null}

        {/* Mobile-only metadata */}
        <dl className="order-4 mt-6 flex flex-col gap-1 px-2.5 lg:hidden">
          {interview.publishingDate?.date ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Date
              </dt>
              <dd className="text-sm">{interview.publishingDate.date}</dd>
            </div>
          ) : null}
          {interview.readingTime ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Reading Time
              </dt>
              <dd className="text-sm">{interview.readingTime} min</dd>
            </div>
          ) : null}
          {interview.city?.name || interview.country?.name ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Place
              </dt>
              <dd className="text-sm">
                {[interview.city?.name, interview.country?.name]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          ) : null}
          {interview.studio?.name ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Studio
              </dt>
              <dd className="text-sm">{interview.studio.name}</dd>
            </div>
          ) : null}
          {interview.tagSelector?.tags?.length ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Disciplines
              </dt>
              <dd>
                <ul className="flex flex-col">
                  {interview.tagSelector.tags.map(
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
