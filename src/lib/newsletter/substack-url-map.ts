export interface SubstackUrlMapping {
  destination: string;
  note?: string;
  source: string;
}

export interface SubstackUrlMap {
  fallbackDestination?: string;
  mappings: SubstackUrlMapping[];
}

export class SubstackUrlMapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubstackUrlMapError";
  }
}

const JOURNAL_DESTINATION_REGEX = /^\/journal\/([^/]+)$/;
const PROJECT_DESTINATION_REGEX = /^\/projects\/([^/]+)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMappingEntry(entry: unknown, label: string): SubstackUrlMapping {
  if (!isRecord(entry)) {
    throw new SubstackUrlMapError(`${label}: entry must be an object`);
  }

  const { source, destination, note } = entry;

  if (typeof source !== "string" || source.trim() === "") {
    throw new SubstackUrlMapError(`${label}: source is required`);
  }

  if (typeof destination !== "string" || destination.trim() === "") {
    throw new SubstackUrlMapError(`${label}: destination is required`);
  }

  if (!source.startsWith("/")) {
    throw new SubstackUrlMapError(
      `${label}: source must start with / (${source})`
    );
  }

  if (!destination.startsWith("/")) {
    throw new SubstackUrlMapError(
      `${label}: destination must start with / (${destination})`
    );
  }

  if (note !== undefined && typeof note !== "string") {
    throw new SubstackUrlMapError(`${label}: note must be a string`);
  }

  return note === undefined
    ? { source, destination }
    : { source, destination, note };
}

export function validateSubstackUrlMapStructure(raw: unknown): SubstackUrlMap {
  if (!isRecord(raw)) {
    throw new SubstackUrlMapError("Substack URL map must be an object");
  }

  if (!Array.isArray(raw.mappings)) {
    throw new SubstackUrlMapError("Invalid map: mappings must be an array");
  }

  const { fallbackDestination } = raw;

  if (
    fallbackDestination !== undefined &&
    (typeof fallbackDestination !== "string" ||
      !fallbackDestination.startsWith("/"))
  ) {
    throw new SubstackUrlMapError(
      "fallbackDestination must start with / when provided"
    );
  }

  const seenSources = new Set<string>();
  const mappings = raw.mappings.map((entry, index) => {
    const mapping = readMappingEntry(entry, `mappings[${index}]`);

    if (seenSources.has(mapping.source)) {
      throw new SubstackUrlMapError(
        `mappings[${index}]: duplicate source ${mapping.source}`
      );
    }

    seenSources.add(mapping.source);
    return mapping;
  });

  return {
    mappings,
    ...(typeof fallbackDestination === "string" ? { fallbackDestination } : {}),
  };
}

export function parseDestinationPath(destination: string): {
  slug?: string;
  type: "journal" | "project" | "static";
} {
  const journalMatch = destination.match(JOURNAL_DESTINATION_REGEX);
  if (journalMatch) {
    return { type: "journal", slug: journalMatch[1] };
  }

  const projectMatch = destination.match(PROJECT_DESTINATION_REGEX);
  if (projectMatch) {
    return { type: "project", slug: projectMatch[1] };
  }

  return { type: "static" };
}
