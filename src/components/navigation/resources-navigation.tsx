"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type UIEvent, useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { Resource } from "./resources-navigation.data";

let resourcesNavigationScrollLeft = 0;
let shouldRestoreResourcesNavigationScroll = false;

export default function ResourcesNavigation({
  resources,
}: {
  resources: Resource[];
}) {
  const pathname = usePathname();
  const activeHref = resources.find(
    (resource) =>
      pathname === resource.href || pathname.startsWith(`${resource.href}/`)
  )?.href;
  const navigationRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;

    navigation?.scrollTo({ left: resourcesNavigationScrollLeft });

    return () => {
      if (!shouldRestoreResourcesNavigationScroll) {
        resourcesNavigationScrollLeft = navigation?.scrollLeft ?? 0;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (activeHref && shouldRestoreResourcesNavigationScroll) {
      navigationRef.current?.scrollTo({ left: resourcesNavigationScrollLeft });
      shouldRestoreResourcesNavigationScroll = false;
    }
  }, [activeHref]);

  useLayoutEffect(() => {
    if (!activeHref) {
      return;
    }

    const navigation = navigationRef.current;
    const activeItem = navigation?.querySelector<HTMLElement>(
      `[href="${activeHref}"]`
    );
    const navigationBounds = navigation?.getBoundingClientRect();

    if (!(activeItem && navigationBounds)) {
      return;
    }

    const activeItemBounds = activeItem.getBoundingClientRect();
    let offset = 0;

    if (activeItemBounds.left < navigationBounds.left) {
      offset = activeItemBounds.left - navigationBounds.left;
    } else if (activeItemBounds.right > navigationBounds.right) {
      offset = activeItemBounds.right - navigationBounds.right;
    }

    if (offset !== 0) {
      navigation?.scrollBy({ behavior: "smooth", left: offset });
    }
  }, [activeHref]);

  const handleResourceClick = () => {
    resourcesNavigationScrollLeft = navigationRef.current?.scrollLeft ?? 0;
    shouldRestoreResourcesNavigationScroll = true;
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    if (shouldRestoreResourcesNavigationScroll) {
      return;
    }

    resourcesNavigationScrollLeft = event.currentTarget.scrollLeft;
  };

  return (
    <nav
      className="flex w-full items-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
      ref={navigationRef}
    >
      <ul className="flex w-max shrink-0 flex-row gap-2">
        {resources.map((res) => {
          const isActive = activeHref === res.href;
          return (
            <li key={res.href}>
              <Button
                data-active={isActive}
                nativeButton={false}
                onClick={handleResourceClick}
                render={<Link href={res.href} />}
                variant="ghost"
              >
                {res.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
