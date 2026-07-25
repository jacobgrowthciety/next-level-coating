import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import { getPosts, urlFor, type BlogPostCard } from '../lib/sanity'

// Slightly lighter-than-black shade so this section reads as a distinct surface from the pure
// #000000 intro above it (reference/BRIEF.md §2A adjacent-dark-shade rule) without a divider.
const SECTION_BG = '#0a0a0a'

/** Format an ISO date as e.g. "March 4, 2026". */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Shared focus ring (matches ServicesGrid) — visible keyboard focus on the card links. */
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]'

function BlogCard({ post }: { post: BlogPostCard }) {
  const thumb = post.featuredImage
    ? urlFor(post.featuredImage).width(800).height(450).fit('crop').auto('format').url()
    : null

  return (
    <motion.div variants={fadeUp}>
      <Link
        to={`/blog/${post.slug.current}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-sm border-l-[3px] border-brand-teal bg-white/[0.03] transition-colors duration-300 hover:-translate-y-1 hover:bg-brand-teal/[0.07] ${FOCUS_RING}`}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={post.featuredImage?.alt ?? post.title}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-white/[0.04]">
            <span className="font-script text-2xl text-brand-teal/60">Next Level</span>
          </div>
        )}
        <div className="flex flex-1 flex-col p-7">
          <span className="font-display text-xs uppercase tracking-[0.35em] text-white/50">
            {formatDate(post.publishedAt)}
          </span>
          <h2 className="mt-3 font-display text-lg uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-brand-teal">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{post.excerpt}</p>
          )}
          <span className="mt-5 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.2em] text-brand-teal">
            Read More
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/** Fetches published posts on mount and renders them as the site's standard card grid. */
export default function BlogList() {
  const [posts, setPosts] = useState<BlogPostCard[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    getPosts()
      .then((data) => {
        if (active) setPosts(data)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="relative z-20" style={{ backgroundColor: SECTION_BG }}>
      <div className="px-6 pb-24 pt-6">
        <div className="mx-auto max-w-6xl">
          {error ? (
            <p className="text-base leading-relaxed text-white/70">
              We couldn't load posts right now. Please try again shortly, or call us at{' '}
              <a href="tel:+16232241097" className="text-brand-teal hover:underline">
                (623) 224-1097
              </a>
              .
            </p>
          ) : posts === null ? (
            <p className="font-display text-sm uppercase tracking-[0.35em] text-white/40">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-base leading-relaxed text-white/70">
              No posts yet — check back soon for coating guides and project spotlights.
            </p>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
