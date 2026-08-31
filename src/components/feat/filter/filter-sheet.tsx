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
  count?: number;
  name: string;
  slug: string;
}

interface FilterSheetProps {
  availableTags: Tag[];
  label: string;
}

export default function FilterSheet({
  availableTags,
  label,
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
  const clearApplied = useCallback(
    () => startTransition(() => pushUrl([])),
    [pushUrl]
  );
  const clearAll = useCallback(() => {
    setDraftSlugs([]);
    setIsOpen(false);
    startTransition(() => pushUrl([]));
  }, [pushUrl]);
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
    <>
      {activeSlugs.length > 0 && (
        <button
          className="mr-2 font-mono text-muted-foreground text-xs uppercase underline underline-offset-4 hover:text-foreground"
          disabled={isPending}
          onClick={clearApplied}
          type="button"
        >
          Reset
        </button>
      )}

      <Button
        aria-label={
          isPending
            ? "Loading…"
            : `Filter ${label}${activeSlugs.length > 0 ? ` (${activeSlugs.length} active)` : ""}`
        }
        className="relative max-sm:w-9 max-sm:px-0"
        onClick={open}
        title={`Filter ${label}`}
        variant="mono"
      >
        <SlidersHorizontalIcon />
        <span className="max-sm:sr-only">Filter</span>
        {activeSlugs.length > 0 && (
          <span className="font-mono text-xs max-sm:sr-only">
            ({activeSlugs.length})
          </span>
        )}
        {activeSlugs.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-px -right-px size-3 rounded-full bg-blue-500 sm:hidden"
          />
        )}
      </Button>

      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetContent
          className="max-sm:!inset-x-0 max-sm:!top-auto max-sm:!bottom-0 max-sm:!h-[min(85dvh,44rem)] max-sm:!w-full max-sm:!max-w-none max-sm:!border-x-0 max-sm:!border-t flex flex-col p-0 max-sm:data-ending-style:translate-x-0 max-sm:data-starting-style:translate-x-0 max-sm:data-ending-style:translate-y-full max-sm:data-starting-style:translate-y-full"
          side="right"
        >
          <SheetHeader className="p-6">
            <SheetTitle className="font-mono text-base uppercase">
              Filter {label}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="divide-y border-foreground/15 border-y">
              {availableTags.map((tag) => {
                const checked = draftSlugs.includes(tag.slug);
                return (
                  <label
                    className="flex min-h-10 cursor-pointer items-center justify-between gap-4 py-2"
                    key={tag._id}
                  >
                    <span className="flex items-baseline gap-2">
                      <span>{tag.name}</span>
                      {typeof tag.count === "number" ? (
                        <span className="font-mono text-muted-foreground text-xs uppercase">
                          {tag.count}
                        </span>
                      ) : null}
                    </span>
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
                disabled={isPending}
                onClick={clearAll}
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
    </>
  );
}
