"use client";

import { useState } from "react";

import { LanguagesDisplay } from "@/components/resources/languages-display";
import {
  CityDisplay,
  CountryDisplay,
  LocationDisplay,
} from "@/components/resources/location-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { INSTITUTES_QUERY_RESULT } from "@/sanity/types";

type Institute = INSTITUTES_QUERY_RESULT[number];

function InstituteListCard({ institute }: { institute: Institute }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{institute.name}</li>
      <li className="col-span-2">
        <LanguagesDisplay languages={institute.languages} />
      </li>
      <li className="col-span-2">
        <CityDisplay place={institute.place} />
      </li>
      <li className="col-span-2">
        <CountryDisplay place={institute.place} />
      </li>
      <li className="col-span-2">{institute.yearFoundation || "-"}</li>
    </ResourceListItem>
  );
}

function InstituteGridCard({ institute }: { institute: Institute }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      <span className="font-medium">{institute.name}</span>
      <span className="text-muted-foreground text-sm">
        <LanguagesDisplay languages={institute.languages} />
      </span>
      <span className="text-muted-foreground text-sm">
        <LocationDisplay place={institute.place} />
      </span>
      <span className="text-sm">{institute.yearFoundation || "-"}</span>
    </div>
  );
}

interface InstitutesContentProps {
  institutes: INSTITUTES_QUERY_RESULT;
}

export function InstitutesContent({ institutes }: InstitutesContentProps) {
  const [view, setView] = useState("list");

  const markers = institutes
    .filter((i) => i.place?.lat != null && i.place?.lng != null)
    .map((i) => ({
      id: i._id,
      name: i.name ?? "",
      lat: i.place.lat!,
      lng: i.place.lng!,
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
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Language</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
            <li className="col-span-2">Foundation</li>
          </ul>
        )}
      </div>

      <TabsContent value="list">
        <section className="flex flex-col gap-1.5">
          {institutes.length > 0 ? (
            institutes.map((institute) => (
              <InstituteListCard institute={institute} key={institute._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No institutes available yet.
            </p>
          )}
        </section>
      </TabsContent>

      <TabsContent value="grid">
        <div className="grid grid-cols-4 gap-1.5">
          {institutes.length > 0 ? (
            institutes.map((institute) => (
              <InstituteGridCard institute={institute} key={institute._id} />
            ))
          ) : (
            <p className="col-span-4 text-center text-muted-foreground">
              No institutes available yet.
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
