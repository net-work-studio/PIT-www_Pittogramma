import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";
import { getSubstackRedirects } from "./src/lib/newsletter/substack-redirects";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const sanityImagePath =
  sanityProjectId && sanityDataset
    ? `/images/${sanityProjectId}/${sanityDataset}/**`
    : "/images/**";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  async redirects() {
    return [
      {
        source: "/editions",
        destination: "/",
        permanent: false,
      },
      {
        source: "/editions/:slug",
        destination: "/",
        permanent: false,
      },
      ...getSubstackRedirects(),
    ];
  },
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
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: sanityImagePath,
        // Sanity image transformations rely on dynamic query parameters.
      },
    ],
  },
};

export default nextConfig;
