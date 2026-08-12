import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import ResourcesHeader from "@/components/navigation/resources-header";
import { WebsitesContent } from "@/components/resources/websites-content";
import {
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
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
  SITE_SETTINGS_QUERY,
  WEB_SOURCES_QUERY,
  WEBSITES_PAGE_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: WEBSITES_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.websites;
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
  if (!isResourceEnabled("websites")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicWebsitesPage />
      </Suspense>
    );
  }
  return <CachedWebsitesPage perspective="published" stega={false} />;
}

async function DynamicWebsitesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedWebsitesPage perspective={perspective} stega={stega} />;
}

async function CachedWebsitesPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [{ data: sources }, { data: settings }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({ perspective, query: WEB_SOURCES_QUERY, stega }),
      sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
      sanityFetch({ perspective, query: WEBSITES_PAGE_QUERY, stega }),
    ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);
  const defaults = RESOURCE_PAGE_DEFAULTS.websites;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        title={defaults.title}
      />
      <WebsitesContent
        enabledViews={getEnabledViews("websites")}
        searchEnabled={isSearchEnabled("websites")}
        sources={sources}
        utmSettings={utmSettings}
      />
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
