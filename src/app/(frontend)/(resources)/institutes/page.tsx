import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import ResourcesHeader from "@/components/navigation/resources-header";
import { InstitutesContent } from "@/components/resources/institutes-content";
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
  INSTITUTES_PAGE_QUERY,
  INSTITUTES_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: INSTITUTES_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.institutes;
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
  if (!isResourceEnabled("institutes")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicInstitutesPage />
      </Suspense>
    );
  }
  return <CachedInstitutesPage perspective="published" stega={false} />;
}

async function DynamicInstitutesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedInstitutesPage perspective={perspective} stega={stega} />;
}

async function CachedInstitutesPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: institutes }, { data: settings }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({ perspective, query: INSTITUTES_QUERY, stega }),
      sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
      sanityFetch({ perspective, query: INSTITUTES_PAGE_QUERY, stega }),
    ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);
  const defaults = RESOURCE_PAGE_DEFAULTS.institutes;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        title={defaults.title}
      />
      <InstitutesContent
        enabledViews={getEnabledViews("institutes")}
        institutes={institutes}
        searchEnabled={isSearchEnabled("institutes")}
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
