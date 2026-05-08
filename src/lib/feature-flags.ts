import { resources } from "@/components/navigation/resources-navigation.data";

type ResourceKey =
  | "bibliography"
  | "bookshops"
  | "glossary"
  | "institutes"
  | "studios-agencies"
  | "type-foundries"
  | "websites";

export type ViewMode = "list" | "grid" | "map";

const envMap: Record<ResourceKey, string> = {
  bibliography: "NEXT_PUBLIC_FEATURE_BIBLIOGRAPHY",
  bookshops: "NEXT_PUBLIC_FEATURE_BOOKSHOPS",
  glossary: "NEXT_PUBLIC_FEATURE_GLOSSARY",
  institutes: "NEXT_PUBLIC_FEATURE_INSTITUTES",
  "studios-agencies": "NEXT_PUBLIC_FEATURE_STUDIOS_AGENCIES",
  "type-foundries": "NEXT_PUBLIC_FEATURE_TYPE_FOUNDRIES",
  websites: "NEXT_PUBLIC_FEATURE_WEBSITES",
};

/** Which view modes each resource supports. */
const resourceViews: Partial<Record<ResourceKey, ViewMode[]>> = {
  bibliography: ["list", "grid"],
  bookshops: ["list", "grid", "map"],
  institutes: ["list", "grid", "map"],
  "studios-agencies": ["list", "grid", "map"],
  "type-foundries": ["list", "grid", "map"],
  websites: ["list", "grid"],
};

/**
 * Derives the env var name for a resource + view combination.
 * e.g. ("studios-agencies", "map") → "NEXT_PUBLIC_FEATURE_STUDIOS_AGENCIES_MAP"
 */
function viewEnvVar(resourceKey: ResourceKey, view: ViewMode): string {
  const base = envMap[resourceKey]; // e.g. "NEXT_PUBLIC_FEATURE_STUDIOS_AGENCIES"
  return `${base}_${view.toUpperCase()}`; // e.g. "NEXT_PUBLIC_FEATURE_STUDIOS_AGENCIES_MAP"
}

/** Returns `true` unless the env var is explicitly set to `"false"`. */
export function isResourceEnabled(key: ResourceKey): boolean {
  const envVar = envMap[key];
  return process.env[envVar] !== "false";
}

/** The resources list filtered to only enabled pages. */
export function getEnabledResources() {
  return resources.filter((r) => isResourceEnabled(r.key));
}

/**
 * Returns the list of enabled view modes for a resource.
 * A view defaults to enabled unless its env var is explicitly `"false"`.
 * Only returns views the resource actually supports.
 */
export function getEnabledViews(key: ResourceKey): ViewMode[] {
  const views = resourceViews[key];
  if (!views) return [];
  const enabled = views.filter((v) => process.env[viewEnvVar(key, v)] !== "false");
  return enabled.length > 0 ? enabled : [views[0]];
}

/**
 * Whether search is enabled for a resource.
 * Checks `NEXT_PUBLIC_FEATURE_{RESOURCE}_SEARCH`.
 * Defaults to enabled.
 */
export function isSearchEnabled(key: ResourceKey): boolean {
  return process.env[`${envMap[key]}_SEARCH`] !== "false";
}

/**
 * Whether the global search button in the header is enabled.
 * Checks `NEXT_PUBLIC_FEATURE_HEADER_SEARCH`.
 * Defaults to enabled.
 */
export function isHeaderSearchEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_HEADER_SEARCH !== "false";
}
