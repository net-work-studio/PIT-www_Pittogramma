// biome-ignore-all lint: one-off migration script kept outside app runtime
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

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createClient } from "@sanity/client";

const sanityConfig = JSON.parse(
  readFileSync(path.join(homedir(), ".config", "sanity", "config.json"), "utf8")
);

const client = createClient({
  apiVersion: "2024-01-01",
  dataset: "production",
  projectId: "jfvmcjyl",
  token: sanityConfig.authToken,
  useCdn: false,
});

const isWrite = process.argv.includes("--write");

interface OldDoc {
  _id: string;
  _type: string;
  bio?: string;
  birthYear?: number;
  education?: unknown[];
  email?: string;
  name?: string;
  phone?: string;
  place?: { _ref: string; _type: string };
  portrait?: unknown;
  seo?: unknown;
  slug?: { current: string; _type: string };
  socialLinks?: unknown;
  studio?: { _ref: string; _type: string };
  teachingAt?: { _ref: string; _type: string };
}

// Maps old type → role value
const TYPE_TO_ROLE: Record<string, string> = {
  author: "author",
  designer: "designer",
  professional: "professional",
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
  const oldDocs: OldDoc[] = await client.fetch(
    `*[_type in ["designer", "professional", "author", "teacher"] && !(_id in path("drafts.**"))]{ ... }`
  );

  const byType: Record<string, OldDoc[]> = {};
  for (const doc of oldDocs) {
    byType[doc._type] = byType[doc._type] || [];
    byType[doc._type].push(doc);
  }
  for (const [_type, _docs] of Object.entries(byType)) {
  }
  const nameMap = new Map<string, OldDoc[]>();
  for (const doc of oldDocs) {
    const name = (doc.name ?? "").trim().toLowerCase();
    if (!name) {
      continue;
    }
    const existing = nameMap.get(name) || [];
    existing.push(doc);
    nameMap.set(name, existing);
  }

  const duplicates = [...nameMap.entries()].filter(
    ([, docs]) => docs.length > 1
  );
  if (duplicates.length > 0) {
    for (const [_name, _docs] of duplicates) {
    }
  } else {
  }
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
    if (processedIds.has(doc._id)) {
      continue;
    }

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

    personPlans.push({ allOldIds, newId, primaryDoc: primary, roles });
  }

  const createTx = client.transaction();
  for (const plan of personPlans) {
    const doc = plan.primaryDoc;
    const newDoc: Record<string, unknown> = {
      _id: plan.newId,
      _type: "person",
      name: doc.name,
      roles: plan.roles,
    };

    if (doc.slug) {
      newDoc.slug = doc.slug;
    }
    if (doc.portrait) {
      newDoc.portrait = doc.portrait;
    }
    if (doc.birthYear) {
      newDoc.birthYear = doc.birthYear;
    }
    if (doc.bio) {
      newDoc.bio = doc.bio;
    }
    if (doc.education) {
      newDoc.education = doc.education;
    }
    if (doc.place) {
      newDoc.place = doc.place;
    }
    if (doc.socialLinks) {
      newDoc.socialLinks = doc.socialLinks;
    }
    if (doc.email) {
      newDoc.email = doc.email;
    }
    if (doc.phone) {
      newDoc.phone = doc.phone;
    }
    if (doc.teachingAt) {
      newDoc.teachingAt = doc.teachingAt;
    }
    if (doc.studio) {
      newDoc.studio = doc.studio;
    }
    if (doc.seo) {
      newDoc.seo = doc.seo;
    }
    createTx.createIfNotExists(newDoc);
  }

  if (isWrite) {
    await createTx.commit();
  }
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
      if (!arr?.length) {
        continue;
      }

      let changed = false;
      const updated = arr.map((ref) => {
        if (idMap[ref._ref]) {
          changed = true;
          return { ...ref, _ref: idMap[ref._ref] };
        }
        return ref;
      });

      if (changed) {
        const deduped = updated.filter(
          (ref, i, arr) => arr.findIndex((r) => r._ref === ref._ref) === i
        );
        refTx.patch(doc._id, { set: { [field]: deduped } });
      }
    }
  }

  if (isWrite) {
    await refTx.commit();
  }
  const deleteTx = client.transaction();
  for (const oldId of allOldIds) {
    deleteTx.delete(oldId);
    deleteTx.delete(`drafts.${oldId}`);
  }

  if (isWrite) {
    await deleteTx.commit();
  }
  if (!isWrite) {
  }
}

run().catch((_err) => {
  process.exit(1);
});
