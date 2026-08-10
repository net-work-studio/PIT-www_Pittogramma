"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Tag {
  _id: string;
  name: string;
  slug: string;
}

interface FilterSheetProps {
  availableTags: Tag[];
  label: string;
  totalCount: number;
}

export default function FilterSheet({
  availableTags,
  label,
  totalCount,
}: FilterSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const activeSlugs = useMemo(() => {
    const raw = searchParams.get("tags");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const [draftSlugs, setDraftSlugs] = useState(activeSlugs);

  useEffect(() => {
    if (isOpen) {
      setDraftSlugs(activeSlugs);
    }
  }, [activeSlugs, isOpen]);

  const pushUrl = useCallback(
    (slugs: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slugs.length > 0) {
        params.set("tags", slugs.join(","));
      } else {
        params.delete("tags");
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const open = useCallback(() => setIsOpen(true), []);
  const clearDraft = useCallback(() => setDraftSlugs([]), []);
  const clearApplied = useCallback(
    () => startTransition(() => pushUrl([])),
    [pushUrl]
  );
  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const slug = event.currentTarget.dataset.tag;
      if (!slug) {
        return;
      }
      setDraftSlugs((current) =>
        current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug]
      );
    },
    []
  );
  const apply = useCallback(() => {
    setIsOpen(false);
    startTransition(() => pushUrl(draftSlugs));
  }, [draftSlugs, pushUrl]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={open} variant="mono">
        <SlidersHorizontalIcon />
        Filter {activeSlugs.length > 0 && `(${activeSlugs.length})`}
      </Button>

      {activeSlugs.length > 0 && (
        <>
          <button
            className="font-mono text-muted-foreground text-xs uppercase underline underline-offset-4 hover:text-foreground"
            disabled={isPending}
            onClick={clearApplied}
            type="button"
          >
            Reset
          </button>
          <p
            aria-live="polite"
            className="font-mono text-muted-foreground text-xs uppercase"
          >
            {totalCount} {label}
          </p>
        </>
      )}

      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetContent
          className="max-sm:!inset-x-0 max-sm:!top-auto max-sm:!bottom-0 max-sm:!h-[min(85dvh,44rem)] max-sm:!w-full max-sm:!max-w-none max-sm:!border-x-0 max-sm:!border-t flex flex-col p-0"
          side="right"
        >
          <SheetHeader className="p-6">
            <SheetTitle className="font-mono text-base uppercase">
              Filter {label}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
            <div className="divide-y border-foreground/15 border-y">
              {availableTags.map((tag) => {
                const checked = draftSlugs.includes(tag.slug);
                return (
                  <label
                    className="flex min-h-11 cursor-pointer items-center justify-between gap-4 py-3"
                    key={tag._id}
                  >
                    <span>{tag.name}</span>
                    <input
                      checked={checked}
                      className="size-4 accent-foreground"
                      data-tag={tag.slug}
                      onChange={handleDraftChange}
                      type="checkbox"
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <SheetFooter className="border-foreground/15 border-t p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-3">
              <button
                className="font-mono text-muted-foreground text-xs uppercase underline underline-offset-4 hover:text-foreground"
                onClick={clearDraft}
                type="button"
              >
                Clear all
              </button>
              <Button disabled={isPending} onClick={apply} variant="mono">
                Show results
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
