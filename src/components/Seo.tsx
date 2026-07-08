import { Helmet } from 'react-helmet-async'

/** Canonical production domain (reference/BRIEF.md §8 sitemap) — used to build absolute
 * canonical/OG/Twitter URLs regardless of which host (Vercel preview, custom domain) actually
 * serves a given request. */
export const SITE_URL = 'https://www.nextlevelcoatingsaz.com'
export const SITE_NAME = 'Next Level Coatings'
/** Default social share image — falls back to the hero's branded truck/home photo when a page
 * doesn't have a more specific image of its own. */
const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-poster.jpg`

/**
 * Per-route document head (title, meta description, canonical, Open Graph, Twitter Card).
 * This is a client-rendered SPA with no prerendering, so react-helmet-async is what actually
 * lets each route ship its own <title>/<meta> instead of every page sharing index.html's.
 *
 * `path` is the route's path (e.g. "/about") — combined with SITE_URL for the canonical/OG url.
 * `noindex` is for thin/placeholder content (Coming Soon pages) that shouldn't be indexed or
 * listed in the sitemap yet.
 */
export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
}: {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
}) {
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
