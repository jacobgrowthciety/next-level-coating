import { defineField, defineType } from 'sanity'
import type { SlugValidationContext } from 'sanity'

/**
 * Blog post — the single content type editors (Lisa/Christina) manage in Studio.
 * Fields per the finalized spec: content fields + on-document SEO overrides (no separate SEO doc).
 */
export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description:
        'Auto-generated from the title. Locked once the post is first published so the live URL never changes and existing links keep working.',
      options: {
        source: 'title',
        maxLength: 96,
        // Prevent duplicate slugs across posts.
        isUnique: (slug: string, context: SlugValidationContext) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document?._id.replace(/^drafts\./, '')
          const params = { draft: `drafts.${id}`, published: id, slug }
          const query = `!defined(*[_type == "blogPost" && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
          return client.fetch(query, params)
        },
      },
      // Lock the slug once the document has been published (has a non-draft _id that exists).
      readOnly: ({ document }) => Boolean(document?._id && !document._id.startsWith('drafts.')),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO. Required.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary shown on blog cards and used as the default meta description.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      description: 'Byline — a person or the business name. Free text.',
    }),

    // --- SEO overrides (all optional; fall back to content fields at render time) ---
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Optional. Overrides the page <title>. Falls back to the post Title if blank.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Optional. Overrides the meta description. Falls back to the Excerpt if blank.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OG)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Optional. Overrides the social preview image. Falls back to Featured Image.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'featuredImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
})
