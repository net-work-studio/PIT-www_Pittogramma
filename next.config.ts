import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";
import { getKirbyRedirects } from "./src/lib/kirby-redirects";
import { getSubstackRedirects } from "./src/lib/newsletter/substack-redirects";
import {
  UMAMI_COLLECT_PATH,
  UMAMI_ORIGIN,
  UMAMI_SCRIPT_PATH,
} from "./src/lib/umami";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const sanityImagePath =
  sanityProjectId && sanityDataset
    ? `/images/${sanityProjectId}/${sanityDataset}/**`
    : "/images/**";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  experimental: {
    // Next's runtime config currently does not backfill this default when
    // cacheComponents is enabled, despite the main config normalizer doing so.
    instantInsights: { validationLevel: "warning" },
    prefetchInlining: true,
  },
  images: {
    qualities: [75],
    remotePatterns: [
      {
        hostname: "placehold.co",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "cdn.sanity.io",
        pathname: sanityImagePath,
        protocol: "https",
        // Sanity image transformations rely on dynamic query parameters.
      },
    ],
  },
  async redirects() {
    return [
      {
        destination: "/",
        permanent: false,
        source: "/editions",
      },
      {
        destination: "/",
        permanent: false,
        source: "/editions/:slug",
      },
      ...getKirbyRedirects(),
      ...getSubstackRedirects(),
    ];
  },
  async rewrites() {
    return [
      {
        destination: `${UMAMI_ORIGIN}/script.js`,
        source: UMAMI_SCRIPT_PATH,
      },
      {
        destination: `${UMAMI_ORIGIN}/api/send`,
        source: UMAMI_COLLECT_PATH,
      },
    ];
  },
};

export default nextConfig;
