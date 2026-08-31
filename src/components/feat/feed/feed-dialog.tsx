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
      sponsored
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
            ? "scrollbar-none w-120 max-w-120 overflow-y-auto [-ms-overflow-style:none] sm:max-w-120! [&::-webkit-scrollbar]:hidden"
            : "scrollbar-none max-h-[90vh] overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        }
        side={side}
      >
        <SheetHeader className="pb-4">
          <SheetTitle>Feed</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-6 px-6 pb-6">
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
