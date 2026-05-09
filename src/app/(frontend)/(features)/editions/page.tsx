import type { Metadata } from "next";

import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  EDITIONS_LIST_QUERY,
  EDITIONS_PAGE_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: EDITIONS_PAGE_QUERY,
    stega: false,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Editions",
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/editions",
    siteDefaults,
  });
}

export default async function EditionsPage() {
  const [{ data: editions }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: EDITIONS_LIST_QUERY }),
    sanityFetch({ query: EDITIONS_PAGE_QUERY }),
  ]);

  const items = editions ?? [];
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <div className="space-y-10 pb-10 pt-6">
        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No editions yet
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((edition) => (
              <BaseCard
                href={`/editions/${edition.slug.current}`}
                image={edition.cover}
                key={edition._id}
                title={edition.title ?? ""}
              />
            ))}
          </section>
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
