/**
 * Import projects from Kirby CMS data to Sanity
 *
 * Run with:
 *   bun run scripts/import-projects.ts
 *   bun run scripts/import-projects.ts --dry-run
 *   bun run scripts/import-projects.ts --only=1_iconocracy
 *   bun run scripts/import-projects.ts --skip-images
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

// --- SEO descriptions fallback (generated, not from source data) ---

const seoDescPath = join(process.cwd(), "scripts/data/seo-descriptions.json");
const seoDescriptions: Record<string, string> = existsSync(seoDescPath)
  ? JSON.parse(readFileSync(seoDescPath, "utf-8"))
  : {};

// --- CLI Flags ---

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SKIP_IMAGES = args.includes("--skip-images");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];

// --- Sanity Client ---

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!(projectId && dataset && token)) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-12-18",
  useCdn: false,
});

// --- Constants ---

const PROJECTS_DIR = join(process.cwd(), "DATA_IMPORT/1_progetti");
const IMAGE_UPLOAD_DELAY = 300;

const INSTITUTE_ALIASES: Record<string, string> = {
  "ISIA Uribno": "ISIA Urbino",
  "IUAV": "Università IUAV di Venezia",
  "Universita luav di Venezia": "Università IUAV di Venezia",
  "ABA Palermo": "Accademia di Belle Arti di Palermo",
  "Abadir, Accademia di Design e Comunicazione Visiva": "Abadir",
};

// --- Helpers ---

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeName(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

// --- Kirby File Parser ---

function parseKirbyFile(content: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const sections = content.split("\n\n----\n\n");

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    fields[key] = value;
  }

  return fields;
}

// --- UUID → File Resolution ---

interface ImageMeta {
  filePath: string;
  caption: string;
  alt: string;
}

async function buildUuidMap(
  folderPath: string
): Promise<Map<string, ImageMeta>> {
  const files = await readdir(folderPath);
  const map = new Map<string, ImageMeta>();

  for (const file of files) {
    if (!file.endsWith(".it.txt") || file === "project.it.txt") continue;

    const metaPath = join(folderPath, file);
    const content = await readFile(metaPath, "utf-8");
    const fields = parseKirbyFile(content);

    if (fields.Uuid) {
      const imageFile = file.replace(".it.txt", "");
      map.set(fields.Uuid, {
        filePath: join(folderPath, imageFile),
        caption: fields.Caption || "",
        alt: fields.Alt || "",
      });
    }
  }

  return map;
}

function resolveFileUuid(ref: string): string | null {
  const match = ref.match(/file:\/\/(\S+)/);
  return match ? match[1] : null;
}

// --- Image Upload ---

const uploadedImageCache = new Map<string, string>();

async function uploadImage(filePath: string): Promise<string | null> {
  if (SKIP_IMAGES) return null;

  if (uploadedImageCache.has(filePath)) {
    return uploadedImageCache.get(filePath)!;
  }

  try {
    const fileBuffer = await readFile(filePath);
    const fileName = filePath.split("/").pop() || "image.jpg";

    const asset = await client.assets.upload("image", fileBuffer, {
      filename: fileName,
    });

    uploadedImageCache.set(filePath, asset._id);
    await delay(IMAGE_UPLOAD_DELAY);
    return asset._id;
  } catch (err) {
    console.error(
      `  Failed to upload ${filePath}: ${err instanceof Error ? err.message : err}`
    );
    return null;
  }
}

// --- Gallery Transform ---

interface KirbyBlock {
  type: "image";
  content: {
    image?: string[];
    alt?: string;
    caption?: string;
  };
  id: string;
  isHidden: boolean;
}

interface KirbyColumn {
  blocks: KirbyBlock[];
  width: string;
}

interface KirbyRow {
  columns: KirbyColumn[];
}

interface MediaItemData {
  _type: "mediaItem";
  type: "image";
  image?: {
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  };
  caption: string;
  alt: string;
}

interface SingleMediaBlock {
  _type: "singleMediaBlock";
  _key: string;
  orientation: string;
  media: MediaItemData;
}

interface SideBySideMediaBlock {
  _type: "sideBySideMediaBlock";
  _key: string;
  orientation: string;
  left: MediaItemData;
  right: MediaItemData;
}

type GalleryBlock = SingleMediaBlock | SideBySideMediaBlock;

async function buildMediaItem(
  block: KirbyBlock,
  uuidMap: Map<string, ImageMeta>
): Promise<MediaItemData> {
  const mediaItem: MediaItemData = {
    _type: "mediaItem",
    type: "image",
    caption: "",
    alt: "",
  };

  const imageRefs = block.content.image || [];
  const fileRef = imageRefs[0];
  if (!fileRef) return mediaItem;

  const uuid = resolveFileUuid(fileRef);
  if (!uuid) return mediaItem;

  const imageMeta = uuidMap.get(uuid);
  if (!imageMeta) {
    console.warn(`  Warning: Could not resolve UUID ${uuid}`);
    return mediaItem;
  }

  mediaItem.caption = block.content.caption || imageMeta.caption || "";
  mediaItem.alt = block.content.alt || imageMeta.alt || "";

  const assetRef = await uploadImage(imageMeta.filePath);
  if (assetRef) {
    mediaItem.image = {
      _type: "image",
      asset: { _type: "reference", _ref: assetRef },
    };
  }

  return mediaItem;
}

async function transformGallery(
  galleryJson: string,
  uuidMap: Map<string, ImageMeta>
): Promise<GalleryBlock[]> {
  let rows: KirbyRow[];
  try {
    rows = JSON.parse(galleryJson);
  } catch {
    console.warn("  Warning: Could not parse gallery JSON");
    return [];
  }

  const blocks: GalleryBlock[] = [];

  for (const row of rows) {
    const columns = row.columns.filter((col) => col.blocks.length > 0);
    if (columns.length === 0) continue;

    if (columns.length === 1 && columns[0].width === "1/1") {
      // Single full-width image → singleMediaBlock
      const block = columns[0].blocks[0];
      if (block.isHidden) continue;

      const media = await buildMediaItem(block, uuidMap);
      blocks.push({
        _type: "singleMediaBlock",
        _key: generateKey(),
        orientation: "landscape",
        media,
      });
    } else if (
      columns.length === 2 &&
      columns[0].width === "1/2" &&
      columns[1].width === "1/2"
    ) {
      // Two half-width images → sideBySideMediaBlock
      const leftBlock = columns[0].blocks[0];
      const rightBlock = columns[1].blocks[0];
      if (leftBlock.isHidden && rightBlock.isHidden) continue;

      const left = await buildMediaItem(leftBlock, uuidMap);
      const right = await buildMediaItem(rightBlock, uuidMap);
      blocks.push({
        _type: "sideBySideMediaBlock",
        _key: generateKey(),
        orientation: "landscape",
        left,
        right,
      });
    } else {
      // Fallback: treat each column's first block as a single media block
      for (const col of columns) {
        const block = col.blocks[0];
        if (!block || block.isHidden) continue;

        const media = await buildMediaItem(block, uuidMap);
        blocks.push({
          _type: "singleMediaBlock",
          _key: generateKey(),
          orientation: "landscape",
          media,
        });
      }
    }
  }

  return blocks;
}

// --- Reference Resolution ---

type RefMap = Map<string, string>;

let tagMap: RefMap;
let designerMap: RefMap; // slug → _id
let instituteMap: RefMap; // normalized name → _id
let teacherMap: RefMap; // normalized name → _id

async function prefetchReferenceMaps(): Promise<void> {
  console.log("Pre-fetching reference maps...\n");

  const [tags, designers, institutes, teachers] = await Promise.all([
    client.fetch<{ _id: string; name: string; slug?: { current: string } }[]>(
      `*[_type == "tag"]{ _id, name, slug }`
    ),
    client.fetch<{ _id: string; slug?: { current: string }; name: string }[]>(
      `*[_type == "designer"]{ _id, slug, name }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "institute"]{ _id, name }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "teacher"]{ _id, name }`
    ),
  ]);

  tagMap = new Map(
    tags.map((t) => [normalizeName(t.slug?.current || t.name), t._id])
  );
  // Designers are looked up by slug.current
  designerMap = new Map(
    designers
      .filter((d) => d.slug?.current)
      .map((d) => [d.slug!.current, d._id])
  );
  instituteMap = new Map(
    institutes.map((i) => [normalizeName(i.name), i._id])
  );
  teacherMap = new Map(teachers.map((t) => [normalizeName(t.name), t._id]));

  console.log(
    `  Tags: ${tagMap.size}, Designers: ${designerMap.size}, Institutes: ${instituteMap.size}, Teachers: ${teacherMap.size}\n`
  );
}

function deriveNameFromSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function resolveOrCreateDesigner(
  designerPath: string
): Promise<string> {
  // Input: "designers/matteo-palu" → extract slug "matteo-palu"
  const slug = designerPath.replace("designers/", "");

  if (designerMap.has(slug)) return designerMap.get(slug)!;

  const name = deriveNameFromSlug(slug);
  const id = `designer-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "designer",
      name,
      slug: { _type: "slug", current: slug },
    });
  }

  designerMap.set(slug, id);
  console.log(`  Created designer: ${name} (${id})`);
  return id;
}

async function resolveOrCreateInstitute(rawName: string): Promise<string | null> {
  // Skip empty / dash values
  if (!rawName || rawName === "—" || rawName === "-") return null;

  // Apply aliases
  const canonicalName = INSTITUTE_ALIASES[rawName] || rawName;
  const normalized = normalizeName(canonicalName);

  if (instituteMap.has(normalized)) return instituteMap.get(normalized)!;

  const slug = toSlug(canonicalName);
  const id = `institute-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "institute",
      name: canonicalName.trim(),
    });
  }

  instituteMap.set(normalized, id);
  console.log(`  Created institute: ${canonicalName} (${id})`);
  return id;
}

async function resolveOrCreateTeacher(
  name: string,
  instituteId: string | null
): Promise<string> {
  const normalized = normalizeName(name);

  if (teacherMap.has(normalized)) return teacherMap.get(normalized)!;

  const slug = toSlug(name);
  const id = `teacher-${slug}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = {
    _id: id,
    _type: "teacher",
    name: name.trim(),
  };

  if (instituteId) {
    doc.teachingAt = { _type: "reference", _ref: instituteId };
  }

  if (!DRY_RUN) {
    await client.createIfNotExists(doc);
  }

  teacherMap.set(normalized, id);
  console.log(`  Created teacher: ${name} (${id})`);
  return id;
}

async function resolveOrCreateTag(tagSlug: string): Promise<string> {
  const normalized = normalizeName(toSlug(tagSlug));

  if (tagMap.has(normalized)) return tagMap.get(normalized)!;

  const name = tagSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const slug = toSlug(tagSlug);
  const id = `tag-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "tag",
      name,
      slug: { _type: "slug", current: slug },
    });
  }

  tagMap.set(normalized, id);
  console.log(`  Created tag: ${name} (${id})`);
  return id;
}

// --- Process Single Project ---

async function processProject(
  folderName: string,
  folderPath: string
): Promise<void> {
  console.log(`\nProcessing: ${folderName}`);

  // Parse Kirby files (Italian + English)
  const itContent = await readFile(
    join(folderPath, "project.it.txt"),
    "utf-8"
  );
  const itFields = parseKirbyFile(itContent);

  let enFields: Record<string, string> = {};
  try {
    const enContent = await readFile(
      join(folderPath, "project.en.txt"),
      "utf-8"
    );
    enFields = parseKirbyFile(enContent);
  } catch {
    // No English file — fall back to Italian
  }

  // Build UUID → file map from image metadata
  const uuidMap = await buildUuidMap(folderPath);

  // --- Extract and transform fields ---

  const title = itFields.Title || "";
  const slug = toSlug(title);

  const publishingDate = itFields.Publishingdate || "";

  // Cover image
  let coverData: Record<string, unknown> | undefined;
  const coverRef = itFields.Cover;
  if (coverRef) {
    const coverUuid = resolveFileUuid(coverRef);
    if (coverUuid) {
      const coverMeta = uuidMap.get(coverUuid);
      if (coverMeta) {
        const coverAssetRef = await uploadImage(coverMeta.filePath);
        if (coverAssetRef) {
          coverData = {
            _type: "imageWithMetadata",
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: coverAssetRef },
            },
            caption: coverMeta.caption || "",
            alt: coverMeta.alt || "",
          };
        }
      }
    }
  }

  // Designers (slug-based)
  const designerRefs: { _type: "reference"; _ref: string; _key: string }[] = [];
  const designersStr = itFields.Designers || "";
  if (designersStr) {
    const paths = designersStr
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    for (const path of paths) {
      const refId = await resolveOrCreateDesigner(path);
      designerRefs.push({
        _type: "reference",
        _ref: refId,
        _key: generateKey(),
      });
    }
  }

  // Institute
  const instituteRaw = itFields.Institute || "";
  const instituteId = await resolveOrCreateInstitute(instituteRaw);

  // Teachers
  const teacherRefs: { _type: "reference"; _ref: string; _key: string }[] = [];
  const teacherStr = itFields.Teacher || "";
  if (teacherStr && teacherStr !== "—" && teacherStr !== "-") {
    const names = teacherStr
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    for (const name of names) {
      const refId = await resolveOrCreateTeacher(name, instituteId);
      teacherRefs.push({
        _type: "reference",
        _ref: refId,
        _key: generateKey(),
      });
    }
  }

  // Year
  const yearStr = itFields.Year || "";
  const year = yearStr ? parseInt(yearStr.split("-")[0], 10) : undefined;

  // Tags
  const tagRefs: { _type: "reference"; _ref: string; _key: string }[] = [];
  const tagPrimary = itFields.Tagprimary || "";
  const tagSecondary = itFields.Tagsecondary || "";
  const allTagSlugs = [tagPrimary, ...tagSecondary.split(",")]
    .map((t) => t.trim())
    .filter(Boolean);
  const tagSlugs = [...new Set(allTagSlugs.map((t) => toSlug(t)))];
  for (const tagSlug of tagSlugs) {
    const refId = await resolveOrCreateTag(tagSlug);
    tagRefs.push({
      _type: "reference",
      _ref: refId,
      _key: generateKey(),
    });
  }

  // Description (plain text) — prefer English, fall back to Italian
  const description = enFields.Description || itFields.Description || "";

  // Gallery
  const galleryJson = itFields.Gallery || "[]";
  const galleryBlocks = await transformGallery(galleryJson, uuidMap);

  // SEO fields — prefer English, fall back to Italian
  const seo: Record<string, unknown> = { _type: "seoModule" };
  const metaTitle = enFields.Metatitle || itFields.Metatitle;
  const metaDesc = enFields.Metadescription || itFields.Metadescription;
  const ogDesc = enFields.Ogdescription || itFields.Ogdescription;
  if (metaTitle) seo.metaTitle = metaTitle;
  // Use source metaDescription if available, otherwise fall back to generated SEO descriptions
  const finalMetaDesc = metaDesc || seoDescriptions[folderName];
  if (finalMetaDesc) seo.metaDescription = finalMetaDesc;
  if (ogDesc) {
    seo.openGraph = {
      _type: "openGraph",
      description: ogDesc,
    };
  }
  if (coverData) seo.metaImage = coverData;

  // --- Assemble Sanity document ---

  const docId = `project-${folderName}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = {
    _id: docId,
    _type: "project",
    title,
    slug: { _type: "slug", current: slug },
  };

  if (publishingDate) {
    doc.publishingDate = { _type: "publishingDate", date: publishingDate };
  }
  if (coverData) doc.cover = coverData;
  if (designerRefs.length > 0) doc.designers = designerRefs;
  if (instituteId) {
    doc.institute = { _type: "reference", _ref: instituteId };
  }
  if (teacherRefs.length > 0) doc.teachers = teacherRefs;
  if (year && !isNaN(year)) doc.year = year;
  if (tagRefs.length > 0) {
    doc.tags = tagRefs;
  }
  if (description) doc.description = description;
  if (galleryBlocks.length > 0) doc.gallery = galleryBlocks;
  if (Object.keys(seo).length > 1) doc.seo = seo;

  // --- Write to Sanity ---

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create: ${docId}`);
    console.log(`  Title: ${title}`);
    console.log(`  Slug: ${slug}`);
    console.log(`  Year: ${year}`);
    console.log(`  Designers: ${designerRefs.length}`);
    console.log(`  Institute: ${instituteRaw || "(none)"}`);
    console.log(`  Teachers: ${teacherRefs.length}`);
    console.log(`  Tags: ${tagRefs.length}`);
    console.log(`  Gallery blocks: ${galleryBlocks.length}`);
    console.log(`  Has cover: ${!!coverData}`);
    console.log(`  Has description: ${!!description}`);
  } else {
    await client.createOrReplace(doc);
    console.log(`  Created: ${docId} — "${title}"`);
  }
}

// --- Verification ---

async function verify(): Promise<void> {
  console.log("\n=== Verification ===\n");

  const [
    total,
    withCover,
    withGallery,
    withDesigners,
    withInstitute,
    withTeachers,
    withTags,
    withDescription,
  ] = await Promise.all([
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*"])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && defined(cover)])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && count(gallery) > 0])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && count(designers) > 0])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && defined(institute)])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && count(teachers) > 0])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && defined(tags)])`
    ),
    client.fetch<number>(
      `count(*[_type == "project" && _id match "project-*" && defined(description)])`
    ),
  ]);

  console.log(`Total projects:    ${total}`);
  console.log(`With cover:        ${withCover}`);
  console.log(`With gallery:      ${withGallery}`);
  console.log(`With designers:    ${withDesigners}`);
  console.log(`With institute:    ${withInstitute}`);
  console.log(`With teachers:     ${withTeachers}`);
  console.log(`With tags:         ${withTags}`);
  console.log(`With description:  ${withDescription}`);
}

// --- Main ---

async function main(): Promise<void> {
  console.log("=== Project Import: Kirby → Sanity ===\n");
  if (DRY_RUN) console.log("*** DRY RUN MODE ***\n");
  if (SKIP_IMAGES) console.log("*** SKIPPING IMAGES ***\n");

  await prefetchReferenceMaps();

  // Get and sort project folders by number prefix (skip plain files)
  const allEntries = await readdir(PROJECTS_DIR);
  const dirChecks = await Promise.all(
    allEntries.map(async (f) => ({
      name: f,
      isDir: (await stat(join(PROJECTS_DIR, f))).isDirectory(),
    }))
  );
  const folders = dirChecks
    .filter((e) => e.isDir && !e.name.startsWith("."))
    .map((e) => e.name)
    .filter((f) => !ONLY || f === ONLY)
    .sort((a, b) => {
      const numA = parseInt(a.split("_")[0], 10);
      const numB = parseInt(b.split("_")[0], 10);
      return numA - numB;
    });

  console.log(`Found ${folders.length} project(s) to process`);

  let success = 0;
  let errors = 0;

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const progress = `[${i + 1}/${folders.length}]`;

    try {
      const folderPath = join(PROJECTS_DIR, folder);
      await processProject(folder, folderPath);
      success++;
      console.log(`${progress} OK`);
    } catch (err) {
      console.error(
        `${progress} ERROR: ${folder} — ${err instanceof Error ? err.message : err}`
      );
      errors++;
    }
  }

  console.log(`\n=== Results: ${success} success, ${errors} errors ===`);

  if (!DRY_RUN) {
    await verify();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
