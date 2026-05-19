import type { NextConfig } from "next";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const sanityImagePath =
  sanityProjectId && sanityDataset
    ? `/images/${sanityProjectId}/${sanityDataset}/**`
    : "/images/**";

const nextConfig: NextConfig = {
  experimental: {
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
