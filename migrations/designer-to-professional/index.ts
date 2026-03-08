/**
 * Migration: Designer → Professional
 *
 * Since Sanity's _type is immutable, we:
 * 1. Create new professional documents (same data, new IDs)
 * 2. Update all references in interviews & projects
 * 3. Delete old designer documents
 *
 * Run: npx sanity exec migrations/designer-to-professional/index.ts -- --write
 */

import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import path from 'node:path'

const sanityConfig = JSON.parse(
  readFileSync(path.join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
)

const client = createClient({
  projectId: 'jfvmcjyl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: sanityConfig.authToken,
  useCdn: false,
})

// Map: old designer ID → new professional ID
const idMap: Record<string, string> = {
  // Batch 2: 9 remaining designers
  'designer-edda-bracchi': 'professional-edda-bracchi',
  'designer-giacomo-scandolara': 'professional-giacomo-scandolara',
  'designer-ilenia-notarangelo': 'professional-ilenia-notarangelo',
  'designer-liza-enebeis': 'professional-liza-enebeis',
  'designer-lorenzo-di-cola': 'professional-lorenzo-di-cola',
  'designer-luca-gonnelli': 'professional-luca-gonnelli',
  'designer-salvatore-giunta': 'professional-salvatore-giunta',
  'designer-stefano-cremisini': 'professional-stefano-cremisini',
  'designer-stephanie-specht': 'professional-stephanie-specht',
}

const oldIds = Object.keys(idMap)
const isWrite = process.argv.includes('--write')

async function run() {
  console.log(`Mode: ${isWrite ? 'WRITE' : 'DRY RUN'}`)

  // Step 1: Fetch old designer documents
  console.log('\n--- Step 1: Fetching designer documents ---')
  const designers = await client.fetch(
    `*[_type == "designer" && _id in $ids]{...}`,
    {ids: oldIds},
  )
  console.log(`Found ${designers.length} designer documents`)

  // Step 2: Create new professional documents
  console.log('\n--- Step 2: Creating professional documents ---')
  const createTx = client.transaction()
  for (const doc of designers) {
    const newId = idMap[doc._id]
    if (!newId) continue

    const newDoc: Record<string, unknown> = {
      _id: newId,
      _type: 'professional',
      name: doc.name,
    }
    // Copy over compatible fields if they exist
    if (doc.portrait) newDoc.portrait = doc.portrait
    if (doc.birthYear) newDoc.birthYear = doc.birthYear
    if (doc.bio) newDoc.bio = doc.bio
    if (doc.place) newDoc.place = doc.place
    if (doc.socialLinks) newDoc.socialLinks = doc.socialLinks

    console.log(`  Create: ${newId} (${doc.name})`)
    createTx.createIfNotExists(newDoc)
  }

  if (isWrite) {
    await createTx.commit()
    console.log('  ✓ Created all professional documents')
  }

  // Step 3: Update references in all referencing documents
  console.log('\n--- Step 3: Updating references ---')
  const referencingDocs = await client.fetch(
    `*[_type in ["interview", "project"] && (
      count(designersAndProfessionals[_ref in $oldIds]) > 0 ||
      count(designers[_ref in $oldIds]) > 0
    )]{_id, _type, designers, designersAndProfessionals}`,
    {oldIds},
  )
  console.log(`Found ${referencingDocs.length} referencing documents`)

  const refTx = client.transaction()
  for (const doc of referencingDocs) {
    // Update designersAndProfessionals array (interviews)
    if (doc.designersAndProfessionals?.length) {
      const updated = doc.designersAndProfessionals.map(
        (ref: {_ref: string; _key: string; _type: string}) => {
          if (idMap[ref._ref]) {
            console.log(`  ${doc._id}: ${ref._ref} → ${idMap[ref._ref]}`)
            return {...ref, _ref: idMap[ref._ref]}
          }
          return ref
        },
      )
      refTx.patch(doc._id, {set: {designersAndProfessionals: updated}})
    }

    // Update designers array (projects)
    if (doc.designers?.length) {
      const updated = doc.designers.map(
        (ref: {_ref: string; _key: string; _type: string}) => {
          if (idMap[ref._ref]) {
            console.log(`  ${doc._id}: ${ref._ref} → ${idMap[ref._ref]}`)
            return {...ref, _ref: idMap[ref._ref]}
          }
          return ref
        },
      )
      refTx.patch(doc._id, {set: {designers: updated}})
    }
  }

  if (isWrite) {
    await refTx.commit()
    console.log('  ✓ Updated all references')
  }

  // Step 4: Delete old designer documents
  console.log('\n--- Step 4: Deleting old designer documents ---')
  const deleteTx = client.transaction()
  for (const oldId of oldIds) {
    console.log(`  Delete: ${oldId}`)
    deleteTx.delete(oldId)
    deleteTx.delete(`drafts.${oldId}`)
  }

  if (isWrite) {
    await deleteTx.commit()
    console.log('  ✓ Deleted all old designer documents')
  }

  console.log('\n--- Migration complete ---')
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
