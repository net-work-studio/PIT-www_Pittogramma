"use client";

import { Newspaper } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import FeedCard from "@/components/cards/feed-card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import type {
  FEED_COMMUNITY_QUERY_RESULT,
  FEED_QUERY_RESULT,
} from "@/sanity/types";

type FeedAdv = FEED_QUERY_RESULT[number];
type FeedCommunityItem = FEED_COMMUNITY_QUERY_RESULT[number];

interface FeedDialogProps {
  advs: FeedAdv[];
  communityItems: FeedCommunityItem[];
}

function FeedDialogInner({ advs, communityItems }: FeedDialogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isOpen = searchParams.get("feed") === "open";

  const handleOpenChange = useCallback(
    (open: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (open) {
        params.set("feed", "open");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      } else {
        params.delete("feed");
        const query = params.toString();
        router.replace(`${pathname}${query ? `?${query}` : ""}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  const hasAdvs = advs.some((adv) => adv.cover?.image?.asset);
  const hasCommunity = communityItems.some((item) => item.cover?.image?.asset);
  const hasItems = hasAdvs || hasCommunity;

  const side = isDesktop ? "right" : "bottom";

  return (
    <Sheet onOpenChange={handleOpenChange} open={isOpen}>
      <SheetTrigger
        render={
          <Button aria-label="Feed" size="icon" variant="outline">
            <Newspaper size={16} />
          </Button>
        }
      />
      <SheetContent
        className={
          isDesktop
            ? "scrollbar-none w-120 max-w-120 overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            : "scrollbar-none max-h-[90vh] overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        }
        overlayClassName="bg-background/80 backdrop-blur-md"
        side={side}
      >
        <SheetHeader className="pb-4">
          <SheetTitle>Feed</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-6 px-6 pb-6">
          {hasItems ? (
            <>
              {advs.map((adv) =>
                adv.cover?.image?.asset ? (
                  <FeedCard
                    byline={
                      adv.sponsor?.name
                        ? `Sponsored by ${adv.sponsor.name}`
                        : "Sponsored"
                    }
                    href={adv.externalUrl}
                    image={
                      adv.coverPortrait?.asset
                        ? { alt: adv.cover.alt, image: adv.coverPortrait }
                        : adv.cover
                    }
                    key={adv._id}
                    sponsored
                    title={adv.title ?? ""}
                    variant={adv.tier}
                  />
                ) : null
              )}
              {communityItems.map((item) =>
                item.cover?.image?.asset ? (
                  <FeedCard
                    byline={
                      item.partner?.name
                        ? `In partnership with ${item.partner.name}`
                        : "Community"
                    }
                    href={item.externalUrl}
                    image={item.cover}
                    key={item._id}
                    sponsored
                    title={item.title ?? ""}
                  />
                ) : null
              )}
            </>
          ) : (
            <p className="py-20 text-center text-muted-foreground">
              No active sponsors or community items right now.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function FeedDialog(props: FeedDialogProps) {
  return (
    <Suspense
      fallback={
        <Button aria-label="Feed" disabled size="icon" variant="outline">
          <Newspaper size={16} />
        </Button>
      }
    >
      <FeedDialogInner {...props} />
    </Suspense>
  );
}
