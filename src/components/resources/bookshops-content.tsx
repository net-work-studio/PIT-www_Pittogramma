"use client";

import { useState } from "react";

import {
  CityDisplay,
  CountryDisplay,
  LocationDisplay,
} from "@/components/resources/location-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BOOKSHOPS_QUERY_RESULT } from "@/sanity/types";

type Bookshop = BOOKSHOPS_QUERY_RESULT[number];

function BookshopListCard({ bookshop }: { bookshop: Bookshop }) {
  return (
    <ResourceListItem>
      <li className="col-span-6">{bookshop.name}</li>
      <li className="col-span-3">
        <CityDisplay place={bookshop.place} />
      </li>
      <li className="col-span-3">
        <CountryDisplay place={bookshop.place} />
      </li>
    </ResourceListItem>
  );
}

function BookshopGridCard({ bookshop }: { bookshop: Bookshop }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      <span className="font-medium">{bookshop.name}</span>
      <span className="text-muted-foreground text-sm">
        <LocationDisplay place={bookshop.place} />
      </span>
    </div>
  );
}

interface BookshopsContentProps {
  bookshops: BOOKSHOPS_QUERY_RESULT;
}

export function BookshopsContent({ bookshops }: BookshopsContentProps) {
  const [view, setView] = useState("list");

  const markers = bookshops
    .filter((b) => b.place?.lat != null && b.place?.lng != null)
    .map((b) => ({
      id: b._id,
      name: b.name ?? "",
      lat: b.place.lat!,
      lng: b.place.lng!,
    }));

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
            <li className="col-span-6">Name</li>
            <li className="col-span-3">City</li>
            <li className="col-span-3">Country</li>
          </ul>
        )}
      </div>

      <TabsContent value="list">
        <section className="flex flex-col gap-1.5">
          {bookshops.length > 0 ? (
            bookshops.map((bookshop) => (
              <BookshopListCard bookshop={bookshop} key={bookshop._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No bookshops available yet.
            </p>
          )}
        </section>
      </TabsContent>

      <TabsContent value="grid">
        <div className="grid grid-cols-4 gap-1.5">
          {bookshops.length > 0 ? (
            bookshops.map((bookshop) => (
              <BookshopGridCard bookshop={bookshop} key={bookshop._id} />
            ))
          ) : (
            <p className="col-span-4 text-center text-muted-foreground">
              No bookshops available yet.
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
