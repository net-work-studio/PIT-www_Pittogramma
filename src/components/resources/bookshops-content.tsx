"use client";

import { useState } from "react";

import {
  CityDisplay,
  CountryDisplay,
  LocationDisplay,
} from "@/components/resources/location-display";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/feature-flags";
import { buildHrefFromSocialLinks } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { BOOKSHOPS_QUERY_RESULT } from "@/sanity/types";

type Bookshop = BOOKSHOPS_QUERY_RESULT[number];

function BookshopCard({
  bookshop,
  utmSettings,
  variant,
}: {
  bookshop: Bookshop;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromSocialLinks(
    bookshop.socialLinks,
    "bookshop",
    utmSettings
  );

  if (variant === "list") {
    return (
      <ResourceListItem href={href}>
        <span className="col-span-6">{bookshop.name}</span>
        <span className="col-span-3">
          <CityDisplay place={bookshop.place} />
        </span>
        <span className="col-span-3">
          <CountryDisplay place={bookshop.place} />
        </span>
      </ResourceListItem>
    );
  }

  return (
    <ResourceGridCard href={href}>
      <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
        <span className="font-medium">{bookshop.name}</span>
        <span className="text-muted-foreground text-sm">
          <LocationDisplay place={bookshop.place} />
        </span>
      </div>
    </ResourceGridCard>
  );
}

interface BookshopsContentProps {
  bookshops: BOOKSHOPS_QUERY_RESULT;
  enabledViews: ViewMode[];
  searchEnabled: boolean;
  utmSettings: UtmSettings;
}

export function BookshopsContent({
  bookshops,
  enabledViews,
  searchEnabled,
  utmSettings,
}: BookshopsContentProps) {
  const defaultView = enabledViews[0] ?? "list";
  const [view, setView] = useState<string>(defaultView);

  const markers = bookshops.flatMap((b) => {
    if (b.place?.lat == null || b.place.lng == null) {
      return [];
    }

    return [
      {
        id: b._id,
        name: b.name ?? "",
        lat: b.place.lat,
        lng: b.place.lng,
      },
    ];
  });

  return (
    <Tabs
      className="w-full gap-0"
      defaultValue={defaultView}
      onValueChange={setView}
    >
      <div className="sticky top-0 z-10 bg-background pt-16 pb-2.5">
        <div className="flex w-full items-center justify-between pb-2.5">
          {searchEnabled && <Input placeholder="Search" type="search" />}
          {enabledViews.length > 1 && (
            <TabsList>
              {enabledViews.includes("list") && (
                <TabsTrigger value="list">List</TabsTrigger>
              )}
              {enabledViews.includes("grid") && (
                <TabsTrigger value="grid">Grid</TabsTrigger>
              )}
              {enabledViews.includes("map") && (
                <TabsTrigger value="map">Map</TabsTrigger>
              )}
            </TabsList>
          )}
        </div>
        {view === "list" && enabledViews.includes("list") && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            <li className="col-span-8">Name</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
          </ul>
        )}
      </div>

      {enabledViews.includes("list") && (
        <TabsContent value="list">
          <section className="flex flex-col gap-1.5">
            {bookshops.length > 0 ? (
              bookshops.map((bookshop) => (
                <BookshopCard
                  bookshop={bookshop}
                  key={bookshop._id}
                  utmSettings={utmSettings}
                  variant="list"
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No bookshops available yet.
              </p>
            )}
          </section>
        </TabsContent>
      )}

      {enabledViews.includes("grid") && (
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-1.5">
            {bookshops.length > 0 ? (
              bookshops.map((bookshop) => (
                <BookshopCard
                  bookshop={bookshop}
                  key={bookshop._id}
                  utmSettings={utmSettings}
                  variant="grid"
                />
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">
                No bookshops available yet.
              </p>
            )}
          </div>
        </TabsContent>
      )}

      {enabledViews.includes("map") && (
        <TabsContent value="map">
          <ResourceMapView markers={markers} />
        </TabsContent>
      )}
    </Tabs>
  );
}
