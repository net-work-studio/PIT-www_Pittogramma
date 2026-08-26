import { resources } from "@/components/navigation/resources-navigation.data";

export type ResourceKey = (typeof resources)[number]["key"];
export type ViewMode = "list" | "grid" | "map";

interface ResourceSettings {
  enabledViews?: readonly string[] | null;
  published?: boolean | null;
  searchEnabled?: boolean | null;
}

export interface FeatureAvailabilitySettings {
  indexAvailability?: {
    bibliography?: Pick<ResourceSettings, "published"> | null;
    bookshops?: ResourceSettings | null;
    glossary?: Pick<ResourceSettings, "published" | "searchEnabled"> | null;
    headerSearchEnabled?: boolean | null;
    institutes?: ResourceSettings | null;
    studiosAgencies?: ResourceSettings | null;
    typeFoundries?: ResourceSettings | null;
    websites?: ResourceSettings | null;
  } | null;
}

interface ResourceDefinition {
  settingsKey?: keyof NonNullable<
    FeatureAvailabilitySettings["indexAvailability"]
  >;
  supportedViews: readonly ViewMode[];
  supportsSearch: boolean;
}

export interface ResourceAvailability {
  enabledViews: ViewMode[];
  published: boolean;
  searchEnabled: boolean;
}

export interface FeatureAvailability {
  headerSearchEnabled: boolean;
  resources: Record<ResourceKey, ResourceAvailability>;
}

const resourceDefinitions: Record<ResourceKey, ResourceDefinition> = {
  bibliography: {
    supportedViews: [],
    supportsSearch: false,
  },
  bookshops: {
    settingsKey: "bookshops",
    supportedViews: ["list", "grid", "map"],
    supportsSearch: true,
  },
  glossary: {
    settingsKey: "glossary",
    supportedViews: [],
    supportsSearch: true,
  },
  institutes: {
    settingsKey: "institutes",
    supportedViews: ["list", "grid", "map"],
    supportsSearch: true,
  },
  "studios-agencies": {
    settingsKey: "studiosAgencies",
    supportedViews: ["list", "grid", "map"],
    supportsSearch: true,
  },
  "type-foundries": {
    settingsKey: "typeFoundries",
    supportedViews: ["list", "grid", "map"],
    supportsSearch: true,
  },
  websites: {
    settingsKey: "websites",
    supportedViews: ["list", "grid"],
    supportsSearch: true,
  },
};

function getEnabledViews(
  configuredViews: readonly string[] | null | undefined,
  supportedViews: readonly ViewMode[]
): ViewMode[] {
  if (supportedViews.length === 0) {
    return [];
  }

  if (!configuredViews) {
    return [...supportedViews];
  }

  const enabledViews = supportedViews.filter((view) =>
    configuredViews.includes(view)
  );

  return enabledViews.length > 0 ? enabledViews : [supportedViews[0]];
}

/**
 * Resolves public Index capabilities from Site Settings. Missing fields retain
 * the legacy all-enabled behavior while existing documents are migrated.
 */
export function getFeatureAvailability(
  settings: FeatureAvailabilitySettings | null | undefined
): FeatureAvailability {
  const indexAvailability = settings?.indexAvailability;
  const resourceAvailability = {} as Record<ResourceKey, ResourceAvailability>;

  for (const resource of resources) {
    const definition = resourceDefinitions[resource.key];
    const configuredAvailability = definition.settingsKey
      ? indexAvailability?.[definition.settingsKey]
      : undefined;
    const configuredResource = configuredAvailability as
      | ResourceSettings
      | null
      | undefined;

    resourceAvailability[resource.key] = {
      enabledViews: getEnabledViews(
        configuredResource?.enabledViews,
        definition.supportedViews
      ),
      published:
        resource.key === "bibliography" ||
        configuredResource?.published !== false,
      searchEnabled:
        definition.supportsSearch &&
        configuredResource?.searchEnabled !== false,
    };
  }

  return {
    headerSearchEnabled: indexAvailability?.headerSearchEnabled !== false,
    resources: resourceAvailability,
  };
}

export function getEnabledResources(availability: FeatureAvailability) {
  return resources.filter(
    (resource) => availability.resources[resource.key].published
  );
}
