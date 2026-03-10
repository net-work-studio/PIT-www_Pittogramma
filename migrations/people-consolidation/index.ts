/**
 * Migration: Consolidate designer, professional, author, teacher → person
 *
 * Since Sanity's _type is immutable, we:
 * 1. Fetch all old person-like documents
 * 2. Detect duplicates (same name across types) for manual review
 * 3. Create new person documents with correct roles[]
 * 4. Update all references in projects, interviews, journals, bibliographies
 * 5. Delete old documents (published + drafts)
 *
 * Run: npx sanity exec migrations/people-consolidation/index.ts -- --write
 * Add --dry-run (default) to preview changes without writing.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const sanityConfig = JSON.parse(
  readFileSync(
    path.join(homedir(), ".config", "sanity", "config.json"),
    "utf8"
  )
);

const client = createClient({
  projectId: "jfvmcjyl",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: sanityConfig.authToken,
  useCdn: false,
});

const isWrite = process.argv.includes("--write");

type OldDoc = {
  _id: string;
  _type: string;
  name?: string;
  slug?: { current: string; _type: string };
  portrait?: unknown;
  birthYear?: number;
  bio?: string;
  education?: unknown[];
  place?: { _ref: string; _type: string };
  socialLinks?: unknown;
  email?: string;
  phone?: string;
  teachingAt?: { _ref: string; _type: string };
  studio?: { _ref: string; _type: string };
  seo?: unknown;
};

// Maps old type → role value
const TYPE_TO_ROLE: Record<string, string> = {
  designer: "designer",
  professional: "professional",
  author: "author",
  teacher: "teacher",
};

function makePersonId(oldId: string, oldType: string): string {
  // e.g. "designer-john-doe" → "person-john-doe"
  // e.g. "abc123" → "person-from-designer-abc123"
  if (oldId.startsWith(`${oldType}-`)) {
    return oldId.replace(`${oldType}-`, "person-");
  }
  return `person-from-${oldType}-${oldId}`;
}

async function run() {
  console.log(`Mode: ${isWrite ? "WRITE" : "DRY RUN"}`);
  console.log("=".repeat(60));

  // Step 1: Fetch all old documents
  console.log("\n--- Step 1: Fetching all person-like documents ---");
  const oldDocs: OldDoc[] = await client.fetch(
    `*[_type in ["designer", "professional", "author", "teacher"]]{ ... }`
  );
  console.log(`Found ${oldDocs.length} total documents`);

  const byType: Record<string, OldDoc[]> = {};
  for (const doc of oldDocs) {
    byType[doc._type] = byType[doc._type] || [];
    byType[doc._type].push(doc);
  }
  for (const [type, docs] of Object.entries(byType)) {
    console.log(`  ${type}: ${docs.length}`);
  }

  // Step 2: Detect potential duplicates (same name across types)
  console.log("\n--- Step 2: Checking for potential duplicates ---");
  const nameMap = new Map<string, OldDoc[]>();
  for (const doc of oldDocs) {
    const name = (doc.name ?? "").trim().toLowerCase();
    if (!name) continue;
    const existing = nameMap.get(name) || [];
    existing.push(doc);
    nameMap.set(name, existing);
  }

  const duplicates = [...nameMap.entries()].filter(([, docs]) => docs.length > 1);
  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} potential duplicate(s):`);
    for (const [name, docs] of duplicates) {
      console.log(
        `  "${name}": ${docs.map((d) => `${d._type}(${d._id})`).join(", ")}`
      );
    }
    console.log(
      "\nDuplicates will be MERGED into a single person with combined roles."
    );
  } else {
    console.log("No duplicates found.");
  }

  // Step 3: Build ID mapping and create person documents
  console.log("\n--- Step 3: Creating person documents ---");
  // For duplicates: pick the richest doc as primary, map all old IDs to same new ID
  const idMap: Record<string, string> = {}; // oldId → newPersonId

  // Group by normalized name to handle merges
  const personPlans: {
    newId: string;
    roles: string[];
    primaryDoc: OldDoc;
    allOldIds: string[];
  }[] = [];

  const processedIds = new Set<string>();

  for (const doc of oldDocs) {
    if (processedIds.has(doc._id)) continue;

    const name = (doc.name ?? "").trim().toLowerCase();
    const group = nameMap.get(name) || [doc];

    // Pick the richest document as primary (designer > professional > teacher > author)
    const priority = ["designer", "professional", "teacher", "author"];
    const sorted = [...group].sort(
      (a, b) => priority.indexOf(a._type) - priority.indexOf(b._type)
    );
    const primary = sorted[0];

    const newId = makePersonId(primary._id, primary._type);
    const roles = [...new Set(group.map((d) => TYPE_TO_ROLE[d._type]))];
    const allOldIds = group.map((d) => d._id);

    for (const d of group) {
      idMap[d._id] = newId;
      processedIds.add(d._id);
    }

    personPlans.push({ newId, roles, primaryDoc: primary, allOldIds });
  }

  console.log(`Will create ${personPlans.length} person documents`);

  const createTx = client.transaction();
  for (const plan of personPlans) {
    const doc = plan.primaryDoc;
    const newDoc: Record<string, unknown> = {
      _id: plan.newId,
      _type: "person",
      roles: plan.roles,
      name: doc.name,
    };

    if (doc.slug) newDoc.slug = doc.slug;
    if (doc.portrait) newDoc.portrait = doc.portrait;
    if (doc.birthYear) newDoc.birthYear = doc.birthYear;
    if (doc.bio) newDoc.bio = doc.bio;
    if (doc.education) newDoc.education = doc.education;
    if (doc.place) newDoc.place = doc.place;
    if (doc.socialLinks) newDoc.socialLinks = doc.socialLinks;
    if (doc.email) newDoc.email = doc.email;
    if (doc.phone) newDoc.phone = doc.phone;
    if (doc.teachingAt) newDoc.teachingAt = doc.teachingAt;
    if (doc.studio) newDoc.studio = doc.studio;
    if (doc.seo) newDoc.seo = doc.seo;

    console.log(
      `  Create: ${plan.newId} (${doc.name}) [${plan.roles.join(", ")}]`
    );
    createTx.createIfNotExists(newDoc);
  }

  if (isWrite) {
    await createTx.commit();
    console.log("  Created all person documents");
  }

  // Step 4: Update all references
  console.log("\n--- Step 4: Updating references ---");
  const allOldIds = Object.keys(idMap);

  const referencingDocs = await client.fetch(
    `*[
      _type in ["project", "interview", "journal", "bibliography"] && (
        count(designers[_ref in $oldIds]) > 0 ||
        count(designersAndProfessionals[_ref in $oldIds]) > 0 ||
        count(authors[_ref in $oldIds]) > 0 ||
        count(teachers[_ref in $oldIds]) > 0
      )
    ]{ _id, _type, designers, designersAndProfessionals, authors, teachers }`,
    { oldIds: allOldIds }
  );
  console.log(`Found ${referencingDocs.length} referencing documents`);

  const refTx = client.transaction();
  for (const doc of referencingDocs) {
    const refArrays = [
      "designers",
      "designersAndProfessionals",
      "authors",
      "teachers",
    ];
    for (const field of refArrays) {
      const arr = doc[field] as
        | { _ref: string; _key: string; _type?: string }[]
        | undefined;
      if (!arr?.length) continue;

      let changed = false;
      const updated = arr.map((ref) => {
        if (idMap[ref._ref]) {
          console.log(
            `  ${doc._id}.${field}: ${ref._ref} → ${idMap[ref._ref]}`
          );
          changed = true;
          return { ...ref, _ref: idMap[ref._ref] };
        }
        return ref;
      });

      if (changed) {
        refTx.patch(doc._id, { set: { [field]: updated } });
      }
    }
  }

  if (isWrite) {
    await refTx.commit();
    console.log("  Updated all references");
  }

  // Step 5: Delete old documents
  console.log("\n--- Step 5: Deleting old documents ---");
  const deleteTx = client.transaction();
  for (const oldId of allOldIds) {
    console.log(`  Delete: ${oldId}`);
    deleteTx.delete(oldId);
    deleteTx.delete(`drafts.${oldId}`);
  }

  if (isWrite) {
    await deleteTx.commit();
    console.log("  Deleted all old documents");
  }

  console.log("\n" + "=".repeat(60));
  console.log("Migration complete");
  if (!isWrite) {
    console.log("This was a DRY RUN. Add --write to apply changes.");
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
