#!/usr/bin/env node
/**
 * Step 1 of the one-time flake gallery migration: scrape the old Wix site and work out which
 * images on each color page are that color's real project photos.
 *
 * Read-only. Writes a manifest to scraped.json; uploads nothing. Run before import-to-sanity.mjs.
 *
 * THE HARD PART is not fetching the pages, it's telling a project photo apart from site chrome.
 * Every Wix page embeds the same logo, icons and footer images, so a naive "grab every
 * static.wixstatic.com URL" would attach the company logo to all 25 galleries. We separate them
 * by cross-page frequency: an image that appears on many of the 25 pages is chrome by definition,
 * while a color's project photos are unique to its own page.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.join(import.meta.dirname, 'scraped.json')
const SITE = 'https://www.nextlevelcoatingsaz.com'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

/**
 * Old Wix URL → flakeSlug. Supplied and independently verified by the client (their own color
 * list cross-referenced against visual label matching); NOT derived from the URL text, which is
 * misleading — /copy-of-madras is Marsh, /copy-of-artic-volt is Madras, and so on.
 *
 * flake-04 (Pumice) and flake-26 (Midnight Granite) are absent on purpose: no old page exists
 * for them, and their photos are being sourced separately.
 */
export const URL_TO_SLUG = {
  '/desert-luna': 'domino',
  '/copy-of-denali-blue': 'flake-02',
  '/copy-of-custom-black-blend': 'flake-05',
  '/rattlesnake': 'outback',
  '/mirage': 'cabin-fever',
  '/copy-of-tidal-wave': 'flake-08',
  '/graphite': 'nightfall',
  '/denali-blue': 'flake-10',
  '/copy-of-galaxy': 'flake-11',
  '/copy-of-desert-luna-2': 'flake-12',
  '/copy-of-desert-luna-1': 'flake-13',
  '/copy-of-desert-luna': 'flake-14',
  '/copy-of-gravel': 'flake-15',
  '/copy-of-shoreline-2-0': 'flake-16',
  '/copy-of-schist': 'flake-17',
  '/copy-of-garnet': 'flake-18',
  '/copy-of-basalt': 'shoreline',
  '/copy-of-pumice': 'flake-20',
  '/copy-of-domino-1': 'flake-21',
  '/copy-of-slate-red': 'flake-22',
  '/copy-of-slate-red-1': 'flake-23',
  '/copy-of-madras-1': 'flake-24',
  '/copy-of-artic-volt': 'flake-25',
  '/copy-of-madras': 'flake-27',
  '/copy-of-basalt-1': 'flake-28',
}

/**
 * Wix media paths look like:
 *   .../media/<ns>_<hash>~mv2.jpg/v1/fill/w_600,h_400,.../file.jpg
 * Everything from `/v1/` onward is a resize/crop transform. Dropping it yields the original
 * upload at full resolution, which is what we want to hand to Sanity.
 *
 * The `<ns>_` prefix marks a user-uploaded asset; Wix's own bundled UI sprites are bare hashes
 * with no prefix, so requiring the prefix drops the platform's icons before frequency analysis
 * runs. Note there is MORE THAN ONE namespace on this site — `b0853e_` and `c7c7a4_` both
 * appear, and the project photos on the /copy-of-* pages live under the latter. Matching only
 * the first namespace made 20 of 25 pages look empty when their photos were there all along,
 * so this deliberately accepts any namespace rather than a hardcoded list.
 */
const MEDIA_RE =
  /static\.wixstatic\.com\/media\/([0-9a-z]{6}_[0-9a-f]{16,40}~mv2\.(?:jpg|jpeg|png|webp))/gi

function extractMediaIds(html) {
  const ids = new Set()
  for (const m of html.matchAll(MEDIA_RE)) ids.add(m[1])
  return [...ids]
}

const originalUrl = (mediaId) => `https://static.wixstatic.com/media/${mediaId}`

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

const pages = []
for (const [slugPath, flakeSlug] of Object.entries(URL_TO_SLUG)) {
  const url = `${SITE}${slugPath}`
  try {
    const html = await fetchPage(url)
    const mediaIds = extractMediaIds(html)
    pages.push({ path: slugPath, flakeSlug, url, ok: true, mediaIds, bytes: html.length })
    console.log(`✓ ${slugPath.padEnd(30)} ${flakeSlug.padEnd(13)} ${mediaIds.length} media refs`)
  } catch (err) {
    pages.push({ path: slugPath, flakeSlug, url, ok: false, error: String(err), mediaIds: [] })
    console.log(`✗ ${slugPath.padEnd(30)} ${flakeSlug.padEnd(13)} FETCH FAILED: ${err}`)
  }
}

// Frequency across pages → chrome vs. page-specific.
const freq = new Map()
for (const p of pages) for (const id of p.mediaIds) freq.set(id, (freq.get(id) ?? 0) + 1)

const fetched = pages.filter((p) => p.ok).length
// An image on more than a quarter of the pages is shared furniture, not one color's project
// photo. Deliberately conservative: real project photos showed up on exactly one page each.
const CHROME_THRESHOLD = Math.max(2, Math.ceil(fetched * 0.25))

const chrome = [...freq.entries()].filter(([, n]) => n >= CHROME_THRESHOLD).map(([id]) => id)
const chromeSet = new Set(chrome)

for (const p of pages) {
  p.photoIds = p.mediaIds.filter((id) => !chromeSet.has(id))
  p.photoUrls = p.photoIds.map(originalUrl)
}

await writeFile(
  OUT,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), chromeThreshold: CHROME_THRESHOLD, chrome, pages },
    null,
    2,
  ),
)

console.log(`\n--- summary ---`)
console.log(`pages fetched      : ${fetched}/${pages.length}`)
console.log(`shared chrome imgs : ${chrome.length} (on >= ${CHROME_THRESHOLD} pages, excluded)`)
console.log(`\nper-page project photos:`)
for (const p of pages) {
  const flag = p.photoIds.length === 0 ? '  <-- NO PHOTOS FOUND' : ''
  console.log(`  ${p.path.padEnd(30)} ${p.flakeSlug.padEnd(13)} ${p.photoIds.length}${flag}`)
}
const empty = pages.filter((p) => p.ok && p.photoIds.length === 0)
console.log(`\npages with zero photos: ${empty.length}`)
console.log(`manifest written to ${OUT}`)
