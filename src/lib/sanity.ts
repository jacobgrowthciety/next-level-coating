import { createClient, type SanityClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import type { PortableTextBlock } from '@portabletext/react'

/**
 * Sanity read client for the blog. This is a pure client-rendered SPA (see components/Seo.tsx),
 * so posts are fetched live in the browser — there's no build-time baking and no deploy hook.
 * `useCdn: true` serves from Sanity's cached CDN (~60s propagation after publish), which is the
 * right trade for public read-only content.
 *
 * Requires VITE_SANITY_PROJECT_ID (see .env.example) and a PUBLIC `production` dataset so
 * unauthenticated browser reads don't 401. The site's origin must be added to Sanity's CORS
 * origins (API settings) for the browser fetch to be allowed.
 */
const PROJECT_ID = (import.meta.env.VITE_SANITY_PROJECT_ID || '').trim()
const PLACEHOLDER_ID = 'your_project_id_here'

/**
 * True only when a real, syntactically valid project ID is configured. Sanity project IDs are
 * `[a-z0-9-]`, and `createClient` throws synchronously on an invalid one — which would crash the
 * whole SPA at import. So we gate on this and feed a valid dummy ID when it's not set yet, letting
 * the blog render its empty state instead of a blank page until the real ID lands.
 */
export const isSanityConfigured =
  PROJECT_ID !== '' && PROJECT_ID !== PLACEHOLDER_ID && /^[a-z0-9-]+$/.test(PROJECT_ID)

export const sanityClient: SanityClient = createClient({
  projectId: isSanityConfigured ? PROJECT_ID : 'placeholder',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(sanityClient)

/** Build a CDN image URL from a Sanity image reference (featured/OG images, inline body images). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** A Sanity image field with the required alt text we store alongside it. */
export interface BlogImage {
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  hotspot?: { x: number; y: number }
  crop?: unknown
}

/** Shape of a card in the listing query. */
export interface BlogPostCard {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: BlogImage
}

/** Full post shape from the single-post query. */
export interface BlogPost extends BlogPostCard {
  body?: PortableTextBlock[]
  author?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: BlogImage
}

/**
 * Listing query — only published, non-future posts, newest first, capped at 12.
 * `defined(publishedAt) && publishedAt <= now()` keeps blank-dated drafts-in-content and
 * future-scheduled posts out of the public list.
 */
export const POSTS_LIST_QUERY = `*[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...12] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  featuredImage
}`

/** Single-post query by slug — includes body, author and the SEO override fields. */
export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  featuredImage,
  body,
  author,
  metaTitle,
  metaDescription,
  ogImage
}`

/** Fetch the listing cards. Resolves to an empty list until a real project ID is configured. */
export function getPosts(): Promise<BlogPostCard[]> {
  if (!isSanityConfigured) return Promise.resolve([])
  return sanityClient.fetch(POSTS_LIST_QUERY)
}

/** Fetch a single post by slug (null if not found or not yet configured). */
export function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured) return Promise.resolve(null)
  return sanityClient.fetch(POST_BY_SLUG_QUERY, { slug })
}

/* ---------------------------------------------------------------------------------------------
 * Flake color project galleries (`/flake-color-chart/:slug`)
 * ------------------------------------------------------------------------------------------- */

/** A project photo in a flake gallery — alt is required in the schema, caption is optional. */
export interface FlakeGalleryImage extends BlogImage {
  caption?: string
}

/** A per-color project gallery. `images` may be absent or empty — callers render an empty state. */
export interface FlakeGallery {
  title?: string
  images?: FlakeGalleryImage[]
}

/** Single gallery by flake identifier. */
export const FLAKE_GALLERY_BY_SLUG_QUERY = `*[_type == "flakeGallery" && flakeSlug == $slug][0] {
  title,
  images
}`

/**
 * Identifiers of every gallery that actually has at least one photo. Used to decide which
 * per-color pages are real enough to belong in the sitemap — a gallery document with an empty
 * `images` array renders the "coming soon" state and must stay out of it (thin content).
 */
export const FLAKE_GALLERY_POPULATED_SLUGS_QUERY = `*[_type == "flakeGallery" && count(images) > 0].flakeSlug`

/**
 * Fetch one color's gallery (null if no document exists yet for that color, which is the
 * normal case for colors the client hasn't sent photos for).
 */
export function getFlakeGallery(slug: string): Promise<FlakeGallery | null> {
  if (!isSanityConfigured) return Promise.resolve(null)
  return sanityClient.fetch(FLAKE_GALLERY_BY_SLUG_QUERY, { slug })
}
