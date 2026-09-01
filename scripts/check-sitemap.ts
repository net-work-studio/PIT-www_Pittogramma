const suppliedBaseUrl = process.argv[2] ?? process.env.NEXT_PUBLIC_BASE_URL;
const canonicalHrefPattern = /\bhref=["']([^"']+)["']/i;
const canonicalRelPattern = /\brel=["']canonical["']/i;
const linkTagPattern = /<link\b[^>]*>/gi;
const robotsNoindexPattern =
  /name=["']robots["'][^>]+content=["'][^"']*noindex/i;

if (!suppliedBaseUrl) {
  throw new Error(
    "Pass the deployed site URL, for example: bun run seo:check-sitemap -- https://pittogramma.xyz"
  );
}

const baseUrl = new URL(suppliedBaseUrl);
const sitemapUrl = new URL("/sitemap.xml", baseUrl);
const sitemapResponse = await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  throw new Error(
    `Sitemap returned ${sitemapResponse.status}: ${sitemapUrl.toString()}`
  );
}

const sitemapXml = await sitemapResponse.text();
const urls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
  match[1].trim()
);

if (new Set(urls).size !== urls.length) {
  throw new Error("Sitemap contains duplicate URLs.");
}

async function checkSitemapUrl(value: string): Promise<string | undefined> {
  const url = new URL(value);
  if (url.origin !== baseUrl.origin) {
    return `${value}: does not use the configured canonical origin`;
  }

  const response = await fetch(url, { redirect: "manual" });
  if (response.status !== 200) {
    return `${value}: returned ${response.status} instead of 200`;
  }

  const robots = response.headers.get("x-robots-tag")?.toLowerCase();
  if (robots?.includes("noindex")) {
    return `${value}: has an X-Robots-Tag noindex header`;
  }

  const html = await response.text();
  if (robotsNoindexPattern.test(html)) {
    return `${value}: has a noindex meta tag`;
  }

  const canonicalTag = Array.from(html.matchAll(linkTagPattern)).find((tag) =>
    canonicalRelPattern.test(tag[0])
  )?.[0];
  const canonicalHref = canonicalTag?.match(canonicalHrefPattern)?.[1];

  if (!canonicalHref) {
    return `${value}: has no canonical link`;
  }

  if (new URL(canonicalHref, url).toString() !== url.toString()) {
    return `${value}: canonical does not match the sitemap URL`;
  }
}

async function checkUrlStream(values: string[]): Promise<string[]> {
  const [value, ...remainingValues] = values;
  if (!value) {
    return [];
  }

  const [failure, remainingFailures] = await Promise.all([
    checkSitemapUrl(value),
    checkUrlStream(remainingValues),
  ]);
  return failure ? [failure, ...remainingFailures] : remainingFailures;
}

const workerCount = Math.min(8, urls.length);
const streams = Array.from({ length: workerCount }, () => [] as string[]);
for (const [index, url] of urls.entries()) {
  streams[index % workerCount]?.push(url);
}
const failures = (await Promise.all(streams.map(checkUrlStream))).flat();

if (failures.length) {
  throw new Error(`Sitemap integrity check failed:\n${failures.join("\n")}`);
}

process.stdout.write(
  `Sitemap integrity check passed for ${urls.length} URL(s).\n`
);
