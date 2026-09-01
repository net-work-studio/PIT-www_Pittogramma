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

export type FeedItem =
  | { item: FeedAdv; kind: "adv" }
  | { item: FeedCommunityItem; kind: "community" };

interface FeedDialogProps {
  items: FeedItem[];
}

function FeedTimelineCard({ item, kind }: FeedItem) {
  if (!item.cover?.image?.asset) {
    return null;
  }

  if (kind === "adv") {
    return (
      <FeedCard
        byline={
          item.sponsor?.name ? `Sponsored by ${item.sponsor.name}` : "Sponsored"
        }
        href={item.externalUrl}
        image={
          item.coverPortrait?.asset
            ? { alt: item.cover.alt, image: item.coverPortrait }
            : item.cover
        }
        key={item._id}
        sponsored
        title={item.title ?? ""}
        variant={item.tier}
      />
    );
  }

  return (
    <FeedCard
      byline={
        item.partner?.name
          ? `In partnership with ${item.partner.name}`
          : "Community"
      }
      href={item.externalUrl}
      image={item.cover}
      key={item._id}
      title={item.title ?? ""}
    />
  );
}

function FeedDialogInner({ items }: FeedDialogProps) {
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

  const hasItems = items.some((feedItem) => feedItem.item.cover?.image?.asset);

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
            ? "flex h-full min-h-0 w-120 max-w-120 flex-col gap-0 overflow-hidden sm:max-w-120! [&>[data-slot=sheet-close]]:top-5 [&>[data-slot=sheet-close]]:right-6 [&>[data-slot=sheet-close]]:inline-flex [&>[data-slot=sheet-close]]:size-6 [&>[data-slot=sheet-close]]:items-center [&>[data-slot=sheet-close]]:justify-center"
            : "flex h-[90vh] min-h-0 flex-col gap-0 overflow-hidden"
        }
        side={side}
      >
        <SheetHeader className={isDesktop ? "items-start pb-4" : "pb-4"}>
          <SheetTitle>Feed</SheetTitle>
        </SheetHeader>
        <div className="scrollbar-none min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pb-6 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {hasItems ? (
            items.map((feedItem) => (
              <FeedTimelineCard {...feedItem} key={feedItem.item._id} />
            ))
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
