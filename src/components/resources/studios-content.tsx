"use client";

import { useState } from "react";
import SanityImage from "@/components/modules/shared/sanity-image";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { TagsDisplay } from "@/components/resources/tags-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function StudioListCard({ studio }: { studio: Studio }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{studio.name}</li>
      <li className="col-span-2">{studio.category?.name || "-"}</li>
      <li className="col-span-2">
        <TagsDisplay tags={studio.tags} />
      </li>
      <li className="col-span-2">{getCities(studio.places)}</li>
      <li className="col-span-2">{getCountries(studio.places)}</li>
    </ResourceListItem>
  );
}

function StudioGridCard({ studio }: { studio: Studio }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      {studio.cover && (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md">
          <SanityImage
            className="rounded-md"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            source={studio.cover}
          />
        </div>
      )}
      {!studio.cover && (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-muted" />
      )}
      <p className="flex justify-between">
        <span className="font-medium">{studio.name}</span>
        <span className="text-sm">
          {getCities(studio.places)}, {getCountries(studio.places)}
        </span>
      </p>
      <span className="text-muted-foreground text-sm">
        {studio.category?.name || "-"},{" "}
        <TagsDisplay tags={studio.tags} />
      </span>
    </div>
  );
}

interface StudiosContentProps {
  studios: STUDIOS_QUERY_RESULT;
}

export function StudiosContent({ studios }: StudiosContentProps) {
  const [view, setView] = useState("list");

  const markers = studios.flatMap((studio) =>
    (studio.places ?? [])
      .filter((p) => p?.lat != null && p?.lng != null)
      .map((p) => ({
        id: `${studio._id}-${p._id}`,
        name: studio.name ?? "",
        lat: p.lat!,
        lng: p.lng!,
      }))
  );

  return (
    <Tabs className="w-full gap-0" defaultValue="list" onValueChange={setView}>
      <div className="sticky top-0 z-10 bg-background pt-16 pb-2.5">
        <div className="flex w-full items-center justify-between pb-2.5">
          <Input placeholder="Search" type="search" />
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </div>
        {view === "list" && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Category</li>
            <li className="col-span-2">Tag</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
          </ul>
        )}
      </div>

      <TabsContent value="list">
        <section className="flex flex-col gap-1.5">
          {studios.length > 0 ? (
            studios.map((studio) => (
              <StudioListCard key={studio._id} studio={studio} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No studios or agencies available yet.
            </p>
          )}
        </section>
      </TabsContent>

      <TabsContent value="grid">
        <div className="grid grid-cols-4 gap-1.5">
          {studios.length > 0 ? (
            studios.map((studio) => (
              <StudioGridCard key={studio._id} studio={studio} />
            ))
          ) : (
            <p className="col-span-4 text-center text-muted-foreground">
              No studios or agencies available yet.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="map">
        <ResourceMapView markers={markers} />
      </TabsContent>
    </Tabs>
  );
}
