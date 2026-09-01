import { getContentRssFeed } from "@/lib/seo/content-rss-feed";

export function GET() {
  return getContentRssFeed({
    channelPath: "/journal",
    description: "Articles and editorial content from Pittogramma.",
    feedPath: "/journal/feed.xml",
    title: "Pittogramma Journal",
    types: ["journal"],
  });
}
