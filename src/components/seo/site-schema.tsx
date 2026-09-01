import { cacheLife } from "next/cache";

import { JsonLd } from "@/components/seo/json-ld";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const organizationId = `${siteDefaults.baseUrl}#organization`;
const websiteId = `${siteDefaults.baseUrl}#website`;
const logoUrl = `${siteDefaults.baseUrl}/web-app-manifest-512x512.png`;

export default async function SiteSchema() {
  const settings = await getCachedSiteSettings();
  const sameAs = [settings?.instagramUrl, settings?.linkedinUrl].filter(
    (url): url is string => Boolean(url)
  );

  return (
    <>
      <JsonLd
        data={{
          "@id": organizationId,
          description: siteDefaults.description,
          logo: {
            "@type": "ImageObject",
            url: logoUrl,
          },
          name: siteDefaults.title,
          sameAs: sameAs.length ? sameAs : undefined,
          url: siteDefaults.baseUrl,
        }}
        type="Organization"
      />
      <JsonLd
        data={{
          "@id": websiteId,
          alternateName: "P",
          description: siteDefaults.description,
          name: siteDefaults.title,
          publisher: { "@id": organizationId },
          url: siteDefaults.baseUrl,
        }}
        type="WebSite"
      />
    </>
  );
}

async function getCachedSiteSettings() {
  "use cache";
  cacheLife({ expire: 3600, revalidate: 300, stale: 300 });
  const { data } = await sanityFetch({
    perspective: "published",
    query: SITE_SETTINGS_QUERY,
    stega: false,
  });
  return data;
}
