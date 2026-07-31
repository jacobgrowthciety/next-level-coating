#!/usr/bin/env node
/**
 * Syncs `/flake-color-chart/<id>` entries in public/sitemap.xml with the flake galleries that
 * actually have photos in Sanity.
 *
 * WHY A SCRIPT: the site is a client-rendered SPA with no build-time Sanity fetch (see
 * src/lib/sanity.ts), and sitemap.xml is a static file — so nothing in the normal build knows
 * which colors have galleries. Only colors with at least one photo belong in the sitemap;
 * a gallery document with an empty `images` array renders the "coming soon" state and would be
 * thin content if indexed. The site marks those pages `noindex` on the same condition, so this
 * script and the page agree by construction.
 *
 * Run after adding or emptying galleries in Studio:
 *   npm run sitemap:flake
 *
 * Reads VITE_SANITY_PROJECT_ID from .env.local (or the environment). Read-only, no token needed,
 * no writes.
 *
 * Deliberately queries the UNCACHED api host, not apicdn: the CDN lags a publish by up to ~60s,
 * and the whole point of running this is to act on a change just made in Studio. Using the CDN
 * here silently re-adds a gallery that was just emptied (confirmed in testing).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml')
const SITE_URL = 'https://www.nextlevelcoatingsaz.com'
const DATASET = 'production'
const API_VERSION = 'v2024-01-01'
const PRIORITY = '0.6'

async function resolveProjectId() {
  if (process.env.VITE_SANITY_PROJECT_ID) return process.env.VITE_SANITY_PROJECT_ID.trim()
  const envFile = path.join(ROOT, '.env.local')
  if (!existsSync(envFile)) return ''
  const match = (await readFile(envFile, 'utf8')).match(/^\s*VITE_SANITY_PROJECT_ID\s*=\s*(.+)$/m)
  return match ? match[1].trim() : ''
}

async function fetchPopulatedSlugs(projectId) {
  const query = '*[_type == "flakeGallery" && count(images) > 0].flakeSlug'
  const url =
    `https://${projectId}.api.sanity.io/${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${res.statusText}`)
  const { result } = await res.json()
  // Dedupe and sort so the generated block is stable across runs (no churn in git diffs).
  return [...new Set((result ?? []).filter(Boolean))].sort()
}

function buildEntry(slug, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}/flake-color-chart/${slug}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${PRIORITY}</priority>`,
    '  </url>',
  ].join('\n')
}

const projectId = await resolveProjectId()
if (!projectId) {
  console.error('VITE_SANITY_PROJECT_ID is not set (checked env and .env.local). Aborting.')
  process.exit(1)
}

const slugs = await fetchPopulatedSlugs(projectId)
let xml = await readFile(SITEMAP, 'utf8')

// Drop every existing per-color entry, then re-add the current set. Rebuilding rather than
// patching keeps removals working: a gallery emptied in Studio must lose its sitemap entry.
xml = xml.replace(
  /[ \t]*<url>\s*<loc>[^<]*\/flake-color-chart\/[^<]+<\/loc>[\s\S]*?<\/url>\n?/g,
  '',
)

if (slugs.length > 0) {
  const lastmod = new Date().toISOString().slice(0, 10)
  const block = slugs.map((slug) => buildEntry(slug, lastmod)).join('\n')
  // Insert after the chart's own page so related URLs stay adjacent; fall back to the end.
  const anchor = `${SITE_URL}/flake-color-chart</loc>`
  const anchorIdx = xml.indexOf(anchor)
  if (anchorIdx !== -1) {
    const insertAt = xml.indexOf('</url>', anchorIdx) + '</url>'.length
    xml = `${xml.slice(0, insertAt)}\n${block}${xml.slice(insertAt)}`
  } else {
    xml = xml.replace('</urlset>', `${block}\n</urlset>`)
  }
}

await writeFile(SITEMAP, xml, 'utf8')

const total = (xml.match(/<loc>/g) ?? []).length
console.log(
  slugs.length === 0
    ? `No flake galleries have photos yet — removed any stale per-color entries. Sitemap has ${total} URLs.`
    : `Synced ${slugs.length} flake gallery URL(s): ${slugs.join(', ')}. Sitemap has ${total} URLs.`,
)
