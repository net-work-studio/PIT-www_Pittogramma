import { Newspaper, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import Mark from "@/components/brand/mark";
import FeedDialog from "@/components/feat/feed/feed-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { type AdvTier, TIER_CAPS, TIER_ORDER } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
import {
  getEnabledResources,
  getFeatureAvailability,
} from "@/lib/feature-availability";
import { type DynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import {
  FEED_COMMUNITY_QUERY,
  FEED_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

import { NavigationDesktop } from "../navigation/navigation-desktop";
import { NavigationMobile } from "../navigation/navigation-mobile";
import { Button } from "../ui/button";

export default async function Header({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const today = buildLocalToday();

  const [advsRes, communityRes, settingsRes] = await Promise.all([
    sanityFetch({ params: { today }, perspective, query: FEED_QUERY, stega }),
    sanityFetch({
      params: { today },
      perspective,
      query: FEED_COMMUNITY_QUERY,
      stega,
    }),
    sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
  ]);

  const allAdvs = advsRes.data ?? [];
  const communityItems = communityRes.data ?? [];
  const availability = getFeatureAvailability(settingsRes.data);
  const enabledResources = getEnabledResources(availability);

  const byTier: Record<AdvTier, typeof allAdvs> = {
    bronze: [],
    gold: [],
    silver: [],
  };
  for (const adv of allAdvs) {
    if (adv.tier === "gold" || adv.tier === "silver" || adv.tier === "bronze") {
      byTier[adv.tier].push(adv);
    }
  }
  const advs = TIER_ORDER.flatMap((tier) =>
    byTier[tier].slice(0, TIER_CAPS[tier])
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-between border-border border-b bg-background px-4 py-2.5">
      <Link className="flex items-center" href="/">
        <span className="sr-only">Pittogramma — Home</span>
        <Mark aria-hidden="true" focusable="false" />
      </Link>
      <NavigationDesktop resources={enabledResources} />
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex">
          <Button
            nativeButton={false}
            render={<Link href="/submit" />}
            variant="mono"
          >
            Submit your project
          </Button>
        </div>
        <Suspense
          fallback={
            <Button aria-label="Feed" disabled size="icon" variant="outline">
              <Newspaper size={16} />
            </Button>
          }
        >
          <FeedDialog advs={advs} communityItems={communityItems} />
        </Suspense>
        {availability.headerSearchEnabled ? (
          <div className="hidden md:flex">
            <Button size="icon" variant="outline">
              <Search size={16} />
            </Button>
          </div>
        ) : null}
        <div className="hidden lg:flex">
          <ModeToggle />
        </div>
        <NavigationMobile resources={enabledResources} />
      </div>
    </header>
  );
}
