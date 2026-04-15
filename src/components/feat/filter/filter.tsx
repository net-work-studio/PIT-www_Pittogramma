"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Tag {
  _id: string;
  name: string;
  slug: string;
}

interface FilterBarProps {
  availableTags: Tag[];
  totalCount: number;
  label: string;
}

export default function FilterBar({
  availableTags,
  totalCount,
  label,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSlugs = useMemo(() => {
    const raw = searchParams.get("tags");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const activeTagObjects = useMemo(
    () => availableTags.filter((tag) => activeSlugs.includes(tag.slug)),
    [availableTags, activeSlugs]
  );

  const pushUrl = useCallback(
    (slugs: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slugs.length > 0) {
        params.set("tags", slugs.join(","));
      } else {
        params.delete("tags");
      }
      // Reset to page 1 on filter change
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const toggleTag = useCallback(
    (slug: string) => {
      const next = activeSlugs.includes(slug)
        ? activeSlugs.filter((s) => s !== slug)
        : [...activeSlugs, slug];
      pushUrl(next);
    },
    [activeSlugs, pushUrl]
  );

  const removeTag = useCallback(
    (slug: string) => {
      pushUrl(activeSlugs.filter((s) => s !== slug));
    },
    [activeSlugs, pushUrl]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tags");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname, searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="font-mono uppercase">
            Filters
            {activeSlugs.length > 0 && ` (${activeSlugs.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-3">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = activeSlugs.includes(tag.slug);
              return (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`cursor-pointer rounded-full px-3 py-1 font-mono text-xs uppercase transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "border border-foreground/20 bg-transparent hover:border-foreground/40"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {activeTagObjects.map((tag) => (
        <span
          key={tag._id}
          className="inline-flex items-center gap-1 rounded-full border border-foreground/20 px-3 py-1 font-mono text-xs uppercase"
        >
          {tag.name}
          <button
            type="button"
            onClick={() => removeTag(tag.slug)}
            className="cursor-pointer rounded-full p-0.5 hover:bg-foreground/10"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}

      {activeSlugs.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer font-mono text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Clear all
        </button>
      )}

      {activeSlugs.length > 0 && (
        <span className="font-mono text-sm text-muted-foreground">
          {totalCount} {label}
        </span>
      )}
    </div>
  );
}
