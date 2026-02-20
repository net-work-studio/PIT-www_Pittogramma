import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BaseCard from "@/components/cards/base-card";
import DesignerInfo from "@/components/modules/designer/designer-info";
import ShareLinks from "@/components/modules/project/share-links";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/JsonLd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import { getLqip, urlFor, urlForImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { DESIGNER_QUERY } from "@/sanity/lib/queries";
import type { DESIGNER_QUERY_RESULT } from "@/sanity/types";

type RelatedInterview =
  NonNullable<DESIGNER_QUERY_RESULT>["relatedInterviews"][number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: designer } = await sanityFetch({
    query: DESIGNER_QUERY,
    params: { slug },
    stega: false,
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
  const { slug } = await params;
  const { data: designer } = await sanityFetch({
    query: DESIGNER_QUERY,
    params: { slug },
  });

  if (!designer) {
    notFound();
  }

  const imageUrl = designer.portrait?.image
    ? urlForImage(designer.portrait)?.url()
    : undefined;

  const designerUrl = `${siteDefaults.baseUrl}/designers/${slug}`;

  const locationParts = [
    designer.location?.city?.name,
    designer.location?.country?.name,
  ].filter(Boolean);

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
                  addressLocality: designer.location?.city?.name,
                  addressCountry: designer.location?.country?.name,
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
          location={designer.location}
          name={designer.name}
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
              const coverImage = interview.cover?.image;

              if (!(interviewSlug && coverImage)) {
                return null;
              }

              const image = urlFor(coverImage).width(600).height(450).url();

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
                  blurDataURL={getLqip(interview.cover)}
                  href={`/interviews/${interviewSlug}`}
                  image={image}
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
