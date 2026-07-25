import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { fadeUp, staggerContainer } from '../animations/variants'
import Seo, { SITE_URL, SITE_NAME } from '../components/Seo'
import CallNowButton from '../components/CallNowButton'
import { getPostBySlug, urlFor, type BlogPost as BlogPostType, type BlogImage } from '../lib/sanity'

const PAGE_BG = '#000000'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Portable Text renderer mapped to the site's typography (reference/BRIEF.md §2, matching the
 * body-copy conventions in GarageFlooringDetails). Dark page, so text is white-on-black.
 */
const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-[3px] border-brand-teal pl-6 text-lg italic leading-relaxed text-white/70">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-lg leading-relaxed text-white/80">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-white/80">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-brand-teal underline underline-offset-2 hover:text-brand-teal/80"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      const img = value as BlogImage
      if (!img?.asset) return null
      return (
        <figure className="mt-8">
          <img
            src={urlFor(img).width(1600).auto('format').url()}
            alt={img.alt ?? ''}
            loading="lazy"
            className="w-full rounded-sm border-l-[3px] border-brand-teal object-cover"
          />
          {img.alt && (
            <figcaption className="mt-3 text-sm text-white/50">{img.alt}</figcaption>
          )}
        </figure>
      )
    },
  },
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'notfound' }
  | { status: 'ready'; post: BlogPostType }

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    if (!slug) {
      setState({ status: 'notfound' })
      return
    }
    getPostBySlug(slug)
      .then((post) => {
        if (!active) return
        setState(post ? { status: 'ready', post } : { status: 'notfound' })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [slug])

  // Non-ready states: keep the dark page shell + header/footer (rendered by App) intact.
  if (state.status !== 'ready') {
    const message =
      state.status === 'loading'
        ? 'Loading…'
        : state.status === 'error'
          ? "We couldn't load this post right now. Please try again shortly."
          : 'Post not found.'
    return (
      <main>
        <Seo
          title={`Blog | ${SITE_NAME}`}
          description="Concrete coating guides and tips from Next Level Coatings."
          path={slug ? `/blog/${slug}` : '/blog'}
          noindex={state.status === 'notfound'}
        />
        <section
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center"
          style={{ backgroundColor: PAGE_BG }}
        >
          {state.status === 'loading' ? (
            <p className="font-display text-sm uppercase tracking-[0.35em] text-white/40">
              {message}
            </p>
          ) : (
            <>
              <h1 className="font-script text-4xl text-brand-teal sm:text-5xl">
                {state.status === 'notfound' ? 'Post Not Found' : 'Something Went Wrong'}
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                {message}
              </p>
              <Link
                to="/blog"
                className="mt-8 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                Back to Blog
              </Link>
            </>
          )}
        </section>
        <CallNowButton />
      </main>
    )
  }

  const { post } = state
  const slugStr = post.slug.current
  const seoImageSource = post.ogImage ?? post.featuredImage
  const ogImage = seoImageSource
    ? urlFor(seoImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  const heroImage = post.featuredImage
    ? urlFor(post.featuredImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || undefined,
    image: ogImage ? [ogImage] : undefined,
    datePublished: post.publishedAt,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slugStr}` },
  }

  return (
    <main>
      <Seo
        title={`${post.metaTitle || post.title} | ${SITE_NAME}`}
        description={post.metaDescription || post.excerpt || `${post.title} — Next Level Coatings.`}
        path={`/blog/${slugStr}`}
        {...(ogImage ? { image: ogImage } : {})}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Header */}
      <section className="relative z-10" style={{ backgroundColor: PAGE_BG }}>
        <div className="mx-auto max-w-4xl px-6 pb-8 pt-28 sm:pt-32">
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.nav
              variants={fadeUp}
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-white/50"
            >
              <Link to="/" className="transition-colors hover:text-brand-teal">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="transition-colors hover:text-brand-teal">
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="max-w-[45vw] truncate text-white/80">{post.title}</span>
            </motion.nav>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl"
            >
              {post.title}
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xs uppercase tracking-[0.25em] text-white/50"
            >
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.author && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>By {post.author}</span>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured image */}
      {heroImage && (
        <section className="relative z-10" style={{ backgroundColor: PAGE_BG }}>
          <div className="mx-auto max-w-4xl px-6">
            <motion.img
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              src={heroImage}
              alt={post.featuredImage?.alt ?? post.title}
              className="aspect-[16/9] w-full rounded-sm border-l-[3px] border-brand-teal object-cover"
            />
          </div>
        </section>
      )}

      {/* Body */}
      <section className="relative z-10" style={{ backgroundColor: PAGE_BG }}>
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-8">
          {post.body ? (
            <PortableText value={post.body} components={portableComponents} />
          ) : post.excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">{post.excerpt}</p>
          ) : null}

          <div className="mt-14">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.25em] text-brand-teal transition-colors hover:text-brand-teal/80"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      <CallNowButton />
    </main>
  )
}
