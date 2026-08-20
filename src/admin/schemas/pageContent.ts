import { defineArrayMember, defineField, defineType } from 'sanity'
import type { PortableTextBlock, ValidationContext } from 'sanity'

/**
 * Editable copy for the 12 fixed marketing pages.
 *
 * Unlike `blogPost`/`flakeGallery`, these documents do not create pages — the routes already
 * exist in the site's router and ship hardcoded copy as a fallback. A document here *overrides*
 * that copy. So a missing, unpublished or malformed document is never a broken page; it just
 * means the page renders what it shipped with (see src/lib/pageContent.ts on the site side).
 *
 * `pageRoute` is the join key and is a fixed dropdown rather than free text: it must match a
 * route the router actually serves, and a typo would produce a document that silently overrides
 * nothing. One document per route — see the uniqueness check below for why a second one is
 * worse than useless.
 */

/**
 * The routes that accept editable content, mirroring the static <Route> paths in src/App.tsx.
 *
 * Kept as a literal copy rather than imported from src/lib/pageContentData.ts so this schema
 * pulls nothing from the site's module graph into the Studio chunk (same reasoning as
 * FLAKE_SLUG_OPTIONS in flakeGallery.ts). If a route is added or renamed in src/App.tsx, update
 * this list and PAGE_ROUTES in src/lib/pageContentData.ts together.
 *
 * Values are the live URL paths so the Presentation preview can build a URL from the field
 * directly, with no second lookup table to drift out of sync.
 *
 * The dynamic routes (/blog, /blog/:slug, /flake-color-chart/:slug) are deliberately absent:
 * their copy comes from blogPost/flakeGallery documents instead.
 */
export const PAGE_ROUTE_OPTIONS: { title: string; value: string }[] = [
  { title: 'Home', value: '/' },
  { title: 'About', value: '/about' },
  { title: 'Commercial', value: '/commercial' },
  { title: 'Concrete Coatings', value: '/concrete-coatings' },
  { title: 'Garage Flooring', value: '/garage-flooring' },
  { title: 'Patios', value: '/patios' },
  { title: 'Pool Decks', value: '/pool-decks' },
  { title: 'Residential', value: '/residential' },
  { title: 'Polished Concrete', value: '/polished-concrete' },
  { title: 'Solid Color Chart', value: '/solid-color-chart' },
  { title: 'Flake Color Chart', value: '/flake-color-chart' },
  { title: 'Contact', value: '/contact' },
]

/**
 * A paragraph-only rich text block, shared by the intro copy and every body section.
 *
 * Headings are deliberately absent from `styles`. Each page already has exactly one H1, and body
 * sections carry their own H2 as a separate `sectionHeading` field — letting editors also apply
 * heading styles *inside* the prose would let a stray H2 or H3 appear at an arbitrary depth and
 * quietly wreck the page's heading outline, which is the one structural thing an SEO agency
 * cannot afford to get wrong by accident.
 *
 * Returned from a function rather than shared as a constant because Sanity mutates the schema
 * objects it is handed during compilation; reusing one object across two fields makes the second
 * field inherit the first's compiled state.
 */
function proseBlock() {
  return defineArrayMember({
    type: 'block',
    styles: [{ title: 'Paragraph', value: 'normal' }],
    lists: [{ title: 'Bullet', value: 'bullet' }],
    marks: {
      decorators: [
        { title: 'Bold', value: 'strong' },
        { title: 'Italic', value: 'em' },
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule) =>
                rule
                  .required()
                  // allowRelative so editors can link to another page on this site ("/contact")
                  // as well as off-site.
                  .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
            }),
          ],
        }),
      ],
    },
  })
}

/** First readable line of a rich text value, for list previews. */
function firstLineOf(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  for (const block of blocks as PortableTextBlock[]) {
    const children = (block as { children?: { text?: string }[] }).children
    const text = (children || [])
      .map((c) => c.text || '')
      .join('')
      .trim()
    if (text) return text
  }
  return ''
}

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'pageRoute',
      title: 'Page',
      type: 'string',
      // Shown on both tabs so it's always clear which page is being edited.
      group: ['content', 'seo'],
      description:
        'Which page this content belongs to. Pick from the list — this is the live URL path, not a name you can free-type.',
      options: { list: PAGE_ROUTE_OPTIONS },
      validation: (rule) =>
        rule
          .required()
          // `options.list` is a dropdown affordance, not a constraint — a value written through
          // the API, or left behind by a renamed route, would otherwise validate fine and
          // produce a document that overrides a page nobody serves.
          .custom((value) =>
            !value || PAGE_ROUTE_OPTIONS.some((o) => o.value === value)
              ? true
              : `"${value}" is not a page on this site.`,
          )
          // A second document for the same route would be unreachable: the site's GROQ takes
          // [0], so whichever one loses the ordering coin-flip silently never renders, and an
          // editor would see their published edits not appear with no error anywhere.
          .custom(async (value, context: ValidationContext) => {
            const { document, getClient } = context
            if (!value || !document?._id) return true
            const client = getClient({ apiVersion: '2024-01-01' })
            const id = document._id.replace(/^drafts\./, '')
            const duplicate = await client.fetch<string | null>(
              `*[_type == "pageContent" && !(_id in [$draft, $published]) && pageRoute == $pageRoute][0]._id`,
              { draft: `drafts.${id}`, published: id, pageRoute: value },
            )
            return duplicate ? 'Another document already covers this page.' : true
          }),
    }),

    defineField({
      name: 'h1',
      title: 'Page Heading (H1)',
      type: 'string',
      group: 'content',
      description:
        'The main heading at the top of the page. One per page — this is the H1 search engines read.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bodyContent',
      title: 'Intro Copy',
      type: 'array',
      group: 'content',
      description:
        'The short copy directly under the heading, in the page\'s dark header band. Add as many paragraphs as you need — press Enter for a new one. Leave empty to show nothing there (this is how the Contact page ships).',
      of: [proseBlock()],
      // Deliberately not required: the Contact page ships with no copy under its heading (its
      // header carries the phone number and email address instead), so an empty array is a
      // legitimate value that reproduces the page as built rather than a missing one.
    }),

    defineField({
      name: 'bodySections',
      title: 'Body Sections',
      type: 'array',
      group: 'content',
      description:
        "The main copy further down the page. Each section is a fixed slot in the page's layout — rewrite the words and headings freely, but sections cannot be added, removed or reordered, because the design places things like the benefit cards and process list between them.",
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bodySection',
          title: 'Section',
          fields: [
            defineField({
              name: 'sectionHeading',
              title: 'Section Heading (H2)',
              type: 'string',
              description:
                'Optional. Leave blank where the layout has no heading in this position — some sections are plain copy.',
            }),
            defineField({
              name: 'sectionBody',
              title: 'Section Copy',
              type: 'array',
              of: [proseBlock()],
              description:
                'Leave this empty and the page falls back to the copy it shipped with, rather than rendering a gap.',
            }),
          ],
          preview: {
            select: { heading: 'sectionHeading', body: 'sectionBody' },
            prepare({ heading, body }: { heading?: string; body?: unknown }) {
              const line = firstLineOf(body)
              const count = Array.isArray(body) ? body.length : 0
              return {
                title: heading || line || 'Empty section',
                subtitle: heading
                  ? line
                  : `${count} paragraph${count === 1 ? '' : 's'}${count ? '' : ' — will use the shipped copy'}`,
              }
            },
          },
        }),
      ],
      options: {
        // The array models fixed layout slots, not a list. Reordering would put a section's copy
        // under another section's heading, and adding one gives it nowhere to render — the page
        // component draws a fixed number of slots. Locked here so the constraint is enforced in
        // the UI rather than explained in a description nobody reads.
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate'],
      },
      // Belt and braces for writes that bypass the Studio UI, where disableActions does nothing.
      validation: (rule) => rule.max(3),
    }),

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description:
        'The page title shown in the browser tab and in Google results. Aim for under ~60 characters so it is not truncated.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'The summary shown under the title in Google results. Aim for under ~160 characters so it is not truncated.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description:
        'Optional. The picture shown when this page is shared on Facebook, LinkedIn or in a text message. Leave blank to keep the image the page already uses. Landscape works best — it is cropped to roughly 1200x630.',
    }),
  ],

  // Sort by the on-screen page name rather than the route so the list reads like the nav.
  orderings: [
    {
      name: 'pageRoute',
      title: 'Page',
      by: [{ field: 'pageRoute', direction: 'asc' }],
    },
  ],

  preview: {
    select: { pageRoute: 'pageRoute', metaTitle: 'metaTitle', h1: 'h1' },
    prepare({ pageRoute, metaTitle, h1 }: { pageRoute?: string; metaTitle?: string; h1?: string }) {
      const known = PAGE_ROUTE_OPTIONS.find((o) => o.value === pageRoute)
      return {
        // Fall back to the raw route so an unrecognized value is visible in the list rather
        // than showing as an untitled document.
        title: known?.title || pageRoute || 'Unassigned page',
        subtitle: metaTitle || h1 || pageRoute || '',
      }
    },
  },
})
