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
            ? "flex h-full min-h-0 w-120 max-w-120 flex-col gap-0 overflow-hidden [&>[data-slot=sheet-close]]:top-5 [&>[data-slot=sheet-close]]:right-6 [&>[data-slot=sheet-close]]:inline-flex [&>[data-slot=sheet-close]]:size-6 [&>[data-slot=sheet-close]]:items-center [&>[data-slot=sheet-close]]:justify-center"
            : "flex h-[90vh] min-h-0 flex-col gap-0 overflow-hidden"
        }
        side={side}
      >
        <SheetHeader className={isDesktop ? "items-start pb-4" : "pb-4"}>
          <SheetTitle>Feed</SheetTitle>
        </SheetHeader>
        <div className="scrollbar-none min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pb-6 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
