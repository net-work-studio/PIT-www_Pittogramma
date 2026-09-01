import { getContentRssFeed } from "@/lib/seo/content-rss-feed";

export function GET() {
  return getContentRssFeed({
    channelPath: "/interviews",
    description:
      "Interviews with designers and creative professionals from Pittogramma.",
    feedPath: "/interviews/feed.xml",
    title: "Pittogramma Interviews",
    types: ["interview"],
  });
}
