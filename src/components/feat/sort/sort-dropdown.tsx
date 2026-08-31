"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortOption } from "./sort-options";
import { isValidSort, SORT_OPTIONS } from "./sort-options";

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawSort = searchParams.get("sort") ?? undefined;
  const currentSort: SortOption = isValidSort(rawSort) ? rawSort : "newest";

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Newest first";

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      // Reset to page 1 on sort change
      params.delete("page");
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    },
    [pathname, router, searchParams]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={isPending ? "Loading…" : `Sort: ${currentLabel}`}
            className="font-mono uppercase max-sm:w-9 max-sm:px-0"
            title={`Sort: ${currentLabel}`}
          />
        }
      >
        <ArrowDownUpIcon className="sm:hidden" />
        <span className="max-sm:sr-only">{currentLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={handleSortChange}
          value={currentSort}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              className="font-mono text-xs uppercase"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
