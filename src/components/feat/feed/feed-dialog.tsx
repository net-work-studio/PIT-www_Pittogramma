"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Rows3, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import AdvCard from "@/components/cards/adv-card";
import CommunityCard from "@/components/cards/community-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Feed" size="icon" variant="outline">
          <Rows3 size={16} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex items-start justify-center outline-none"
        >
          <DialogTitle className="sr-only">Feed</DialogTitle>
          <div className="flex h-full w-full max-w-120 flex-col py-8">
            <div className="flex justify-end pb-3">
              <DialogClose asChild>
                <Button aria-label="Close feed" size="icon" variant="outline">
                  <XIcon size={16} />
                </Button>
              </DialogClose>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-1">
              {hasItems ? (
                <>
                  {advs.map((adv) =>
                    adv.cover?.image?.asset ? (
                      <AdvCard
                        cover={adv.cover}
                        description={adv.description ?? undefined}
                        externalUrl={adv.externalUrl}
                        key={adv._id}
                        sponsorName={adv.sponsor?.name ?? ""}
                        title={adv.title ?? ""}
                      />
                    ) : null
                  )}
                  {communityItems.map((item) =>
                    item.cover?.image?.asset ? (
                      <CommunityCard
                        cover={item.cover}
                        description={item.description ?? undefined}
                        externalUrl={item.externalUrl}
                        key={item._id}
                        partnerName={item.partner?.name ?? null}
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
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export default function FeedDialog(props: FeedDialogProps) {
  return (
    <Suspense
      fallback={
        <Button aria-label="Feed" disabled size="icon" variant="outline">
          <Rows3 size={16} />
        </Button>
      }
    >
      <FeedDialogInner {...props} />
    </Suspense>
  );
}
