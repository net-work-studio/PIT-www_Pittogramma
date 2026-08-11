"use client";

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
import type { WEB_SOURCES_QUERY_RESULT } from "@/sanity/types";

type WebSource = WEB_SOURCES_QUERY_RESULT[number];

const WWW_PREFIX_REGEX = /^www\./;

const LIST_COLUMNS: ResourceListColumn<WebSource>[] = [
  {
    className: "col-span-4",
    getSortValue: (source) => source.name,
    id: "name",
    label: "Name",
  },
  {
    className: "col-span-2",
    getSortValue: (source) => source.category?.name,
    id: "category",
    label: "Category",
  },
  {
    className: "col-span-2",
    getSortValue: (source) => source.tags?.[0]?.name,
    id: "tag",
    label: "Tag",
  },
  {
    className: "col-span-4",
    getSortValue: (source) =>
      source.sourceUrl ? formatUrl(source.sourceUrl) : undefined,
    id: "website",
    label: "Website",
  },
];

function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(WWW_PREFIX_REGEX, "");
  } catch {
    return url;
  }
}

function WebSourceCard({
  source,
  utmSettings,
  variant,
}: {
  source: WebSource;
  utmSettings: UtmSettings;
  variant: "grid" | "list";
}) {
  const href = buildHrefFromUrl(source.sourceUrl, "website", utmSettings);
  const displayUrl = source.sourceUrl ? formatUrl(source.sourceUrl) : "-";

  if (variant === "list") {
    return (
      <ResourceListItem href={href}>
        <span className="col-span-4">{source.name}</span>
        <span className="col-span-2">{source.category?.name || "-"}</span>
        <span className="col-span-2">
          <TagsDisplay tags={source.tags} />
        </span>
        <span className="col-span-4">{displayUrl}</span>
      </ResourceListItem>
    );
  }

  return (
    <ResourceGridCard href={href}>
      <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
        <span className="font-medium">{source.name}</span>
        <span className="text-muted-foreground text-sm">
          {source.category?.name || "-"}
        </span>
        <span className="text-muted-foreground text-sm">
          <TagsDisplay tags={source.tags} />
        </span>
        <span className="text-sm">{displayUrl}</span>
      </div>
    </ResourceGridCard>
  );
}

interface WebsitesContentProps {
  enabledViews: ViewMode[];
  searchEnabled: boolean;
  sources: WEB_SOURCES_QUERY_RESULT;
  utmSettings: UtmSettings;
}

export function WebsitesContent({
  sources,
  enabledViews,
  searchEnabled,
  utmSettings,
}: WebsitesContentProps) {
  return (
    <ResourceViewTabs
      emptyMessage="No websites available yet."
      enabledViews={enabledViews}
      items={sources}
      listColumns={LIST_COLUMNS}
      renderGridItem={(source) => (
        <WebSourceCard
          key={source._id}
          source={source}
          utmSettings={utmSettings}
          variant="grid"
        />
      )}
      renderListItem={(source) => (
        <WebSourceCard
          key={source._id}
          source={source}
          utmSettings={utmSettings}
          variant="list"
        />
      )}
      searchEnabled={searchEnabled}
    />
  );
}
