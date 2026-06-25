"use client";

import { useState } from "react";
import SanityImage from "@/components/modules/shared/sanity-image";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { TagsDisplay } from "@/components/resources/tags-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/feature-flags";
import { buildHrefFromSocialLinks } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { STUDIOS_QUERY_RESULT } from "@/sanity/types";

type Studio = STUDIOS_QUERY_RESULT[number];

function getCities(places: Studio["places"]) {
  if (!places || places.length === 0) {
    return "-";
  }
  const uniqueCities = new Set<string>();
  for (const place of places) {
    if (place?.city) {
      uniqueCities.add(place.city);
    }
  }
  return uniqueCities.size > 0 ? Array.from(uniqueCities).join(", ") : "-";
}

function getCountries(places: Studio["places"]) {
  if (!places || places.length === 0) {
    return "-";
  }
  const uniqueCountries = new Set<string>();
  for (const place of places) {
    if (place?.country) {
      uniqueCountries.add(place.country);
    }
  }
  return uniqueCountries.size > 0
    ? Array.from(uniqueCountries).join(", ")
    : "-";
}

function StudioCard({
  studio,
  utmSettings,
  variant,
}: {
  studio: Studio;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromSocialLinks(
    studio.socialLinks,
    "studio",
    utmSettings
  );

  if (variant === "list") {
    return (
      <ResourceListItem href={href}>
        <span className="col-span-4">{studio.name}</span>
        <span className="col-span-2">{studio.category?.name || "-"}</span>
        <span className="col-span-2">
          <TagsDisplay tags={studio.tags} />
        </span>
        <span className="col-span-2">{getCities(studio.places)}</span>
        <span className="col-span-2">{getCountries(studio.places)}</span>
      </ResourceListItem>
    );
  }

  return (
    <ResourceGridCard href={href}>
      <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
        {studio.cover && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
            <SanityImage
              className="rounded-xl"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              source={studio.cover}
            />
          </div>
        )}
        {!studio.cover && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted" />
        )}
        <p className="flex justify-between">
          <span className="font-medium">{studio.name}</span>
          <span className="text-sm">
            {getCities(studio.places)}, {getCountries(studio.places)}
          </span>
        </p>
        <span className="text-muted-foreground text-sm">
          {studio.category?.name || "-"}, <TagsDisplay tags={studio.tags} />
        </span>
      </div>
    </ResourceGridCard>
  );
}

interface StudiosContentProps {
  enabledViews: ViewMode[];
  searchEnabled: boolean;
  studios: STUDIOS_QUERY_RESULT;
  utmSettings: UtmSettings;
}

export function StudiosContent({
  studios,
  enabledViews,
  searchEnabled,
  utmSettings,
}: StudiosContentProps) {
  const defaultView = enabledViews[0] ?? "list";
  const [view, setView] = useState<string>(defaultView);

  const markers = studios.flatMap((studio) =>
    (studio.places ?? []).flatMap((p) => {
      if (p?.lat == null || p.lng == null) {
        return [];
      }

      return [
        {
          id: `${studio._id}-${p._id}`,
          name: studio.name ?? "",
          lat: p.lat,
          lng: p.lng,
        },
      ];
    })
  );

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
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Category</li>
            <li className="col-span-2">Tag</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
          </ul>
        )}
      </div>

      {enabledViews.includes("list") && (
        <TabsContent value="list">
          <section className="flex flex-col gap-1.5">
            {studios.length > 0 ? (
              studios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  utmSettings={utmSettings}
                  variant="list"
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No studios or agencies available yet.
              </p>
            )}
          </section>
        </TabsContent>
      )}

      {enabledViews.includes("grid") && (
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-1.5">
            {studios.length > 0 ? (
              studios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  utmSettings={utmSettings}
                  variant="grid"
                />
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">
                No studios or agencies available yet.
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
