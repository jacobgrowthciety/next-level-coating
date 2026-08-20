import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { PAGE_ROUTE_OPTIONS } from './schemas/pageContent'

/**
 * The Studio configuration, shared by the two places Studio runs:
 *
 *  - studio/sanity.config.ts       — the standalone build (`npx sanity deploy` → *.sanity.studio)
 *  - src/admin/sanity.config.ts    — embedded in the marketing site at /admin
 *
 * This file and the schemas live under src/ rather than studio/ so that both builds resolve
 * `sanity` from the one install at the repo root. studio/ has its own node_modules, and a
 * `sanity` import from a file inside it resolves to a second copy whose types and React context
 * are incompatible with the site's — which surfaces as pages of unassignable-type errors at build
 * time and mismatched-context failures at runtime.
 *
 * Both call this factory so the schema list and tools cannot drift apart between them. The two
 * differences that cannot be shared are passed in: `basePath` (only the embedded copy is mounted
 * under a path) and `projectId` (each entry point reads its own environment — Node's `process.env`
 * in the standalone build, Vite's `import.meta.env` in the browser bundle, and neither expression
 * is valid in the other's runtime, so neither may appear in this file).
 */

/** The live site. Presentation frames this origin, so it is also what editors preview against. */
export const PRODUCTION_ORIGIN = 'https://www.nextlevelcoatingsaz.com'

interface StudioConfigOptions {
  projectId: string
  /** Path Studio is mounted at. Omitted for the standalone build, which owns its whole origin. */
  basePath?: string
}

export function createStudioConfig({ projectId, basePath }: StudioConfigOptions) {
  return defineConfig({
    name: 'default',
    title: 'Next Level Coatings',
    projectId,
    dataset: 'production',
    ...(basePath ? { basePath } : {}),
    plugins: [
      structureTool(),

      /**
       * Live preview beside the editor.
       *
       * Two limits worth knowing before trusting what the iframe shows:
       *
       * 1. It frames PRODUCTION, so it renders *published* content. Edits in the form do not
       *    appear in the preview until the document is published. Showing unpublished drafts
       *    requires the site to fetch with a draft perspective behind an authenticated preview
       *    route, which this site has no server to host — it is a static SPA.
       * 2. There is no click-to-edit overlay. That is Visual Editing, a separate feature needing
       *    @sanity/visual-editing plus stega-encoded content on the front end; without it,
       *    Presentation may show its "not connected" indicator. The iframe itself still loads
       *    and navigates normally, which is what this is here for.
       */
      presentationTool({
        previewUrl: PRODUCTION_ORIGIN,
        resolve: {
          /**
           * The reverse of `locations` below: given the page currently in the iframe, which
           * document produced it. This is what fills Presentation's "Documents on this page"
           * panel — without it that panel reads "No matching documents" on every page, because
           * Presentation has no way to guess the relationship.
           */
          mainDocuments: defineDocuments([
            {
              // `pageRoute` is the URL path, so the document is found by matching it against the
              // path being previewed. Restricted to the known routes rather than a catch-all so
              // this cannot shadow the blog rule below.
              route: PAGE_ROUTE_OPTIONS.map((o) => o.value),
              resolve: (context) => ({
                filter: '_type == "pageContent" && pageRoute == $pageRoute',
                // Normalised because a previewed URL may arrive with a trailing slash while the
                // stored `pageRoute` never has one — '/patios/' must still find '/patios'. The
                // homepage is the exception: '/' is its real value and must survive intact.
                params: { pageRoute: context.path.replace(/(.)\/+$/, '$1') },
              }),
            },
            {
              route: '/blog/:slug',
              resolve: (context) =>
                context.params.slug
                  ? {
                      filter: '_type == "blogPost" && slug.current == $slug',
                      params: { slug: context.params.slug },
                    }
                  : undefined,
            },
          ]),

          locations: {
            // Sends the editor straight to the page they are editing rather than the homepage.
            // `pageRoute` is already the live URL path, so it is the href with no mapping.
            pageContent: defineLocations({
              select: { pageRoute: 'pageRoute', h1: 'h1' },
              resolve: (doc: { pageRoute?: string; h1?: string } | null) => ({
                locations: doc?.pageRoute
                  ? [{ title: doc.h1 || doc.pageRoute, href: doc.pageRoute }]
                  : [],
              }),
            }),

            // A post has no location until it has a slug — a brand new draft would otherwise
            // resolve to '/blog/undefined' and preview a Coming Soon page.
            blogPost: defineLocations({
              select: { title: 'title', slug: 'slug.current' },
              resolve: (doc: { title?: string; slug?: string } | null) =>
                doc?.slug
                  ? { locations: [{ title: doc.title || doc.slug, href: `/blog/${doc.slug}` }] }
                  : { locations: [] },
            }),
          },
        },
      }),

      visionTool(),
    ],
    schema: { types: schemaTypes },
  })
}
