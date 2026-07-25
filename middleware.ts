import { next } from '@vercel/edge'

/**
 * Vercel Edge Middleware — per-post social share previews for `/blog/:slug`.
 *
 * WHY: the site is a client-rendered SPA, so react-helmet-async only sets a post's og/twitter tags
 * *after* JS runs. Social scrapers (Facebook, LinkedIn, Slack, iMessage, …) don't execute JS, so
 * they'd see index.html's generic site-wide tags and render a wrong/blank link preview — a
 * regression from the old Wix site, which had working per-page previews.
 *
 * WHAT: for requests to a blog post whose User-Agent matches a KNOWN social scraper, we fetch that
 * post's meta from Sanity (server-side) and return a minimal HTML doc with correct og/twitter tags.
 * Everything else — real browsers AND search engines (Googlebot etc., which render JS fine) — falls
 * through untouched via next(), so normal UX and SEO indexing are unaffected.
 *
 * This is an allowlist: only the UAs below are intercepted. Anything not on the list (including all
 * search-engine crawlers) passes through, by design.
 */
export const config = {
  // Only run on individual post URLs, never the listing or the rest of the site.
  matcher: '/blog/:slug',
}

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || ''
const DATASET = 'production'
const API_VERSION = 'v2024-01-01'
const SITE_URL = 'https://www.nextlevelcoatingsaz.com'
const SITE_NAME = 'Next Level Coatings'

// Known non-JS social/link-unfurling scrapers. NOT search engines — Google/Bing render JS and must
// pass through so indexing is unchanged.
const SOCIAL_BOT_RE =
  /facebookexternalhit|facebookcatalog|Facebot|Twitterbot|LinkedInBot|Slackbot|Slack-ImgProxy|Discordbot|WhatsApp|TelegramBot|redditbot|Pinterest|SkypeUriPreview|vkShare|W3C_Validator|Embedly|Iframely|Applebot-Extended|Google-InspectionTool/i

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface PostMeta {
  title?: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: string | null
  featuredImage?: string | null
}

async function fetchPostMeta(slug: string): Promise<PostMeta | null> {
  if (!PROJECT_ID) return null
  const query = `*[_type=="blogPost" && slug.current==$slug][0]{title,excerpt,metaTitle,metaDescription,"ogImage":ogImage.asset->url,"featuredImage":featuredImage.asset->url}`
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = (await res.json()) as { result?: PostMeta | null }
    return json.result ?? null
  } catch {
    return null
  }
}

function renderMetaHtml(post: PostMeta, canonical: string): string {
  const title = `${post.metaTitle || post.title || 'Blog'} | ${SITE_NAME}`
  const description = post.metaDescription || post.excerpt || `${SITE_NAME} blog.`
  const rawImage = post.ogImage || post.featuredImage || `${SITE_URL}/hero-poster.jpg`
  // Size Sanity-hosted images for social; leave the fallback untouched.
  const image = rawImage.includes('cdn.sanity.io')
    ? `${rawImage}?w=1200&h=630&fit=crop&auto=format`
    : rawImage

  const t = escapeHtml(title)
  const d = escapeHtml(description)
  const img = escapeHtml(image)
  const url = escapeHtml(canonical)

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${img}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
</head>
<body></body>
</html>`
}

export default async function middleware(request: Request): Promise<Response> {
  const ua = request.headers.get('user-agent') || ''

  // Not a known social scraper → normal browsers and search engines pass straight through.
  if (!SOCIAL_BOT_RE.test(ua)) {
    return next()
  }

  const { pathname } = new URL(request.url)
  const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '')
  if (!slug) return next()

  const post = await fetchPostMeta(slug)
  // If we can't resolve the post (unknown slug, Sanity down, missing project id), don't block the
  // scraper — fall through so it at least gets the generic site preview rather than an error.
  if (!post) return next()

  const canonical = `${SITE_URL}/blog/${slug}`
  return new Response(renderMetaHtml(post, canonical), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Let Vercel's edge cache serve repeat scraper hits.
      'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
