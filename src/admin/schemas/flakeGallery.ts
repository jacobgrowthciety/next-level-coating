import { defineArrayMember, defineField, defineType } from 'sanity'
import type { ValidationContext } from 'sanity'

/**
 * Per-color project gallery for the Flake Color Chart (`/flake-color-chart/:flakeSlug`).
 *
 * One document per flake color that the client has actually sent project photos for. Colors
 * without a document — or with one whose `images` array is empty — render an on-brand
 * "coming soon" empty state on the site rather than a broken page, so it is safe to create
 * these incrementally as photos come in.
 *
 * `flakeSlug` is NOT a Sanity `slug` type on purpose: it must match an identifier that already
 * exists in the front end (src/lib/flakeColors.ts, which the swatch grid also reads), so it is
 * a plain string constrained to that fixed list rather than something editors free-type or
 * auto-generate from the title. A typo here silently produces a page nobody can reach, which is
 * why the field is a dropdown and validated against the known identifiers.
 */

/**
 * The flake color identifiers, mirroring src/lib/flakeColors.ts on the site side.
 *
 * Kept as a literal copy rather than imported from src/lib/flakeColors.ts. Since this schema
 * moved under src/ that import would now resolve, but it would pull the site's swatch catalog
 * (and whatever it in turn imports) into the Studio chunk to read twenty-eight identifiers. If a
 * swatch is added, removed or renamed in src/lib/flakeColors.ts, update this list to match.
 *
 * Titles are the real color names so editors pick a recognizable color rather than decoding a
 * positional id; the mismatch between the two (e.g. "Raven" → `flake-02`) is expected, because
 * the identifier is a permanent URL key and the name is presentation. `(Order only)` is
 * appended purely as a picker hint — the site reads order-only status from its own catalog, not
 * from here, since the swatch grid renders without any Sanity fetch.
 *
 * Listed in the same on-page grid order as the site catalog.
 */
const FLAKE_SLUG_OPTIONS: { title: string; value: string }[] = [
  { title: 'Domino', value: 'domino' },
  { title: 'Raven', value: 'flake-02' },
  { title: 'Pumice', value: 'flake-04' },
  { title: 'Tidal Wave', value: 'flake-05' },
  { title: 'Outback', value: 'outback' },
  { title: 'Cabin Fever', value: 'cabin-fever' },
  { title: 'Galaxy', value: 'flake-08' },
  { title: 'Nightfall', value: 'nightfall' },
  { title: 'Denali Blue', value: 'flake-10' },
  { title: 'Nester 1" (Premium Blend)', value: 'flake-11' },
  { title: 'Nester 1/4" (Premium Blend)', value: 'flake-12' },
  { title: 'Gravel', value: 'flake-13' },
  { title: 'Schist', value: 'flake-14' },
  { title: 'Slate (Order only)', value: 'flake-15' },
  { title: 'Garnet', value: 'flake-16' },
  { title: 'Basalt', value: 'flake-17' },
  { title: 'Keystone (Order only)', value: 'flake-18' },
  { title: 'Shoreline', value: 'shoreline' },
  { title: 'Slate Red (Order only)', value: 'flake-20' },
  { title: 'Glacier Blue (Order only)', value: 'flake-21' },
  { title: 'Arctic Volt (Order only)', value: 'flake-22' },
  { title: 'Domino Premium 1" (Order only)', value: 'flake-23' },
  { title: 'Iron Red (Order only)', value: 'flake-24' },
  { title: 'Madras (Order only)', value: 'flake-25' },
  { title: 'Midnight Granite (Premium Blend)', value: 'flake-26' },
  { title: 'Marsh (Order only)', value: 'flake-27' },
  { title: 'Dolerite', value: 'flake-28' },
]

export default defineType({
  name: 'flakeGallery',
  title: 'Flake Color Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'flakeSlug',
      title: 'Flake Color',
      type: 'string',
      description:
        'Which swatch on the Flake Color Chart this gallery belongs to. This sets the page URL (/flake-color-chart/<value>) and must match the swatch identifier used on the site, so pick from the list rather than typing a value.',
      options: {
        list: FLAKE_SLUG_OPTIONS,
      },
      validation: (rule) =>
        rule
          .required()
          // Belt-and-braces alongside the dropdown: `options.list` is a UI affordance, not a
          // constraint — a value set via the API or left over from a renamed swatch would
          // otherwise pass validation and produce an unreachable page.
          .custom((value) =>
            !value || FLAKE_SLUG_OPTIONS.some((o) => o.value === value)
              ? true
              : `"${value}" is not a known flake color identifier.`,
          ),
    }),
    defineField({
      name: 'flakeSlugUnique',
      title: 'Duplicate check',
      type: 'string',
      hidden: true,
      readOnly: true,
      // A second gallery for the same color would be unreachable — the site's GROQ takes [0],
      // so one of the two would silently never render. Surfaced as a validation error on a
      // hidden helper field so the message appears without cluttering the form.
      validation: (rule) =>
        rule.custom(async (_value, context: ValidationContext) => {
          const { document, getClient } = context
          const flakeSlug = (document as { flakeSlug?: string } | undefined)?.flakeSlug
          if (!flakeSlug || !document?._id) return true
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document._id.replace(/^drafts\./, '')
          const params = { draft: `drafts.${id}`, published: id, flakeSlug }
          const duplicate = await client.fetch<string | null>(
            `*[_type == "flakeGallery" && !(_id in [$draft, $published]) && flakeSlug == $flakeSlug][0]._id`,
            params,
          )
          return duplicate ? 'Another gallery already uses this flake color.' : true
        }),
    }),
    defineField({
      name: 'title',
      title: 'Display Name',
      type: 'string',
      description:
        'The color name shown as the page heading, e.g. "Domino". Leave blank and the site falls back to a name derived from the identifier above.',
    }),
    defineField({
      name: 'images',
      title: 'Project Photos',
      type: 'array',
      description:
        'Real project photos for this color. An empty list is fine — the page shows a "coming soon" state until photos are added.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the photo for screen readers and SEO. Required.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional. Shown under the photo when enlarged.',
            }),
          ],
          preview: {
            select: { title: 'caption', subtitle: 'alt', media: 'asset' },
            prepare({ title, subtitle, media }) {
              return { title: title || subtitle || 'Photo', subtitle: title ? subtitle : '', media }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', flakeSlug: 'flakeSlug', media: 'images.0', images: 'images' },
    prepare({
      title,
      flakeSlug,
      media,
      images,
    }: {
      title?: string
      flakeSlug?: string
      media?: unknown
      images?: unknown[]
    }) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: title || flakeSlug || 'Untitled gallery',
        subtitle: count === 0 ? 'No photos yet' : `${count} photo${count === 1 ? '' : 's'}`,
        media: media as never,
      }
    },
  },
})
