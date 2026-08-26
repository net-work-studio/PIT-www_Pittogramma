"use client";

import { PlacesDisplay } from "@/components/resources/location-display";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { ResourceMobileCard } from "@/components/resources/resource-mobile-card";
import {
  type ResourceListColumn,
  ResourceViewTabs,
} from "@/components/resources/resource-view-tabs";
import { TagsDisplay } from "@/components/resources/tags-display";
import type { ViewMode } from "@/lib/feature-availability";
import { buildHrefFromUrl } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { TYPE_FOUNDRIES_QUERY_RESULT } from "@/sanity/types";

type TypeFoundry = TYPE_FOUNDRIES_QUERY_RESULT[number];

const LIST_COLUMNS: ResourceListColumn<TypeFoundry>[] = [
  {
    className: "col-span-8",
    getSortValue: (foundry) => foundry.name,
    id: "name",
    label: "Name",
  },
  {
    className: "col-span-2",
    getSortValue: (foundry) => foundry.places?.[0]?.city,
    id: "city",
    label: "City",
  },
  {
    className: "col-span-2",
    getSortValue: (foundry) => foundry.places?.[0]?.country,
    id: "country",
    label: "Country",
  },
];

function TypeFoundryCard({
  foundry,
  utmSettings,
  variant,
}: {
  foundry: TypeFoundry;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromUrl(
    foundry.websiteUrl,
    "type-foundry",
    utmSettings
  );

  if (variant === "list") {
    return (
      <ResourceListItem
        href={href}
        mobileContent={
          <ResourceMobileCard
            badge={
              foundry.tags?.length ? (
                <TagsDisplay tags={foundry.tags} />
              ) : undefined
            }
            fields={[
              {
                label: "City",
                value: (
                  <PlacesDisplay
                    places={foundry.places}
                    showCountry={false}
                  />
                ),
              },
              {
                label: "Country",
                value: (
                  <PlacesDisplay places={foundry.places} showCity={false} />
                ),
              },
            ]}
            name={foundry.name}
          />
        }
      >
        <span className="col-span-8">{foundry.name}</span>
        <span className="col-span-2">
          <PlacesDisplay places={foundry.places} showCountry={false} />
        </span>
        <span className="col-span-2">
          <PlacesDisplay places={foundry.places} showCity={false} />
        </span>
      </ResourceListItem>
    );
  }

  return (
    <ResourceGridCard href={href}>
      <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
        <span className="font-medium">{foundry.name}</span>
        <span className="text-muted-foreground text-sm">
          <TagsDisplay tags={foundry.tags} />
        </span>
        <span className="text-sm">
          <PlacesDisplay places={foundry.places} />
        </span>
      </div>
    </ResourceGridCard>
  );
}

interface TypeFoundriesContentProps {
  enabledViews: ViewMode[];
  foundries: TYPE_FOUNDRIES_QUERY_RESULT;
  searchEnabled: boolean;
  utmSettings: UtmSettings;
}

export function TypeFoundriesContent({
  foundries,
  enabledViews,
  searchEnabled,
  utmSettings,
}: TypeFoundriesContentProps) {
  const markers = foundries.flatMap((foundry) =>
    (foundry.places ?? []).flatMap((p) => {
      if (p?.lat == null || p.lng == null) {
        return [];
      }

      return [
        {
          id: `${foundry._id}-${p._id}`,
          name: foundry.name ?? "",
          lat: p.lat,
          lng: p.lng,
        },
      ];
    })
  );

  return (
    <ResourceViewTabs
      emptyMessage="No type foundries available yet."
      enabledViews={enabledViews}
      items={foundries}
      listColumns={LIST_COLUMNS}
      markers={markers}
      renderGridItem={(foundry) => (
        <TypeFoundryCard
          foundry={foundry}
          key={foundry._id}
          utmSettings={utmSettings}
          variant="grid"
        />
      )}
      renderListItem={(foundry) => (
        <TypeFoundryCard
          foundry={foundry}
          key={foundry._id}
          utmSettings={utmSettings}
          variant="list"
        />
      )}
      searchEnabled={searchEnabled}
    />
  );
}
