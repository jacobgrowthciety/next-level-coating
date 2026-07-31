#!/usr/bin/env node
/**
 * Step 2 of the one-time flake gallery migration: download the photos found by scrape-wix.mjs,
 * downscale them, upload to Sanity, and create one flakeGallery document per color.
 *
 * ALREADY RUN — 2026-07-31, 172 photos into 25 galleries (see import-report.json). Kept in the
 * repo as provenance for the URL→identifier mapping, not as part of any build. The token it used
 * was revoked immediately afterwards, so re-running requires minting a new one:
 *   cd studio && npx sanity tokens add "<label>" --role editor
 * Write it to .env.migration.local (gitignored) and delete the token again when finished — a
 * write-capable credential shouldn't outlive the job it was made for.
 *
 * Requires SANITY_MIGRATION_TOKEN (editor role), read from the environment or
 * .env.migration.local.
 *
 *   node scripts/flake-migration/import-to-sanity.mjs [--dry-run] [--only=<slug>]
 *
 * IDEMPOTENT by construction, so a partial run can simply be re-run:
 *  - document ids are deterministic (`flakeGallery-<slug>`) and written with createOrReplace
 *  - Sanity derives asset ids from a content hash, so re-uploading identical bytes returns the
 *    existing asset rather than duplicating it
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import os from 'node:os'

const run = promisify(execFile)
const HERE = import.meta.dirname
const ROOT = path.resolve(HERE, '../..')
const PROJECT_ID = '8xmrim7j'
const DATASET = 'production'
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`

const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]

/** Longest edge after downscale. The site renders at most 1600px, so this keeps real headroom
 *  (retina, future larger crops) while turning ~1.1 GB of camera originals into ~120 MB. */
const MAX_EDGE = 2400
/** Parallel image workers. Low on purpose — this hammers someone else's origin server. */
const CONCURRENCY = 3

async function getToken() {
  if (process.env.SANITY_MIGRATION_TOKEN) return process.env.SANITY_MIGRATION_TOKEN.trim()
  const f = await readFile(path.join(ROOT, '.env.migration.local'), 'utf8').catch(() => '')
  const m = f.match(/^\s*SANITY_MIGRATION_TOKEN\s*=\s*(.+)$/m)
  if (!m) throw new Error('SANITY_MIGRATION_TOKEN not set (env or .env.migration.local)')
  return m[1].trim()
}

/** Display names come from the site catalog so alt text can never drift from what users see. */
async function loadCatalog() {
  const src = await readFile(path.join(ROOT, 'src/lib/flakeColors.ts'), 'utf8')
  const out = {}
  for (const m of src.matchAll(/\{ id: '([^']+)', name: '((?:[^'\\]|\\')*)'/g)) {
    out[m[1]] = m[2].replace(/\\'/g, "'")
  }
  return out
}

const altFor = (name) => `${name} flake floor coating installed by Next Level Coatings in Arizona`

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Downscale to fit MAX_EDGE, re-encoding to JPEG.
 *
 * ffmpeg applies the EXIF orientation and writes upright pixels with no rotation tag left over.
 * That matters: these photos are stored 4032x3024 landscape with an "orientation 6" flag, so a
 * resize that merely preserved the raw pixels (and dropped the tag) would bake in a 90-degree
 * rotation across the whole gallery.
 */
async function downscaleToJpeg(buf, srcExt) {
  const dir = await mkdir(path.join(os.tmpdir(), `flakemig-${Date.now()}-${Math.random().toString(36).slice(2)}`), { recursive: true })
  const inPath = path.join(dir, `in${srcExt}`)
  const outPath = path.join(dir, 'out.jpg')
  await writeFile(inPath, buf)
  await run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', inPath,
    '-vf', `scale=w='min(${MAX_EDGE},iw)':h='min(${MAX_EDGE},ih)':force_original_aspect_ratio=decrease`,
    '-q:v', '3',
    outPath,
  ])
  const out = await readFile(outPath)
  await rm(dir, { recursive: true, force: true })
  return out
}

async function uploadAsset(token, buf, filename) {
  const res = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/jpeg' },
    body: buf,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`upload HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`)
  return json.document
}

async function mutate(token, mutations) {
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`mutate HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`)
  return json
}

/** Simple bounded-concurrency map that preserves input order in the results. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (true) {
        const i = next++
        if (i >= items.length) return
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}

// ---------------------------------------------------------------------------------------------

const token = DRY_RUN ? 'dry-run' : await getToken()
const catalog = await loadCatalog()
const scraped = JSON.parse(await readFile(path.join(HERE, 'scraped.json'), 'utf8'))
const pages = scraped.pages.filter((p) => (ONLY ? p.flakeSlug === ONLY : true))

const report = []
let totalIn = 0
let totalOut = 0

for (const page of pages) {
  const name = catalog[page.flakeSlug]
  if (!name) {
    report.push({ ...page, imported: 0, failures: [{ url: '-', error: `slug "${page.flakeSlug}" not in catalog` }] })
    console.log(`✗ ${page.flakeSlug}: not in catalog — skipped`)
    continue
  }
  if (!page.ok) {
    report.push({ ...page, name, imported: 0, failures: [{ url: page.url, error: `page fetch failed: ${page.error}` }] })
    console.log(`✗ ${page.flakeSlug}: page fetch failed`)
    continue
  }

  const failures = []
  const results = await mapLimit(page.photoUrls, CONCURRENCY, async (url, i) => {
    try {
      const raw = await download(url)
      const ext = path.extname(new URL(url).pathname) || '.jpg'
      const small = await downscaleToJpeg(raw, ext)
      totalIn += raw.length
      totalOut += small.length
      if (DRY_RUN) return { _key: `dry${i}`, bytes: small.length }
      const asset = await uploadAsset(token, small, `${page.flakeSlug}-${i + 1}.jpg`)
      return {
        _type: 'image',
        _key: `${page.flakeSlug}-${i + 1}`,
        asset: { _type: 'reference', _ref: asset._id },
        alt: altFor(name),
      }
    } catch (err) {
      failures.push({ url, error: String(err.message || err) })
      return null
    }
  })

  const images = results.filter(Boolean)

  if (!DRY_RUN && images.length > 0) {
    await mutate(token, [
      {
        createOrReplace: {
          _id: `flakeGallery-${page.flakeSlug}`,
          _type: 'flakeGallery',
          flakeSlug: page.flakeSlug,
          title: name,
          images,
        },
      },
    ])
  }

  report.push({ path: page.path, flakeSlug: page.flakeSlug, name, found: page.photoUrls.length, imported: images.length, failures })
  const flag = failures.length ? `  (${failures.length} FAILED)` : ''
  console.log(`${failures.length ? '!' : '✓'} ${page.path.padEnd(30)} ${page.flakeSlug.padEnd(13)} ${String(images.length).padStart(2)} imported${flag}`)
}

await writeFile(path.join(HERE, 'import-report.json'), JSON.stringify({ dryRun: DRY_RUN, report }, null, 2))

const mb = (b) => (b / 1048576).toFixed(1)
console.log(`\n--- summary ---`)
console.log(`galleries processed : ${report.length}`)
console.log(`photos imported     : ${report.reduce((n, r) => n + r.imported, 0)}`)
console.log(`failures            : ${report.reduce((n, r) => n + r.failures.length, 0)}`)
console.log(`bytes downloaded    : ${mb(totalIn)} MB`)
console.log(`bytes uploaded      : ${mb(totalOut)} MB`)
const zero = report.filter((r) => r.imported === 0)
if (zero.length) console.log(`\nGALLERIES WITH ZERO PHOTOS: ${zero.map((z) => z.flakeSlug).join(', ')}`)
