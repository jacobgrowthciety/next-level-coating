import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'
import Seo, { SITE_NAME, SITE_URL } from '../components/Seo'
import CallNowButton from '../components/CallNowButton'
import RoughDivider from '../components/RoughDivider'
import { getFlakeColor } from '../lib/flakeColors'
import { getFlakeGallery, urlFor, type FlakeGalleryImage } from '../lib/sanity'
import { trackClickToCall } from '../lib/analytics'

// Mirrors the Flake Color Chart page's own section shades (§2A shade variance): pure black
// header, near-black gallery body below it.
const INTRO_BG = '#000000'
const SECTION_BG = '#141414'

const PHONE_HREF = 'tel:+16232241097'
const PHONE_DISPLAY = '(623) 224-1097'

function ArrowIcon({ className, direction }: { className?: string; direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

/** Breadcrumb shared by every state so the page never loses its way back. */
function Breadcrumb({ label }: { label: string }) {
  return (
    <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/50">
      <Link to="/" className="transition-colors hover:text-brand-teal">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link to="/flake-color-chart" className="transition-colors hover:text-brand-teal">
        Flake Color Chart
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-white/80">{label}</span>
    </motion.nav>
  )
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; images: FlakeGalleryImage[] }

/**
 * Per-color project gallery (`/flake-color-chart/:slug`).
 *
 * Sanity-backed with the same client-side fetch as the blog (no SSG — see lib/sanity.ts).
 * Three of the four states are non-photo states and all of them are intentional, not errors:
 * most colors have no `flakeGallery` document yet, and one can exist with an empty `images`
 * array while photos are still being collected. Both render the same "coming soon" state.
 *
 * An unrecognized `:slug` is the one genuine 404 — it means a URL that was never a real swatch,
 * so it gets noindex rather than a soft-404 that Google would index as thin content.
 */
export default function FlakeGallery() {
  const { slug } = useParams<{ slug: string }>()
  const color = getFlakeColor(slug)
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  // The gallery's own title from Sanity, which overrides the identifier-derived label.
  const [sanityTitle, setSanityTitle] = useState<string | undefined>(undefined)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    // Unknown swatch — nothing to fetch. Guarded before the request so a junk URL doesn't hit
    // the API at all.
    if (!slug || !color) return

    let active = true
    setState({ status: 'loading' })
    setSanityTitle(undefined)
    setOpenIndex(null)

    getFlakeGallery(slug)
      .then((gallery) => {
        if (!active) return
        setSanityTitle(gallery?.title)
        // No document yet, or a document with no photos in it — same public outcome.
        const images = (gallery?.images ?? []).filter((img) => Boolean(img?.asset))
        setState(images.length > 0 ? { status: 'ready', images } : { status: 'empty' })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })

    return () => {
      active = false
    }
  }, [slug, color])

  const images = state.status === 'ready' ? state.images : []

  const close = () => setOpenIndex(null)
  const showPrev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, images.length])

  /* --- Unknown swatch: a URL that never corresponded to a real color. --- */
  if (!color) {
    return (
      <main>
        <Seo
          title={`Flake Color Gallery | ${SITE_NAME}`}
          description="Browse flake color options for your polyaspartic garage floor coating."
          path={slug ? `/flake-color-chart/${slug}` : '/flake-color-chart'}
          noindex
        />
        <section
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center"
          style={{ backgroundColor: INTRO_BG }}
        >
          <h1 className="font-script text-4xl text-brand-teal sm:text-5xl">Color Not Found</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            We couldn't find that flake color. Browse the full chart to see every option.
          </p>
          <Link
            to="/flake-color-chart"
            className="mt-8 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
          >
            View Color Chart
          </Link>
        </section>
        <CallNowButton />
      </main>
    )
  }

  const name = sanityTitle?.trim() || color.name
  const hasPhotos = state.status === 'ready'

  return (
    <main>
      <Seo
        title={`${name} Flake Color Gallery | ${SITE_NAME}`}
        description={
          hasPhotos
            ? `Real ${name} flake floor coating projects by Next Level Coatings — see how ${name} looks installed before choosing your color.`
            : `See the ${name} flake color option for your polyaspartic floor coating from Next Level Coatings, Arizona's top concrete coating specialists.`
        }
        path={`/flake-color-chart/${color.id}`}
        // Absolute against the canonical domain, not the serving host — social scrapers need a
        // publicly reachable URL, and a preview/localhost origin isn't one.
        image={`${SITE_URL}${color.full}`}
        // Colors without photos are thin by definition — keep them out of the index until
        // real project photos land (the sitemap is filtered on the same condition).
        noindex={!hasPhotos}
      />

      {/* Compact page header — §9A pattern, matching FlakeColorChartIntro. */}
      <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
            <Breadcrumb label={name} />

            <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
              Our Work In
            </motion.p>
            {/* Single H1 per page (§7) — the color name. The order-only badge sits outside the
                H1 so it never becomes part of the heading text search engines read. */}
            <motion.h1
              variants={fadeUp}
              className="mt-2 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
            >
              {name}
            </motion.h1>
            {color.orderOnly && (
              <motion.p variants={fadeUp} className="mt-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.2em] text-white/70">
                  Order Only
                </span>
              </motion.p>
            )}

            {/* The swatch itself, so the page shows the color even with no project photos. */}
            <motion.div variants={fadeUp} className="mt-6 flex items-center gap-4">
              <img
                src={color.thumb}
                alt={`${name} flake color chip sample`}
                className="h-20 w-20 flex-none rounded-sm object-cover sm:h-24 sm:w-24"
              />
              <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                {hasPhotos
                  ? `Real ${name} installs from our crews across the Arizona Valley.`
                  : `${name} is one of our full-broadcast flake options.`}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Body: photo grid, empty state, loading, or error. */}
      <section className="relative z-20" style={{ backgroundColor: SECTION_BG }}>
        <RoughDivider fillColor={SECTION_BG} revealColor={INTRO_BG} />

        <div className="px-6 pb-24 pt-4">
          <div className="mx-auto max-w-6xl">
            {state.status === 'loading' && (
              <p className="py-16 text-center font-display text-sm uppercase tracking-[0.35em] text-white/40">
                Loading…
              </p>
            )}

            {state.status === 'error' && (
              <div className="py-16 text-center">
                <h2 className="font-script text-3xl text-brand-teal sm:text-4xl">
                  Something Went Wrong
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
                  We couldn't load these photos right now. Please try again shortly.
                </p>
              </div>
            )}

            {/* Empty state — no gallery document yet, or one with no photos. On-brand, never
                a blank or broken page. */}
            {state.status === 'empty' && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-xl py-16 text-center"
              >
                <motion.h2 variants={fadeUp} className="font-script text-3xl text-brand-teal sm:text-4xl">
                  More {name} Project Photos Coming Soon
                </motion.h2>
                <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                  We're still shooting our latest {name} installs. In the meantime, browse the full
                  color chart or call us — we'll walk you through how {name} looks in person.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={PHONE_HREF}
                    onClick={trackClickToCall}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-brand-black transition-colors hover:bg-brand-teal/80"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call {PHONE_DISPLAY}
                  </a>
                  <Link
                    to="/flake-color-chart"
                    className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
                  >
                    View All Colors
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* Photo grid — uniform, same card/lightbox DNA as the other project galleries. */}
            {hasPhotos && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {images.map((img, index) => (
                  <motion.button
                    key={img.asset._ref + index}
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: (index % 4) * 0.06 }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
                  >
                    <img
                      src={urlFor(img).width(800).height(600).fit('crop').auto('format').url()}
                      alt={img.alt ?? `${name} flake floor coating project`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.caption && (
                      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <span className="p-3 text-left text-xs font-medium leading-snug text-white sm:text-sm">
                          {img.caption}
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Back link — present in every state. */}
            <div className="mt-14 text-center">
              <Link
                to="/flake-color-chart"
                className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.25em] text-brand-teal transition-colors hover:text-brand-teal/80"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Back to Color Chart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox — portaled to document.body so its fixed overlay isn't trapped inside this
          section's stacking context (same fix as the other galleries). */}
      {createPortal(
        <AnimatePresence>
          {openIndex !== null && images[openIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={`${images[openIndex].alt ?? name} — enlarged photo`}
              onClick={close}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-brand-teal sm:right-6 sm:top-6"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    showPrev()
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-brand-teal sm:left-6"
                >
                  <ArrowIcon direction="left" className="h-7 w-7" />
                </button>
              )}

              <motion.div
                key={openIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-3xl flex-col items-center"
              >
                <img
                  src={urlFor(images[openIndex]).width(1600).auto('format').url()}
                  alt={images[openIndex].alt ?? `${name} flake floor coating project`}
                  className="max-h-[75vh] w-full rounded-sm object-contain"
                />
                {images[openIndex].caption && (
                  <p className="mt-4 text-center text-sm text-white/70">
                    {images[openIndex].caption}
                  </p>
                )}
                {images.length > 1 && (
                  <p className="mt-2 text-sm text-white/50">
                    {openIndex + 1} / {images.length}
                  </p>
                )}
              </motion.div>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    showNext()
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-brand-teal sm:right-6"
                >
                  <ArrowIcon direction="right" className="h-7 w-7" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <CallNowButton />
    </main>
  )
}
