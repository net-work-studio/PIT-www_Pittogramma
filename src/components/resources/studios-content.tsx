"use client";

import SanityImage from "@/components/modules/shared/sanity-image";
import { PlacesDisplay } from "@/components/resources/location-display";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import {
  type ResourceListColumn,
  ResourceViewTabs,
} from "@/components/resources/resource-view-tabs";
import { TagsDisplay } from "@/components/resources/tags-display";
import type { ViewMode } from "@/lib/feature-flags";
import { buildHrefFromUrl } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { STUDIOS_QUERY_RESULT } from "@/sanity/types";

type Studio = STUDIOS_QUERY_RESULT[number];

const LIST_COLUMNS: ResourceListColumn<Studio>[] = [
  {
    className: "col-span-4",
    getSortValue: (studio) => studio.name,
    id: "name",
    label: "Name",
  },
  {
    className: "col-span-2",
    getSortValue: (studio) => studio.category?.name,
    id: "category",
    label: "Category",
  },
  {
    className: "col-span-2",
    getSortValue: (studio) => studio.tags?.[0]?.name,
    id: "tag",
    label: "Tag",
  },
  {
    className: "col-span-2",
    getSortValue: (studio) => studio.places?.[0]?.city,
    id: "city",
    label: "City",
  },
  {
    className: "col-span-2",
    getSortValue: (studio) => studio.places?.[0]?.country,
    id: "country",
    label: "Country",
  },
];

function StudioCard({
  studio,
  utmSettings,
  variant,
}: {
  studio: Studio;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromUrl(studio.websiteUrl, "studio", utmSettings);

  if (variant === "list") {
    return (
      <ResourceListItem href={href}>
        <span className="col-span-4">{studio.name}</span>
        <span className="col-span-2">{studio.category?.name || "-"}</span>
        <span className="col-span-2">
          <TagsDisplay tags={studio.tags} />
        </span>
        <span className="col-span-2">
          <PlacesDisplay places={studio.places} showCountry={false} />
        </span>
        <span className="col-span-2">
          <PlacesDisplay places={studio.places} showCity={false} />
        </span>
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
            <PlacesDisplay places={studio.places} />
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
    <ResourceViewTabs
      emptyMessage="No studios or agencies available yet."
      enabledViews={enabledViews}
      items={studios}
      listColumns={LIST_COLUMNS}
      markers={markers}
      renderGridItem={(studio) => (
        <StudioCard
          key={studio._id}
          studio={studio}
          utmSettings={utmSettings}
          variant="grid"
        />
      )}
      renderListItem={(studio) => (
        <StudioCard
          key={studio._id}
          studio={studio}
          utmSettings={utmSettings}
          variant="list"
        />
      )}
      searchEnabled={searchEnabled}
    />
  );
}
