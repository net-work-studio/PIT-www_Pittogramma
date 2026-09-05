// biome-ignore-all lint: CLI utility script
/**
 * Creates a full Sanity production backup archive and a checksum manifest.
 *
 * Run with `bun run sanity:backup`. Set SANITY_BACKUP_OUTPUT_DIR to choose a
 * destination other than ./backups.
 */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const DATASET = "production";
const PROJECT_ID = "jfvmcjyl";

function backupTimestamp() {
  return new Date().toISOString().replaceAll(/[:.]/g, "-");
}

async function sha256(filePath: string) {
  const hash = createHash("sha256");

  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

async function main() {
  if (!process.env.SANITY_AUTH_TOKEN) {
    throw new Error("Missing SANITY_AUTH_TOKEN");
  }

  const outputDirectory =
    process.env.SANITY_BACKUP_OUTPUT_DIR ?? join(process.cwd(), "backups");
  const archivePath = join(
    outputDirectory,
    `sanity-${DATASET}-${backupTimestamp()}.tar.gz`
  );
  const manifestPath = `${archivePath}.sha256.json`;

  await mkdir(outputDirectory, { recursive: true });

  const command = Bun.spawn({
    cmd: [
      "node",
      "node_modules/@sanity/cli/bin/run.js",
      "datasets",
      "export",
      DATASET,
      archivePath,
      "--project-id",
      PROJECT_ID,
    ],
    env: process.env,
    stderr: "inherit",
    stdout: "inherit",
  });

  if ((await command.exited) !== 0) {
    throw new Error("Sanity dataset export failed");
  }

  const archive = await stat(archivePath);
  if (archive.size === 0) {
    throw new Error("Sanity dataset export produced an empty archive");
  }

  const manifest = {
    archive: basename(archivePath),
    bytes: archive.size,
    createdAt: new Date().toISOString(),
    dataset: DATASET,
    projectId: PROJECT_ID,
    sha256: await sha256(archivePath),
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Archive: ${archivePath}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
