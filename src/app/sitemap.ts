import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";

import { siteDefaults } from "@/lib/seo/site-defaults";
import { getDynamicFetchOptions, sanityFetchMetadata } from "@/sanity/lib/live";

const SITEMAP_QUERY = defineQuery(`{
  "projects": *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  },
  "interviews": *[_type == "interview" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  },
  "journals": *[_type == "journal" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
}`);

interface SitemapData {
  interviews: Array<{ slug: string; _updatedAt: string }>;
  journals: Array<{ slug: string; _updatedAt: string }>;
  projects: Array<{ slug: string; _updatedAt: string }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteDefaults.baseUrl;
  const { perspective } = await getDynamicFetchOptions();
  const { data } = await sanityFetchMetadata({
    query: SITEMAP_QUERY,
    perspective,
  });
  const sitemapData = data as SitemapData;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/designers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/submission-terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bibliography`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = sitemapData.projects.map(
    (project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const interviewPages: MetadataRoute.Sitemap = sitemapData.interviews.map(
    (interview) => ({
      url: `${baseUrl}/interviews/${interview.slug}`,
      lastModified: new Date(interview._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const journalPages: MetadataRoute.Sitemap = sitemapData.journals.map(
    (journal) => ({
      url: `${baseUrl}/journal/${journal.slug}`,
      lastModified: new Date(journal._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...projectPages, ...interviewPages, ...journalPages];
}
