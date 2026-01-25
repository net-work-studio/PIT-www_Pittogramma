import type { MetadataRoute } from "next";

import { siteDefaults } from "@/lib/seo/siteDefaults";
import { client } from "@/sanity/lib/client";

const SITEMAP_QUERY = `{
  "projects": *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  },
  "interviews": *[_type == "interview" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  },
  "editions": *[_type == "edition" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
}`;

interface SitemapData {
  projects: Array<{ slug: string; _updatedAt: string }>;
  interviews: Array<{ slug: string; _updatedAt: string }>;
  editions: Array<{ slug: string; _updatedAt: string }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteDefaults.baseUrl;
  const data = await client.fetch<SitemapData>(SITEMAP_QUERY);

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
      url: `${baseUrl}/designers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
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

  const projectPages: MetadataRoute.Sitemap = data.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const interviewPages: MetadataRoute.Sitemap = data.interviews.map(
    (interview) => ({
      url: `${baseUrl}/interviews/${interview.slug}`,
      lastModified: new Date(interview._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const editionPages: MetadataRoute.Sitemap = data.editions.map((edition) => ({
    url: `${baseUrl}/editions/${edition.slug}`,
    lastModified: new Date(edition._updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...interviewPages, ...editionPages];
}
