import { getContentRssFeed } from "@/lib/seo/content-rss-feed";

export function GET() {
  return getContentRssFeed({
    channelPath: "/",
    description:
      "Projects, interviews, and editorial content from Pittogramma.",
    feedPath: "/feed.xml",
    title: "Pittogramma",
    types: ["project", "interview", "journal"],
  });
}
