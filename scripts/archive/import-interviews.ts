// biome-ignore-all lint: archived one-off import script
/**
 * Import interviews from Kirby CMS data to Sanity
 *
 * Run with:
 *   bun run scripts/import-interviews.ts
 *   bun run scripts/import-interviews.ts --dry-run
 *   bun run scripts/import-interviews.ts --only=1_ascionemagro
 *   bun run scripts/import-interviews.ts --skip-images
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@sanity/client";

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

const INTERVIEWS_DIR = join(process.cwd(), "DATA_IMPORT/interviews");
const IMAGE_UPLOAD_DELAY = 300;

const INTERVIEW_TYPE_MAP: Record<string, "designers" | "studio"> = {
  "1_ascionemagro": "studio",
  "2_sunday-buro": "studio",
  "3_taddeo-zacchini": "designers",
  "4_bbdb": "studio",
  "5_pierodibiase": "designers",
  "6_but-maybe": "studio",
  "7_benedettacrippa": "designers",
  "8_il-processo-progettuale-alla-base-di-output-visivi-e-della-gestione-di-uno-studio":
    "studio",
  "9_l-evoluzione-del-design-creativo-nel-mondo-digitale": "studio",
  "10_illostudio": "studio",
  "11_il-design-come-dialogo-attraverso-metodo-ricerca-e-sperimentazione":
    "designers",
  "12_designstudio": "studio",
  "13_studiodumbardept": "studio",
  "14_ditroit": "studio",
  "15_stephaniespecht": "designers",
  "16_federico-barbon": "designers",
  "17_collater-al": "studio",
  "18_collletttivo": "studio",
  "19_pedroneves": "designers",
  "20_shweta-malhotra": "designers",
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
    if (!trimmed) {
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    fields[key] = value;
  }

  return fields;
}

// --- UUID → File Resolution ---

interface ImageMeta {
  alt: string;
  caption: string;
  filePath: string;
}

async function buildUuidMap(
  folderPath: string
): Promise<Map<string, ImageMeta>> {
  const files = await readdir(folderPath);
  const map = new Map<string, ImageMeta>();

  for (const file of files) {
    // Match any image metadata file: *.jpg.it.txt, *.png.it.txt, etc.
    if (!file.endsWith(".it.txt") || file === "interview.it.txt") {
      continue;
    }

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
  if (SKIP_IMAGES) {
    return null;
  }

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
  } catch {
    return null;
  }
}

// --- HTML → Portable Text ---

interface PTSpan {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
}

interface PTBlock {
  _key: string;
  _type: "block";
  children: PTSpan[];
  markDefs: never[];
  style: string;
}

function parseInlineHtml(html: string): PTSpan[] {
  const spans: PTSpan[] = [];
  const activeMarks: string[] = [];

  // Split at tag boundaries while keeping tags
  const parts = html.split(/(<\/?(?:strong|em|b|i|a)[^>]*>)/);

  for (const part of parts) {
    if (!part) {
      continue;
    }

    // Opening tags
    if (part === "<strong>" || part === "<b>") {
      activeMarks.push("strong");
      continue;
    }
    if (part === "<em>" || part === "<i>") {
      activeMarks.push("em");
      continue;
    }

    // Closing tags
    if (part === "</strong>" || part === "</b>") {
      const idx = activeMarks.lastIndexOf("strong");
      if (idx !== -1) {
        activeMarks.splice(idx, 1);
      }
      continue;
    }
    if (part === "</em>" || part === "</i>") {
      const idx = activeMarks.lastIndexOf("em");
      if (idx !== -1) {
        activeMarks.splice(idx, 1);
      }
      continue;
    }

    // Skip <a> tags (strip them, keep text content)
    if (part.startsWith("<a") || part === "</a>") {
      continue;
    }

    // Skip any other stray HTML tags
    if (part.startsWith("<") && part.endsWith(">")) {
      continue;
    }

    // Text content — strip any remaining inline tags and decode entities
    const text = decodeHtmlEntities(part.replace(/<[^>]+>/g, ""));
    if (text) {
      spans.push({
        _type: "span",
        _key: generateKey(),
        text,
        marks: [...activeMarks],
      });
    }
  }

  if (spans.length === 0) {
    spans.push({
      _type: "span",
      _key: generateKey(),
      text: "",
      marks: [],
    });
  }

  return spans;
}

function htmlToBlocks(html: string, style: string): PTBlock[] {
  const blocks: PTBlock[] = [];
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/g);

  if (!paragraphs || paragraphs.length === 0) {
    const cleaned = decodeHtmlEntities(html.replace(/<[^>]+>/g, "")).trim();
    if (cleaned) {
      blocks.push({
        _type: "block",
        _key: generateKey(),
        style,
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: generateKey(),
            text: cleaned,
            marks: [],
          },
        ],
      });
    }
    return blocks;
  }

  for (const p of paragraphs) {
    // Remove outer <p> tags
    const inner = p
      .replace(/^<p[^>]*>/, "")
      .replace(/<\/p>$/, "")
      .trim();
    const cleaned = inner.replace(/<br\s*\/?>/gi, " ");
    if (!cleaned) {
      continue;
    }

    blocks.push({
      _type: "block",
      _key: generateKey(),
      style,
      markDefs: [],
      children: parseInlineHtml(cleaned),
    });
  }

  return blocks;
}

// --- Interview Content Transform ---

interface KirbyBlock {
  content: {
    text?: string;
    level?: string;
    image?: string[];
    alt?: string;
    caption?: string;
  };
  id: string;
  isHidden: boolean;
  type: "heading" | "text" | "image";
}

interface KirbyColumn {
  blocks: KirbyBlock[];
  width: string;
}

interface KirbyRow {
  columns: KirbyColumn[];
}

interface SingleMediaBlock {
  _key: string;
  _type: "singleMediaBlock";
  media: {
    _type: "mediaItem";
    type: "image";
    image?: {
      _type: "image";
      asset: { _type: "reference"; _ref: string };
    };
    caption: string;
    alt: string;
  };
  orientation: string;
}

type SanityBlock = PTBlock | SingleMediaBlock;

async function transformInterviewContent(
  interviewJson: string,
  uuidMap: Map<string, ImageMeta>
): Promise<SanityBlock[]> {
  let rows: KirbyRow[];
  try {
    rows = JSON.parse(interviewJson);
  } catch {
    return [];
  }

  const blocks: SanityBlock[] = [];

  for (const row of rows) {
    // Find the column with content (the one with blocks)
    const contentColumn = row.columns.find((col) => col.blocks.length > 0);
    if (!contentColumn) {
      continue;
    }

    for (const block of contentColumn.blocks) {
      if (block.isHidden) {
        continue;
      }

      switch (block.type) {
        case "heading": {
          const text = decodeHtmlEntities(
            (block.content.text || "").replace(/<[^>]+>/g, "")
          ).trim();
          if (text) {
            blocks.push({
              _type: "block",
              _key: generateKey(),
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: generateKey(),
                  text,
                  marks: [],
                },
              ],
            });
          }
          break;
        }

        case "text": {
          const htmlContent = block.content.text || "";
          const ptBlocks = htmlToBlocks(htmlContent, "answer");
          blocks.push(...ptBlocks);
          break;
        }

        case "image": {
          const imageRefs = block.content.image || [];
          const fileRef = imageRefs[0];
          if (!fileRef) {
            break;
          }

          const uuid = resolveFileUuid(fileRef);
          if (!uuid) {
            break;
          }

          const imageMeta = uuidMap.get(uuid);
          if (!imageMeta) {
            break;
          }

          const assetRef = await uploadImage(imageMeta.filePath);

          const mediaBlock: SingleMediaBlock = {
            _type: "singleMediaBlock",
            _key: generateKey(),
            orientation: "landscape",
            media: {
              _type: "mediaItem",
              type: "image",
              caption: block.content.caption || imageMeta.caption || "",
              alt: block.content.alt || imageMeta.alt || "",
            },
          };

          if (assetRef) {
            mediaBlock.media.image = {
              _type: "image",
              asset: { _type: "reference", _ref: assetRef },
            };
          }

          blocks.push(mediaBlock);
          break;
        }
      }
    }
  }

  return blocks;
}

// --- Reference Resolution ---

type RefMap = Map<string, string>;

let tagMap: RefMap;
let designerMap: RefMap;
let studioMap: RefMap;
let placeMap: RefMap;
let professionalMap: RefMap;

async function prefetchReferenceMaps(): Promise<void> {
  const [tags, designers, studios, places, professionals] = await Promise.all([
    client.fetch<{ _id: string; name: string; slug?: { current: string } }[]>(
      `*[_type == "tag"]{ _id, name, slug }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "designer"]{ _id, name }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "studio"]{ _id, name }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "place"]{ _id, name }`
    ),
    client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "professional"]{ _id, name }`
    ),
  ]);

  // Tags are looked up by slug
  tagMap = new Map(
    tags.map((t) => [normalizeName(t.slug?.current || t.name), t._id])
  );
  designerMap = new Map(designers.map((d) => [normalizeName(d.name), d._id]));
  studioMap = new Map(studios.map((s) => [normalizeName(s.name), s._id]));
  placeMap = new Map(places.map((p) => [normalizeName(p.name), p._id]));
  professionalMap = new Map(
    professionals.map((p) => [normalizeName(p.name), p._id])
  );
}

async function resolveOrCreateDesigner(name: string): Promise<string> {
  const normalized = normalizeName(name);

  // Check designers first, then professionals
  if (designerMap.has(normalized)) {
    return designerMap.get(normalized)!;
  }
  if (professionalMap.has(normalized)) {
    return professionalMap.get(normalized)!;
  }

  // Create new designer
  const slug = toSlug(name);
  const id = `designer-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "designer",
      name: name.trim(),
      slug: { _type: "slug", current: slug },
    });
  }

  designerMap.set(normalized, id);
  return id;
}

async function resolveOrCreateStudio(name: string): Promise<string> {
  const normalized = normalizeName(name);

  if (studioMap.has(normalized)) {
    return studioMap.get(normalized)!;
  }

  const slug = toSlug(name);
  const id = `studio-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "studio",
      name: name.trim(),
    });
  }

  studioMap.set(normalized, id);
  return id;
}

async function resolveOrCreatePlace(name: string): Promise<string> {
  const normalized = normalizeName(name);

  if (placeMap.has(normalized)) {
    return placeMap.get(normalized)!;
  }

  const slug = toSlug(name);
  const id = `place-${slug}`;

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: id,
      _type: "place",
      name: name.trim(),
    });
  }

  placeMap.set(normalized, id);
  return id;
}

async function resolveOrCreateTag(tagSlug: string): Promise<string> {
  const normalized = normalizeName(tagSlug);

  if (tagMap.has(normalized)) {
    return tagMap.get(normalized)!;
  }

  // Derive display name from slug: "small-studios" → "Small Studios"
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
  return id;
}

// --- Process Single Interview ---

async function processInterview(
  folderName: string,
  folderPath: string
): Promise<void> {
  // Parse Kirby files
  const itContent = await readFile(
    join(folderPath, "interview.it.txt"),
    "utf-8"
  );
  const enContent = await readFile(
    join(folderPath, "interview.en.txt"),
    "utf-8"
  );

  const itFields = parseKirbyFile(itContent);
  const enFields = parseKirbyFile(enContent);

  // Build UUID → file map from image metadata
  const uuidMap = await buildUuidMap(folderPath);

  // --- Extract and transform fields ---

  const title = enFields.Title || itFields.Title || "";
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

  // Interview type from hardcoded map
  const interviewToType = INTERVIEW_TYPE_MAP[folderName] || "designers";

  // Designers → designersAndProfessionals references
  const designerRefs: { _type: "reference"; _ref: string; _key: string }[] = [];
  const designersStr = itFields.Designers || "";
  if (designersStr) {
    const names = designersStr
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    for (const name of names) {
      const refId = await resolveOrCreateDesigner(name);
      designerRefs.push({
        _type: "reference",
        _ref: refId,
        _key: generateKey(),
      });
    }
  }

  // Studio reference
  let studioRef: { _type: "reference"; _ref: string } | undefined;
  const studioName = itFields.Studio || "";
  if (studioName) {
    const refId = await resolveOrCreateStudio(studioName);
    studioRef = { _type: "reference", _ref: refId };
  }

  // Place reference
  let placeRef: { _type: "reference"; _ref: string } | undefined;
  const location = itFields.Location || "";
  if (location) {
    const refId = await resolveOrCreatePlace(location);
    placeRef = { _type: "reference", _ref: refId };
  }

  // Reading time
  const readingTimeStr = itFields.Readingtime || "";
  const readingTime = readingTimeStr
    ? Number.parseInt(readingTimeStr, 10)
    : undefined;

  // Tags
  const tagRefs: { _type: "reference"; _ref: string; _key: string }[] = [];
  const tagPrimary = itFields.Tagprimary || "";
  const tagSecondary = itFields.Tagsecondary || "";
  const tagSlugs = [
    ...new Set(
      [tagPrimary, ...tagSecondary.split(",")]
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  ];
  for (const tagSlug of tagSlugs) {
    const refId = await resolveOrCreateTag(tagSlug);
    tagRefs.push({
      _type: "reference",
      _ref: refId,
      _key: generateKey(),
    });
  }

  // Intro text from EN Bio
  const introText = enFields.Bio || "";

  // Interview content (EN) → Portable Text
  const interviewJson = enFields.Interview || "[]";
  const interviewBlocks = await transformInterviewContent(
    interviewJson,
    uuidMap
  );

  // SEO fields
  const seo: Record<string, unknown> = { _type: "seoModule" };
  if (enFields.Metatitle) {
    seo.metaTitle = enFields.Metatitle;
  }
  if (enFields.Metadescription) {
    seo.metaDescription = enFields.Metadescription;
  }
  if (enFields.Ogdescription) {
    seo.openGraph = {
      _type: "openGraph",
      description: enFields.Ogdescription,
    };
  }

  // --- Assemble Sanity document ---

  const docId = `interview-${folderName}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = {
    _id: docId,
    _type: "interview",
    title,
    slug: { _type: "slug", current: slug },
    interviewToType,
    introText,
  };

  if (publishingDate) {
    doc.publishingDate = { _type: "publishingDate", date: publishingDate };
  }
  if (coverData) {
    doc.cover = coverData;
  }
  if (designerRefs.length > 0) {
    doc.designersAndProfessionals = designerRefs;
  }
  if (studioRef) {
    doc.studio = studioRef;
  }
  if (placeRef) {
    doc.place = placeRef;
  }
  if (readingTime && !Number.isNaN(readingTime)) {
    doc.readingTime = readingTime;
  }
  if (tagRefs.length > 0) {
    doc.tags = tagRefs;
  }
  if (interviewBlocks.length > 0) {
    doc.interview = interviewBlocks;
  }
  if (Object.keys(seo).length > 1) {
    doc.seo = seo;
  }

  // --- Write to Sanity ---

  if (DRY_RUN) {
  } else {
    await client.createOrReplace(doc);
  }
}

// --- Verification ---

async function verify(): Promise<void> {
  const [_total, _withCover, _withContent, _withDesigners, _withTags] =
    await Promise.all([
      client.fetch<number>(
        `count(*[_type == "interview" && _id match "interview-*"])`
      ),
      client.fetch<number>(
        `count(*[_type == "interview" && _id match "interview-*" && defined(cover)])`
      ),
      client.fetch<number>(
        `count(*[_type == "interview" && _id match "interview-*" && count(interview) > 0])`
      ),
      client.fetch<number>(
        `count(*[_type == "interview" && _id match "interview-*" && count(designersAndProfessionals) > 0])`
      ),
      client.fetch<number>(
        `count(*[_type == "interview" && _id match "interview-*" && defined(tags)])`
      ),
    ]);
}

// --- Main ---

async function main(): Promise<void> {
  if (DRY_RUN) {
  }
  if (SKIP_IMAGES) {
  }

  await prefetchReferenceMaps();

  // Get and sort interview folders by number prefix
  const allFolders = await readdir(INTERVIEWS_DIR);
  const folders = allFolders
    .filter((f) => !f.startsWith("."))
    .filter((f) => !ONLY || f === ONLY)
    .sort((a, b) => {
      const numA = Number.parseInt(a.split("_")[0], 10);
      const numB = Number.parseInt(b.split("_")[0], 10);
      return numA - numB;
    });

  let _success = 0;
  let _errors = 0;

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const _progress = `[${i + 1}/${folders.length}]`;

    try {
      const folderPath = join(INTERVIEWS_DIR, folder);
      await processInterview(folder, folderPath);
      _success++;
    } catch {
      _errors++;
    }
  }

  if (!DRY_RUN) {
    await verify();
  }
}

main().catch((_err) => {
  process.exit(1);
});
