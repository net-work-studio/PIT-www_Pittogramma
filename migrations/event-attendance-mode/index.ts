// biome-ignore-all lint: one-off migration script kept outside app runtime
/**
 * Migration: Set `attendanceMode` on all events and normalise online events.
 *
 * Rules:
 * - locationName matches /^online$/i → attendanceMode: "online", unset location fields
 * - title contains "online" (case-insensitive) → attendanceMode: "online", unset location fields
 * - everything else → attendanceMode: "offline" (keeps existing location fields)
 *
 * Run:
 *   bunx sanity exec migrations/event-attendance-mode/index.ts
 *   bunx sanity exec migrations/event-attendance-mode/index.ts -- --write
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createClient } from "@sanity/client";

const sanityConfig = JSON.parse(
  readFileSync(path.join(homedir(), ".config", "sanity", "config.json"), "utf8")
);

const isWrite = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jfvmcjyl",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-12-18",
  token:
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    sanityConfig.authToken,
  useCdn: false,
});

interface EventDoc {
  _id: string;
  attendanceMode?: string | null;
  locationAddress?: string | null;
  locationName?: string | null;
  title?: string | null;
}

function isOnlineLocationName(name: string | null | undefined): boolean {
  return name?.trim().toLowerCase() === "online";
}

function isOnlineTitle(title: string | null | undefined): boolean {
  return title?.toLowerCase().includes("online") ?? false;
}

function resolveAttendanceMode(doc: EventDoc): "online" | "offline" {
  if (isOnlineLocationName(doc.locationName) || isOnlineTitle(doc.title)) {
    return "online";
  }

  if (doc.attendanceMode === "online" || doc.attendanceMode === "offline") {
    return doc.attendanceMode;
  }

  return "offline";
}

async function run() {
  const docs: EventDoc[] = await client.fetch(
    `*[_type == "event" && !(_id in path("drafts.**"))]{
      _id,
      title,
      attendanceMode,
      locationName,
      locationAddress
    }`
  );

  if (docs.length === 0) {
    console.log("No events found.");
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const attendanceMode = resolveAttendanceMode(doc);
    const shouldClearLocation = attendanceMode === "online";
    const needsMode = doc.attendanceMode !== attendanceMode;
    const needsLocationClear =
      shouldClearLocation &&
      (Boolean(doc.locationName) || Boolean(doc.locationAddress));

    if (!(needsMode || needsLocationClear)) {
      skipped++;
      continue;
    }

    const label = doc.title ?? doc._id;
    console.log(
      `${isWrite ? "PATCH" : "DRY-RUN"} ${label}: attendanceMode=${attendanceMode}${shouldClearLocation ? " (clear location)" : ""}`
    );

    if (isWrite) {
      let patch = client.patch(doc._id).set({ attendanceMode });

      if (shouldClearLocation) {
        patch = patch.unset(["locationName", "locationAddress"]);
      }

      await patch.commit();
    }

    updated++;
  }

  console.log(
    `\nDone. ${updated} to update, ${skipped} already correct.${isWrite ? "" : " Re-run with --write to apply."}`
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
