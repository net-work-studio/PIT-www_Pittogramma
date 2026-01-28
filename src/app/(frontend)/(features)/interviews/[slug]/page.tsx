import type { Metadata } from "next";
import { notFound } from "next/navigation";

import InterviewContent from "@/components/modules/interview/interview-content";
import InterviewInfo from "@/components/modules/interview/interview-info";
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

  const interviewees = interview.interviewTo
    ?.map((person) => person.name)
    .filter(Boolean);

  const location = [interview.city?.name, interview.country?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <JsonLd
        data={{
          name: interview.title,
          description: interview.introText,
          author: interviewees?.length
            ? interviewees.map((name) => ({
                "@type": "Person",
                name,
              }))
            : undefined,
          image: imageUrl,
          url: `${siteDefaults.baseUrl}/interviews/${slug}`,
        }}
        type="Article"
      />
      <div className="flex pt-16">
        <InterviewInfo
          city={interview.city?.name}
          country={interview.country?.name}
          interviewTo={interview.interviewTo}
          introText={interview.introText}
          readingTime={interview.readingTime}
          studio={interview.studio?.name}
          tags={interview.tags}
          title={interview.title}
        />
        <div className="w-2/3">
          <div>
            <AspectRatio className="relative w-full" ratio={4 / 3}>
              <SanityImage
                className="w-full rounded-lg object-cover"
                fill
                source={interview.cover}
              />
            </AspectRatio>
          </div>
          <div className="mx-auto px-60 py-10">
            <InterviewContent content={interview.interview} />
          </div>
        </div>
      </div>
      <DiscoverMore />
    </>
  );
}
