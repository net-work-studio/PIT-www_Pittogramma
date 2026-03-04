"use client";

import { useState } from "react";

import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { TagsDisplay } from "@/components/resources/tags-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TYPE_FOUNDRIES_QUERY_RESULT } from "@/sanity/types";

type TypeFoundry = TYPE_FOUNDRIES_QUERY_RESULT[number];

function getCities(places: TypeFoundry["places"]) {
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

function getCountries(places: TypeFoundry["places"]) {
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

function TypeFoundryListCard({ foundry }: { foundry: TypeFoundry }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{foundry.name}</li>
      <li className="col-span-4">
        <TagsDisplay tags={foundry.tags} />
      </li>
      <li className="col-span-2">{getCities(foundry.places)}</li>
      <li className="col-span-2">{getCountries(foundry.places)}</li>
    </ResourceListItem>
  );
}

function TypeFoundryGridCard({ foundry }: { foundry: TypeFoundry }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      <span className="font-medium">{foundry.name}</span>
      <span className="text-muted-foreground text-sm">
        <TagsDisplay tags={foundry.tags} />
      </span>
      <span className="text-sm">{getCities(foundry.places)}</span>
    </div>
  );
}

interface TypeFoundriesContentProps {
  foundries: TYPE_FOUNDRIES_QUERY_RESULT;
}

export function TypeFoundriesContent({
  foundries,
}: TypeFoundriesContentProps) {
  const [view, setView] = useState("list");

  const markers = foundries.flatMap((foundry) =>
    (foundry.places ?? [])
      .filter((p) => p?.lat != null && p?.lng != null)
      .map((p) => ({
        id: `${foundry._id}-${p._id}`,
        name: foundry.name ?? "",
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
            <li className="col-span-4">Tag</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
          </ul>
        )}
      </div>

      <TabsContent value="list">
        <section className="flex flex-col gap-1.5">
          {foundries.length > 0 ? (
            foundries.map((foundry) => (
              <TypeFoundryListCard foundry={foundry} key={foundry._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No type foundries available yet.
            </p>
          )}
        </section>
      </TabsContent>

      <TabsContent value="grid">
        <div className="grid grid-cols-4 gap-1.5">
          {foundries.length > 0 ? (
            foundries.map((foundry) => (
              <TypeFoundryGridCard foundry={foundry} key={foundry._id} />
            ))
          ) : (
            <p className="col-span-4 text-center text-muted-foreground">
              No type foundries available yet.
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
