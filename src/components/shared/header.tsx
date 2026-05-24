import { Search } from "lucide-react";
import Link from "next/link";
import Mark from "@/components/brand/mark";
import FeedDialog from "@/components/feat/feed/feed-dialog";
import SubmitDialog from "@/components/feat/submit/submit-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { type AdvTier, TIER_CAPS, TIER_ORDER } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
import {
  getEnabledResources,
  isHeaderSearchEnabled,
} from "@/lib/feature-flags";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_COMMUNITY_QUERY, FEED_QUERY } from "@/sanity/lib/queries";
import { NavigationDesktop } from "../navigation/navigation-desktop";
import { NavigationMobile } from "../navigation/navigation-mobile";
import { Button } from "../ui/button";

export default async function Header() {
  const enabledResources = getEnabledResources();
  const headerSearchEnabled = isHeaderSearchEnabled();
  const today = buildLocalToday();

  const [advsRes, communityRes] = await Promise.all([
    sanityFetch({ query: FEED_QUERY, params: { today } }),
    sanityFetch({ query: FEED_COMMUNITY_QUERY, params: { today } }),
  ]);

  const allAdvs = advsRes.data ?? [];
  const communityItems = communityRes.data ?? [];

  const byTier: Record<AdvTier, typeof allAdvs> = {
    gold: [],
    silver: [],
    bronze: [],
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
    <header className="fixed top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-between border-foreground/10 border-b bg-background px-4 py-2.5">
      <Link className="flex items-center" href="/">
        <span className="sr-only">Pittogramma — Home</span>
        <Mark aria-hidden="true" focusable="false" />
      </Link>
      <NavigationDesktop resources={enabledResources} />
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex">
          <SubmitDialog />
        </div>
        <FeedDialog advs={advs} communityItems={communityItems} />
        {headerSearchEnabled && (
          <div className="hidden md:flex">
            <Button size="icon" variant="outline">
              <Search size={16} />
            </Button>
          </div>
        )}
        <div className="hidden lg:flex">
          <ModeToggle />
        </div>
        <NavigationMobile resources={enabledResources} />
      </div>
    </header>
  );
}
