import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import CtaCard from "@/components/cards/cta-card";
import ResourcesHeader from "@/components/navigation/resources-header";
import { BibliographyContent } from "@/components/resources/bibliography-content";
import { RESOURCE_PAGE_DEFAULTS } from "@/lib/resource-page";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { utmSettingsFromSiteSettings } from "@/lib/tracked-link";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import {
  BIBLIOGRAPHY_PAGE_QUERY,
  BIBLIOGRAPHY_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: BIBLIOGRAPHY_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.bibliography;
  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: page?.introText ?? defaults.introText,
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? defaults.title,
    },
    path: defaults.route,
    siteDefaults,
  });
}

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicBibliographyPage />
      </Suspense>
    );
  }
  return <CachedBibliographyPage perspective="published" stega={false} />;
}

async function DynamicBibliographyPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedBibliographyPage perspective={perspective} stega={stega} />;
}

async function CachedBibliographyPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: books }, { data: settings }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({ perspective, query: BIBLIOGRAPHY_QUERY, stega }),
      sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
      sanityFetch({ perspective, query: BIBLIOGRAPHY_PAGE_QUERY, stega }),
    ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);
  const defaults = RESOURCE_PAGE_DEFAULTS.bibliography;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        title={defaults.title}
      />
      <BibliographyContent books={books} utmSettings={utmSettings} />
      {cta ? (
        <div className="pt-10 pb-10">
          <CtaCard
            buttonText={cta.buttonText}
            externalUrl={cta.externalUrl}
            headline={cta.headline}
            image={cta.image}
            internalLink={cta.internalLink}
            linkType={cta.linkType}
            variant={cta.variant}
          />
        </div>
      ) : null}
    </>
  );
}
