import { getContentRssFeed } from "@/lib/seo/content-rss-feed";

export function GET() {
  return getContentRssFeed({
    channelPath: "/projects",
    description: "Emerging graphic design projects featured by Pittogramma.",
    feedPath: "/projects/feed.xml",
    title: "Pittogramma Projects",
    types: ["project"],
  });
}
