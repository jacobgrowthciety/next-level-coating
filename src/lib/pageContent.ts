import { useEffect, useState } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import { isSanityConfigured, sanityClient } from './sanity'
import {
  PAGE_CONTENT_FALLBACKS,
  type PageBodySectionFallback,
  type PageRoute,
} from './pageContentData'

/**
 * Editable copy for the 12 fixed marketing pages, backed by Sanity `pageContent` documents.
 *
 * The contract, in one line: **Sanity overrides, it never originates.** Every page still ships
 * its launch copy (in ./pageContentData.ts), renders it on first paint, and only swaps in
 * Sanity's version once a fetch resolves with something non-empty. A Sanity outage, a missing
 * document, a misconfigured project id, or an editor who blanks a field all degrade to exactly
 * what the page shipped with — never to an empty heading, a missing <title>, or a gap where a
 * section used to be.
 *
 * That first paint matters beyond outages. This is a client-rendered SPA, so the meta tags a
 * crawler sees are whatever is in the DOM when it snapshots the page. Rendering the fallback
 * synchronously means the tags are never empty or wrong while the fetch is in flight; Sanity's
 * values replace them a moment later.
 */

export { PAGE_ROUTES, type PageRoute } from './pageContentData'

/** One resolved prose slot: an optional H2 plus its paragraphs. */
export interface PageBodySection {
  heading?: string
  body: PortableTextBlock[]
}

/** Resolved copy handed to a page — prose is always Portable Text so there is one render path. */
export interface PageContent {
  metaTitle: string
  metaDescription: string
  h1: string
  bodyContent: PortableTextBlock[]
  bodySections: PageBodySection[]
  /** Absolute URL, or undefined to let <Seo> use the site-wide default. */
  ogImage?: string
}

/** What a page header section receives. Both values are pre-resolved, so neither is ever empty by accident. */
export interface PageIntroProps {
  h1: string
  body: PortableTextBlock[]
}

/** What a page's main body section receives — one entry per layout slot, in slot order. */
export interface PageDetailsProps {
  sections: PageBodySection[]
}

/**
 * Turn plain fallback paragraphs into Portable Text so pages have a single render path instead
 * of branching on "did this come from Sanity or from the bundle".
 *
 * Keys are derived from the route and position rather than random: these blocks are rebuilt on
 * every call, and a stable key keeps React from remounting the paragraphs on each swap.
 */
function paragraphsToBlocks(keyPrefix: string, paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `${keyPrefix}-${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${keyPrefix}-${i}-0`, text, marks: [] }],
  })) as unknown as PortableTextBlock[]
}

function fallbackSections(route: PageRoute, sections: PageBodySectionFallback[]): PageBodySection[] {
  return sections.map((section, i) => ({
    heading: section.heading,
    body: paragraphsToBlocks(`fallback-${route}-s${i}-p`, section.body),
  }))
}

/** The shipped copy for a route, in the same shape Sanity returns. */
export function fallbackContent(route: PageRoute): PageContent {
  const fb = PAGE_CONTENT_FALLBACKS[route]
  return {
    metaTitle: fb.metaTitle,
    metaDescription: fb.metaDescription,
    h1: fb.h1,
    bodyContent: paragraphsToBlocks(`fallback-${route}-intro-p`, fb.body),
    bodySections: fallbackSections(route, fb.sections),
    ogImage: fb.ogImage,
  }
}

/**
 * One document per route; `[0]` is safe because the schema rejects duplicates.
 *
 * `ogImage` is dereferenced to its CDN URL here rather than resolved with the image-url builder
 * on the client — <Seo> needs a plain absolute string, and this keeps the asset lookup in the
 * one round trip the page already makes.
 */
export const PAGE_CONTENT_QUERY = `*[_type == "pageContent" && pageRoute == $route][0]{
  metaTitle,
  metaDescription,
  h1,
  bodyContent,
  bodySections[]{ sectionHeading, sectionBody },
  "ogImage": ogImage.asset->url
}`

/** What Sanity may return — every field optional, because a draft can be partially filled. */
interface PageContentDoc {
  metaTitle?: string
  metaDescription?: string
  h1?: string
  bodyContent?: PortableTextBlock[]
  bodySections?: { sectionHeading?: string; sectionBody?: PortableTextBlock[] }[]
  ogImage?: string | null
}

/** Social platforms want a landscape crop; Sanity can do it at the CDN so we never ship a 4MB original. */
function sizeForSocial(url: string): string {
  return url.includes('cdn.sanity.io') ? `${url}?w=1200&h=630&fit=crop&auto=format` : url
}

/**
 * Merge Sanity's sections over the shipped ones, slot by slot.
 *
 * The shipped array defines the structure: a page has as many prose slots as its layout draws,
 * so the result is always exactly that many, and anything extra Sanity returns is ignored
 * (it would have nowhere to render). Within a slot, blank falls back — an empty rich text value
 * or a cleared heading yields the shipped copy rather than a gap in the middle of the page,
 * which is the failure mode worth protecting against on a live marketing site.
 *
 * The corollary is that a heading cannot be deleted, only rewritten. That is deliberate: these
 * H2s are part of the page's heading outline, and silently dropping one is exactly the kind of
 * structural change the fixed-slot design exists to prevent.
 */
function mergeSections(route: PageRoute, docSections: PageContentDoc['bodySections']): PageBodySection[] {
  const shipped = fallbackSections(route, PAGE_CONTENT_FALLBACKS[route].sections)
  return shipped.map((fallbackSection, i) => {
    const incoming = docSections?.[i]
    const body =
      Array.isArray(incoming?.sectionBody) && incoming.sectionBody.length
        ? incoming.sectionBody
        : fallbackSection.body
    return {
      heading: incoming?.sectionHeading?.trim() || fallbackSection.heading,
      body,
    }
  })
}

/**
 * Merge a Sanity document over the shipped copy, field by field.
 *
 * Field-by-field rather than all-or-nothing so one blank field cannot wipe a page: an editor who
 * clears the meta description gets the shipped description back, not an empty tag. Whitespace
 * counts as blank for the string fields.
 *
 * `bodyContent` is the deliberate exception — an empty array is honoured as "show nothing here",
 * because that is a real editorial choice and the Contact page's shipped state. Body *sections*
 * work the other way (see mergeSections): a blank one falls back, because an empty slot mid-page
 * is a hole, not a choice.
 */
function mergeWithFallback(route: PageRoute, doc: PageContentDoc | null): PageContent {
  const fb = fallbackContent(route)
  if (!doc) return fb
  return {
    metaTitle: doc.metaTitle?.trim() || fb.metaTitle,
    metaDescription: doc.metaDescription?.trim() || fb.metaDescription,
    h1: doc.h1?.trim() || fb.h1,
    bodyContent: Array.isArray(doc.bodyContent) ? doc.bodyContent : fb.bodyContent,
    bodySections: mergeSections(route, doc.bodySections),
    ogImage: doc.ogImage ? sizeForSocial(doc.ogImage) : fb.ogImage,
  }
}

/**
 * Resolved content, cached per route for the life of the page session.
 *
 * Without this, every client-side navigation back to a page refetches and the copy visibly
 * re-swaps from fallback to Sanity a second time. `inFlight` dedupes concurrent callers.
 */
const cache = new Map<PageRoute, PageContent>()
const inFlight = new Map<PageRoute, Promise<PageContent>>()

function loadPageContent(route: PageRoute): Promise<PageContent> {
  const cached = cache.get(route)
  if (cached) return Promise.resolve(cached)

  const existing = inFlight.get(route)
  if (existing) return existing

  const request = sanityClient
    .fetch<PageContentDoc | null>(PAGE_CONTENT_QUERY, { route })
    .then((doc) => mergeWithFallback(route, doc))
    // Network error, CORS rejection, malformed response — the page keeps what it shipped with.
    .catch(() => fallbackContent(route))
    .then((content) => {
      cache.set(route, content)
      inFlight.delete(route)
      return content
    })

  inFlight.set(route, request)
  return request
}

/**
 * Page copy for `route`: the shipped fallback synchronously, replaced by Sanity's version once
 * it arrives. Never returns null and never suspends, so callers need no loading state.
 */
export function usePageContent(route: PageRoute): PageContent {
  const [content, setContent] = useState<PageContent>(
    () => cache.get(route) ?? fallbackContent(route),
  )

  useEffect(() => {
    // Nothing to fetch without a project id — `sanityClient` is pointed at a dummy project in
    // that case (see lib/sanity.ts) and would fail on every page load.
    if (!isSanityConfigured) return

    let active = true
    setContent(cache.get(route) ?? fallbackContent(route))
    loadPageContent(route).then((resolved) => {
      // Guard against a route change resolving out of order and writing another page's copy.
      if (active) setContent(resolved)
    })
    return () => {
      active = false
    }
  }, [route])

  return content
}
