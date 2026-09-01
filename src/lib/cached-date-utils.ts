import "server-only";

import { cacheLife } from "next/cache";

import { buildLocalToday } from "@/lib/date-utils";

// biome-ignore lint/suspicious/useAwait: Next.js cache functions must be async.
export async function getCachedLocalToday(): Promise<string> {
  "use cache";
  cacheLife({ expire: 3600, revalidate: 300, stale: 300 });
  return buildLocalToday();
}
