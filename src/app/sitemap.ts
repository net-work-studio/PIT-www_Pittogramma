import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { defineQuery } from "next-sanity";

import { buildLocalToday } from "@/lib/date-utils";
import {
  type FeatureAvailabilitySettings,
  getEnabledResources,
  getFeatureAvailability,
} from "@/lib/feature-availability";
import {
  getPublicSiteState,
  type PublicSiteSettings,
} from "@/lib/public-site-state";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { sanityFetchMetadata } from "@/sanity/lib/live";

const SITEMAP_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0] {
    publicSiteMode,
    countdown { heading, launchAt, message },
    maintenance { contactUrl, heading, message, returnAt },
    indexAvailability {
      headerSearchEnabled,
      studiosAgencies { published, enabledViews, searchEnabled },
      typeFoundries { published, enabledViews, searchEnabled },
      institutes { published, enabledViews, searchEnabled },
      bookshops { published, enabledViews, searchEnabled },
      websites { published, enabledViews, searchEnabled },
      glossary { published, searchEnabled },
      bibliography { published }
    }
  },
  "pageSettings": *[_type in [
    "aboutPage",
    "homePage",
    "projectsPage",
    "interviewsPage",
    "journalPage",
    "designersPage",
    "eventsPage",
    "bibliographyPage",
    "bookshopsPage",
    "glossaryPage",
    "institutesPage",
    "studiosAgenciesPage",
    "typeFoundriesPage",
    "websitesPage"
  ]] {
    _type,
    "noIndex": seo.metaRobots in ["noindex, follow", "noindex, nofollow"]
  },
  "cookiePolicy": *[_type == "cookiePolicyPage" && count(content) > 0][0] { _id },
  "submissionTerms": *[_type == "submissionTermsPage" && count(content) > 0][0] { _id },
  "projects": *[
    _type == "project"
    && defined(slug.current)
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && seo.metaRobots != "noindex, follow"
    && seo.metaRobots != "noindex, nofollow"
  ] {
    "slug": slug.current,
    _updatedAt
  },
  "interviews": *[
    _type == "interview"
    && defined(slug.current)
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && seo.metaRobots != "noindex, follow"
    && seo.metaRobots != "noindex, nofollow"
  ] {
    "slug": slug.current,
    _updatedAt
  },
  "journals": *[
    _type == "journal"
    && defined(slug.current)
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && seo.metaRobots != "noindex, follow"
    && seo.metaRobots != "noindex, nofollow"
  ] {
    "slug": slug.current,
    _updatedAt
  },
  "events": *[
    _type == "event"
    && defined(slug.current)
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && coalesce(cardDestination, "internal") == "internal"
    && seo.metaRobots != "noindex, follow"
    && seo.metaRobots != "noindex, nofollow"
  ] {
    "slug": slug.current,
    _updatedAt
  }
}`);

interface SitemapContent {
  _updatedAt: string;
  slug: string;
}

interface SitemapPageSetting {
  _type: string;
  noIndex: boolean;
}

type SitemapSettings = FeatureAvailabilitySettings & PublicSiteSettings;

interface SitemapData {
  cookiePolicy: { _id: string } | null;
  events: SitemapContent[];
  interviews: SitemapContent[];
  journals: SitemapContent[];
  pageSettings: SitemapPageSetting[];
  projects: SitemapContent[];
  settings: SitemapSettings | null;
  submissionTerms: { _id: string } | null;
}

const pageRoutes = [
  { path: "/", type: "homePage" },
  { path: "/projects", type: "projectsPage" },
  { path: "/interviews", type: "interviewsPage" },
  { path: "/journal", type: "journalPage" },
  { path: "/designers", type: "designersPage" },
  { path: "/events", type: "eventsPage" },
] as const;

const resourcePageTypeByKey = {
  bibliography: "bibliographyPage",
  bookshops: "bookshopsPage",
  glossary: "glossaryPage",
  institutes: "institutesPage",
  "studios-agencies": "studiosAgenciesPage",
  "type-foundries": "typeFoundriesPage",
  websites: "websitesPage",
} as const;

function isIndexablePageSetting(
  pageSettings: SitemapPageSetting[],
  type: string
): boolean {
  return !pageSettings.some(
    (pageSetting) => pageSetting._type === type && pageSetting.noIndex
  );
}

function contentEntries(
  baseUrl: string,
  path: string,
  content: SitemapContent[]
): MetadataRoute.Sitemap {
  return content.map((item) => ({
    lastModified: new Date(item._updatedAt),
    url: `${baseUrl}${path}/${item.slug}`,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The holding state can become live at its configured launch time without a
  // corresponding CMS mutation, so the sitemap must be evaluated per request.
  await connection();

  const { baseUrl } = siteDefaults;
  const { data } = await sanityFetchMetadata({
    params: { today: buildLocalToday() },
    perspective: "published",
    query: SITEMAP_QUERY,
  });
  const sitemapData = data as SitemapData;
  const siteState = getPublicSiteState(sitemapData.settings, {
    bypass: process.env.PUBLIC_SITE_MODE_BYPASS === "true",
  });

  if (siteState.mode !== "live") {
    return [];
  }

  const staticPages: MetadataRoute.Sitemap = pageRoutes
    .filter(({ type }) =>
      isIndexablePageSetting(sitemapData.pageSettings, type)
    )
    .map(({ path }) => ({ url: `${baseUrl}${path}` }));

  if (isIndexablePageSetting(sitemapData.pageSettings, "aboutPage")) {
    const hasAboutPage = sitemapData.pageSettings.some(
      (pageSetting) => pageSetting._type === "aboutPage"
    );
    if (hasAboutPage) {
      staticPages.push({ url: `${baseUrl}/about` });
    }
  }

  staticPages.push(
    { url: `${baseUrl}/impressum` },
    { url: `${baseUrl}/privacy-policy` },
    { url: `${baseUrl}/submit` },
    { url: `${baseUrl}/contribute` }
  );

  if (sitemapData.cookiePolicy) {
    staticPages.push({ url: `${baseUrl}/cookie-policy` });
  }
  if (sitemapData.submissionTerms) {
    staticPages.push({ url: `${baseUrl}/submission-terms` });
  }

  const resourcePages = getEnabledResources(
    getFeatureAvailability(sitemapData.settings)
  )
    .filter(({ key }) =>
      isIndexablePageSetting(
        sitemapData.pageSettings,
        resourcePageTypeByKey[key]
      )
    )
    .map(({ href }) => ({ url: `${baseUrl}${href}` }));

  return [
    ...staticPages,
    ...resourcePages,
    ...contentEntries(baseUrl, "/projects", sitemapData.projects),
    ...contentEntries(baseUrl, "/interviews", sitemapData.interviews),
    ...contentEntries(baseUrl, "/journal", sitemapData.journals),
    ...contentEntries(baseUrl, "/events", sitemapData.events),
  ];
}
