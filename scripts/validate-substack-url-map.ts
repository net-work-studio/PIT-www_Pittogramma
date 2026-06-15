// biome-ignore-all lint: CLI utility script
/**
 * Validate Substack → website URL mappings against Sanity content.
 *
 * Run with:
 *   bun run scripts/validate-substack-url-map.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

interface SubstackUrlMapping {
  destination: string;
  note?: string;
  source: string;
}

interface SubstackUrlMap {
  fallbackDestination?: string;
  mappings: SubstackUrlMapping[];
}

const MAP_PATH = join(process.cwd(), "data/substack-url-map.json");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!(projectId && dataset)) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-06-03",
  useCdn: false,
});

const JOURNAL_SLUGS_QUERY = `*[_type == "journal" && defined(slug.current)].slug.current`;
const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)].slug.current`;

function loadMap(): SubstackUrlMap {
  if (!existsSync(MAP_PATH)) {
    throw new Error(`Mapping file not found: ${MAP_PATH}`);
  }

  const parsed = JSON.parse(readFileSync(MAP_PATH, "utf-8")) as SubstackUrlMap;

  if (!Array.isArray(parsed.mappings)) {
    throw new Error("Invalid map: mappings must be an array");
  }

  return parsed;
}

function parseDestinationPath(destination: string): {
  type: "journal" | "project" | "static";
  slug?: string;
} {
  const journalMatch = destination.match(/^\/journal\/([^/]+)$/);
  if (journalMatch) {
    return { type: "journal", slug: journalMatch[1] };
  }

  const projectMatch = destination.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    return { type: "project", slug: projectMatch[1] };
  }

  return { type: "static" };
}

async function main() {
  const map = loadMap();
  const [journalSlugs, projectSlugs] = await Promise.all([
    client.fetch<string[]>(JOURNAL_SLUGS_QUERY),
    client.fetch<string[]>(PROJECT_SLUGS_QUERY),
  ]);

  const journalSet = new Set(journalSlugs);
  const projectSet = new Set(projectSlugs);
  const seenSources = new Set<string>();
  const errors: string[] = [];

  if (map.mappings.length === 0) {
    console.warn(
      "No mappings defined yet. Add entries to data/substack-url-map.json before launch."
    );
  }

  for (const [index, entry] of map.mappings.entries()) {
    const label = `mappings[${index}]`;

    if (!(entry.source && entry.destination)) {
      errors.push(`${label}: source and destination are required`);
      continue;
    }

    if (!entry.source.startsWith("/")) {
      errors.push(`${label}: source must start with / (${entry.source})`);
    }

    if (!entry.destination.startsWith("/")) {
      errors.push(
        `${label}: destination must start with / (${entry.destination})`
      );
    }

    if (seenSources.has(entry.source)) {
      errors.push(`${label}: duplicate source ${entry.source}`);
    }
    seenSources.add(entry.source);

    const parsed = parseDestinationPath(entry.destination);

    if (parsed.type === "journal" && parsed.slug) {
      if (!journalSet.has(parsed.slug)) {
        errors.push(
          `${label}: journal slug not found in Sanity (${parsed.slug})`
        );
      }
    }

    if (parsed.type === "project" && parsed.slug) {
      if (!projectSet.has(parsed.slug)) {
        errors.push(
          `${label}: project slug not found in Sanity (${parsed.slug})`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("Validation failed:\n");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated ${map.mappings.length} mapping(s) against ${journalSlugs.length} journal and ${projectSlugs.length} project slug(s).`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
