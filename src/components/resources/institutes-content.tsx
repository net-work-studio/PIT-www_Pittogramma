"use client";

import { LanguagesDisplay } from "@/components/resources/languages-display";
import {
  LocationDisplay,
  PlacesDisplay,
} from "@/components/resources/location-display";
import { ResourceGridCard } from "@/components/resources/resource-grid-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { ResourceMobileCard } from "@/components/resources/resource-mobile-card";
import {
  type ResourceListColumn,
  ResourceViewTabs,
} from "@/components/resources/resource-view-tabs";
import type { ViewMode } from "@/lib/feature-availability";
import { getInstituteMarkers } from "@/lib/institute-map-markers";
import { buildHrefFromUrl } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { INSTITUTES_QUERY_RESULT } from "@/sanity/types";

type Institute = INSTITUTES_QUERY_RESULT[number];

const LIST_COLUMNS: ResourceListColumn<Institute>[] = [
  {
    className: "col-span-4",
    getSortValue: (institute) => institute.name,
    id: "name",
    label: "Name",
  },
  {
    className: "col-span-2",
    getSortValue: (institute) => institute.languages?.[0]?.name,
    id: "language",
    label: "Language",
  },
  {
    className: "col-span-2",
    getSortValue: (institute) => institute.yearFoundation,
    id: "since",
    label: "Since",
  },
  {
    className: "col-span-2",
    getSortValue: (institute) => institute.place?.city,
    id: "city",
    label: "City",
  },
  {
    className: "col-span-2",
    getSortValue: (institute) => institute.place?.country,
    id: "country",
    label: "Country",
  },
];

function InstituteCard({
  institute,
  utmSettings,
  variant,
}: {
  institute: Institute;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromUrl(institute.websiteUrl, "institute", utmSettings);
  const places = institute.place ? [institute.place] : undefined;

  if (variant === "list") {
    return (
      <ResourceListItem
        href={href}
        mobileContent={
          <ResourceMobileCard
            fields={[
              {
                label: "Language",
                value: <LanguagesDisplay languages={institute.languages} />,
              },
              { label: "Since", value: institute.yearFoundation || "-" },
              {
                label: "City",
                value: <PlacesDisplay places={places} showCountry={false} />,
              },
              {
                label: "Country",
                value: <PlacesDisplay places={places} showCity={false} />,
              },
            ]}
            name={institute.name}
          />
        }
      >
        <span className="col-span-4">{institute.name}</span>
        <span className="col-span-2">
          <LanguagesDisplay languages={institute.languages} />
        </span>
        <span className="col-span-2">{institute.yearFoundation || "-"}</span>
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
        <span className="font-medium">{institute.name}</span>
        <span className="text-muted-foreground text-sm">
          <LanguagesDisplay languages={institute.languages} />
        </span>
        <span className="text-muted-foreground text-sm">
          <LocationDisplay place={institute.place} />
        </span>
        <span className="text-sm">{institute.yearFoundation || "-"}</span>
      </div>
    </ResourceGridCard>
  );
}

interface InstitutesContentProps {
  enabledViews: ViewMode[];
  institutes: INSTITUTES_QUERY_RESULT;
  searchEnabled: boolean;
  utmSettings: UtmSettings;
}

export function InstitutesContent({
  institutes,
  enabledViews,
  searchEnabled,
  utmSettings,
}: InstitutesContentProps) {
  const markers = getInstituteMarkers(institutes);

  return (
    <ResourceViewTabs
      emptyMessage="No institutes available yet."
      enabledViews={enabledViews}
      items={institutes}
      listColumns={LIST_COLUMNS}
      markers={markers}
      renderGridItem={(institute) => (
        <InstituteCard
          institute={institute}
          key={institute._id}
          utmSettings={utmSettings}
          variant="grid"
        />
      )}
      renderListItem={(institute) => (
        <InstituteCard
          institute={institute}
          key={institute._id}
          utmSettings={utmSettings}
          variant="list"
        />
      )}
      searchEnabled={searchEnabled}
    />
  );
}
