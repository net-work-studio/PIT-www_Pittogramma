export function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "'": "&apos;",
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      })[character] ?? character
  );
}

export function toRssDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toUTCString();
}

export interface RssFeedItem {
  authors?: string[];
  description?: string;
  publishedAt?: string;
  title: string;
  updatedAt: string;
  url: string;
}

interface CreateRssXmlOptions {
  channelUrl: string;
  description: string;
  feedUrl: string;
  items: RssFeedItem[];
  title: string;
}

export function createRssXml({
  channelUrl,
  description,
  feedUrl,
  items,
  title,
}: CreateRssXmlOptions): string {
  const lastBuildDate = items.reduce<string | undefined>(
    (latest, item) =>
      !latest || item.updatedAt > latest ? item.updatedAt : latest,
    undefined
  );
  const entries = items
    .map((item) =>
      [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
        item.description
          ? `<description>${escapeXml(item.description)}</description>`
          : "",
        item.authors?.length
          ? `<author>${escapeXml(item.authors.join(", "))}</author>`
          : "",
        item.publishedAt
          ? `<pubDate>${toRssDate(item.publishedAt)}</pubDate>`
          : "",
        "</item>",
      ]
        .filter(Boolean)
        .join("")
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(title)}</title><link>${escapeXml(channelUrl)}</link><description>${escapeXml(description)}</description><atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>${lastBuildDate ? `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>` : ""}${entries}</channel></rss>`;
}
