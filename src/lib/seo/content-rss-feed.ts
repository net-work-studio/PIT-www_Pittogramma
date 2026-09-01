import { connection } from "next/server";
import { defineQuery } from "next-sanity";

import { buildLocalToday } from "@/lib/date-utils";
import {
  getPublicSiteState,
  type PublicSiteSettings,
} from "@/lib/public-site-state";
import { createRssXml, type RssFeedItem } from "@/lib/seo/rss";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { sanityFetchMetadata } from "@/sanity/lib/live";

const CONTENT_RSS_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0] {
    publicSiteMode,
    countdown { heading, launchAt, message },
    maintenance { contactUrl, heading, message, returnAt }
  },
  "items": *[
    _type in $types
    && defined(slug.current)
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && seo.metaRobots != "noindex, follow"
    && seo.metaRobots != "noindex, nofollow"
  ] | order(publishingDate.date desc) [0...50] {
    _type,
    _updatedAt,
    title,
    "slug": slug.current,
    publishingDate,
    "description": select(
      _type == "journal" => excerpt,
      _type == "interview" => introText,
      _type == "project" => description
    ),
    "authors": select(
      _type == "journal" => authors[]->name,
      _type == "interview" => designersAndProfessionals[]->name,
      _type == "project" => designers[]->name
    )
  }
}`);

type RssContentType = "interview" | "journal" | "project";

interface ContentItem {
  _type: RssContentType;
  _updatedAt: string;
  authors?: string[] | null;
  description?: string | null;
  publishingDate?: { date?: string | null } | null;
  slug: string;
  title: string;
}

interface ContentRssData {
  items: ContentItem[];
  settings: PublicSiteSettings | null;
}

interface ContentRssFeedOptions {
  channelPath: string;
  description: string;
  feedPath: string;
  title: string;
  types: RssContentType[];
}

export async function getContentRssFeed({
  channelPath,
  description,
  feedPath,
  title,
  types,
}: ContentRssFeedOptions): Promise<Response> {
  await connection();

  const { data } = await sanityFetchMetadata({
    params: { today: buildLocalToday(), types },
    perspective: "published",
    query: CONTENT_RSS_QUERY,
  });
  const { items, settings } = data as ContentRssData;
  const state = getPublicSiteState(settings, {
    bypass: process.env.PUBLIC_SITE_MODE_BYPASS === "true",
  });
  const publishedItems = state.mode === "live" ? items : [];
  const rssItems: RssFeedItem[] = publishedItems.map((item) => ({
    authors: item.authors?.filter(Boolean) ?? undefined,
    description: item.description ?? undefined,
    publishedAt: item.publishingDate?.date ?? undefined,
    title: item.title,
    updatedAt: item._updatedAt,
    url: `${siteDefaults.baseUrl}/${item._type === "journal" ? "journal" : `${item._type}s`}/${item.slug}`,
  }));

  return new Response(
    createRssXml({
      channelUrl: `${siteDefaults.baseUrl}${channelPath}`,
      description,
      feedUrl: `${siteDefaults.baseUrl}${feedPath}`,
      items: rssItems,
      title,
    }),
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    }
  );
}
