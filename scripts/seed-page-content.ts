/**
 * Emits the initial `pageContent` documents — one per fixed marketing page — as NDJSON on stdout.
 *
 * The copy comes from src/lib/pageContentData.ts, the same map the site falls back to when
 * Sanity is unavailable. That is the whole point of the indirection: the documents editors start
 * from are by construction identical to what the site ships, so wiring the pages up to Sanity
 * cannot change a single word of live copy.
 *
 * Usage, from the repo root:
 *
 *   node scripts/seed-page-content.ts > /tmp/page-content.ndjson
 *   cd studio && npx sanity documents create /tmp/page-content.ndjson --replace
 *
 * `--replace` makes this idempotent: document ids are derived from the route (see
 * pageContentDocId), so re-running overwrites the same 12 documents rather than creating a
 * second set that the schema's uniqueness check would reject.
 *
 * Re-running OVERWRITES whatever editors have since published. It is a first-run/reset tool,
 * not a sync — after handover, treat Sanity as the source of truth for this copy.
 *
 * Ids carry no `drafts.` prefix, so these are created published and are live immediately.
 */
import {
  PAGE_CONTENT_FALLBACKS,
  PAGE_ROUTES,
  pageContentDocId,
  type PageRoute,
} from '../src/lib/pageContentData.ts'

/** A Portable Text paragraph. Keys are derived from position so repeated runs emit byte-identical
 * documents — random keys would make every re-seed look like a content change in Sanity history. */
function paragraph(keyPrefix: string, index: number, text: string) {
  const key = `${keyPrefix}-p${index}`
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-s0`, text, marks: [] }],
  }
}

function buildDocument(route: PageRoute) {
  const fb = PAGE_CONTENT_FALLBACKS[route]
  return {
    _id: pageContentDocId(route),
    _type: 'pageContent',
    pageRoute: route,
    metaTitle: fb.metaTitle,
    metaDescription: fb.metaDescription,
    h1: fb.h1,
    bodyContent: fb.body.map((text, i) => paragraph(`${pageContentDocId(route)}-intro`, i, text)),
    bodySections: fb.sections.map((section, s) => ({
      _type: 'bodySection',
      _key: `${pageContentDocId(route)}-s${s}`,
      // Omitted rather than set empty where the layout has no heading in that position, so the
      // field reads as "not applicable here" in Studio rather than "someone deleted this".
      ...(section.heading ? { sectionHeading: section.heading } : {}),
      sectionBody: section.body.map((text, i) =>
        paragraph(`${pageContentDocId(route)}-s${s}`, i, text),
      ),
    })),
    // `ogImage` is deliberately NOT seeded. It is a Sanity image asset, and the image each page
    // currently shares is a file in public/ that the code already falls back to — uploading
    // copies into the asset store would duplicate them for no gain. Editors see an empty field
    // that means "keep the current image", and setting one overrides it.
  }
}

const lines = PAGE_ROUTES.map((route) => JSON.stringify(buildDocument(route)))
process.stdout.write(lines.join('\n') + '\n')
