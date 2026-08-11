"use client";

import {
  LocationDisplay,
  PlacesDisplay,
} from "@/components/resources/location-display";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import {
  type ResourceListColumn,
  ResourceViewTabs,
} from "@/components/resources/resource-view-tabs";
import type { ViewMode } from "@/lib/feature-flags";
import { buildHrefFromUrl } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { BOOKSHOPS_QUERY_RESULT } from "@/sanity/types";

type Bookshop = BOOKSHOPS_QUERY_RESULT[number];

const LIST_COLUMNS: ResourceListColumn<Bookshop>[] = [
  {
    className: "col-span-8",
    getSortValue: (bookshop) => bookshop.name,
    id: "name",
    label: "Name",
  },
  {
    className: "col-span-2",
    getSortValue: (bookshop) => bookshop.place?.city,
    id: "city",
    label: "City",
  },
  {
    className: "col-span-2",
    getSortValue: (bookshop) => bookshop.place?.country,
    id: "country",
    label: "Country",
  },
];

function BookshopCard({
  bookshop,
  utmSettings,
  variant,
}: {
  bookshop: Bookshop;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromUrl(bookshop.websiteUrl, "bookshop", utmSettings);
  const places = bookshop.place ? [bookshop.place] : undefined;

  if (variant === "list") {
    return (
      <ResourceListItem href={href}>
        <span className="col-span-8">{bookshop.name}</span>
        <span className="col-span-2">
          <PlacesDisplay places={places} showCountry={false} />
        </span>
        <span className="col-span-2">
          <PlacesDisplay places={places} showCity={false} />
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
    <ResourceViewTabs
      emptyMessage="No bookshops available yet."
      enabledViews={enabledViews}
      items={bookshops}
      listColumns={LIST_COLUMNS}
      markers={markers}
      renderGridItem={(bookshop) => (
        <BookshopCard
          bookshop={bookshop}
          key={bookshop._id}
          utmSettings={utmSettings}
          variant="grid"
        />
      )}
      renderListItem={(bookshop) => (
        <BookshopCard
          bookshop={bookshop}
          key={bookshop._id}
          utmSettings={utmSettings}
          variant="list"
        />
      )}
      searchEnabled={searchEnabled}
    />
  );
}
