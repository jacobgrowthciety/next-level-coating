import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Dark cluster immediately following the compact header (reference/BRIEF.md §9A, §4A).
const SECTION_BG = '#141414'
const PREV_SECTION_BG = '#000000' // CommercialIntro's section background
const CARD_BG = '#1c1c1c'

// Real project photography (public/services/commercial/), pulled from the old site's gallery.
// 1 featured + 2 wide + 12 small = 20 grid cells, tiling cleanly at both the 2-col mobile and
// 4-col desktop breakpoints (5 rows of 4) — see GarageFlooringGallery for the sizing rationale.
const CAPTIONS = [
  'Commercial Polyaspartic Coating',
  'Slip-Resistant Commercial Flooring',
  'Showroom-Ready Concrete Finish',
  'Warehouse Floor Coating',
  'Commercial Kitchen Flooring',
]

const ALTS = [
  'Commercial polyaspartic floor coating in a business entryway, Next Level Coatings project',
  'Slip-resistant commercial flooring installed in a warehouse aisle',
  'Glossy showroom floor coating by Next Level Coatings',
  'Polyaspartic floor coating installation in a commercial kitchen',
  'Durable commercial concrete coating in a retail space',
  'Commercial floor coating crew finishing a warehouse project',
  'Close-up of a commercial polyaspartic floor finish',
  'Wide view of a coated commercial warehouse floor',
]

const PHOTOS: { id: string; src: string; caption: string; alt: string; size: 'featured' | 'small' | 'wide' }[] = [
  { id: 'c1', src: '/services/commercial/commercial-01.webp', caption: CAPTIONS[0], alt: ALTS[0], size: 'featured' },
  { id: 'c2', src: '/services/commercial/commercial-02.webp', caption: CAPTIONS[1], alt: ALTS[1], size: 'wide' },
  { id: 'c3', src: '/services/commercial/commercial-03.webp', caption: CAPTIONS[2], alt: ALTS[2], size: 'wide' },
  { id: 'c4', src: '/services/commercial/commercial-04.webp', caption: CAPTIONS[3], alt: ALTS[3], size: 'small' },
  { id: 'c5', src: '/services/commercial/commercial-05.webp', caption: CAPTIONS[4], alt: ALTS[4], size: 'small' },
  { id: 'c6', src: '/services/commercial/commercial-06.webp', caption: CAPTIONS[0], alt: ALTS[5], size: 'small' },
  { id: 'c7', src: '/services/commercial/commercial-07.webp', caption: CAPTIONS[1], alt: ALTS[6], size: 'small' },
  { id: 'c8', src: '/services/commercial/commercial-08.webp', caption: CAPTIONS[2], alt: ALTS[7], size: 'small' },
  { id: 'c9', src: '/services/commercial/commercial-09.webp', caption: CAPTIONS[3], alt: ALTS[0], size: 'small' },
  { id: 'c10', src: '/services/commercial/commercial-10.webp', caption: CAPTIONS[4], alt: ALTS[1], size: 'small' },
  { id: 'c11', src: '/services/commercial/commercial-11.webp', caption: CAPTIONS[0], alt: ALTS[2], size: 'small' },
  { id: 'c12', src: '/services/commercial/commercial-12.webp', caption: CAPTIONS[1], alt: ALTS[3], size: 'small' },
  { id: 'c13', src: '/services/commercial/commercial-13.webp', caption: CAPTIONS[2], alt: ALTS[4], size: 'small' },
  { id: 'c14', src: '/services/commercial/commercial-14.webp', caption: CAPTIONS[3], alt: ALTS[5], size: 'small' },
  { id: 'c15', src: '/services/commercial/commercial-15.webp', caption: CAPTIONS[4], alt: ALTS[6], size: 'small' },
]

const SIZE_CLASSES: Record<(typeof PHOTOS)[number]['size'], string> = {
  featured: 'col-span-2 row-span-2',
  small: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
}

// Cap the initial grid at 7 photos (the same amount shown on GarageFlooring/ConcreteCoatings)
// so visitors reach the rest of the page quickly — the remaining photos are still there,
// just behind the "View Full Gallery" toggle below.
const INITIAL_COUNT = 7

function ArrowIcon({ className, direction }: { className?: string; direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

function ChevronIcon({ className, expanded }: { className?: string; expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${className} transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5.2 7.5 10 12l4.8-4.5" />
    </svg>
  )
}

const Star = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-teal" fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.53 6.1.72-4.55 4.2 1.2 6.05L10 14.9l-5.35 3.1 1.2-6.05L1.3 7.75l6.1-.72L10 1.5z" />
  </svg>
)

// Reviews that specifically call out commercial work.
const FEATURED_REVIEWS: { name: string; text: string }[] = [
  {
    name: 'Brittany Y',
    text: "Chase and his wonderful team took on our large commercial job and did not disappoint! We are a Senior Living Community in Sun City West, and needed our front entryway completely redone. Chase came out to give us a quote, and had amazing communication throughout the entire project. The finished result exceeded our expectations.",
  },
  {
    name: 'Riley Crosby',
    text: 'Great guys, great product and great communication. As a GC I can always count on them to do it right the first time.',
  },
]

/** Photo gallery + commercial-specific reviews callout (reference/BRIEF.md §9A pattern). */
export default function CommercialGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const visiblePhotos = expanded ? PHOTOS : PHOTOS.slice(0, INITIAL_COUNT)
  const hiddenCount = PHOTOS.length - INITIAL_COUNT

  const close = () => setOpenIndex(null)
  const showPrev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + visiblePhotos.length) % visiblePhotos.length))
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % visiblePhotos.length))

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex])

  return (
    <section className="relative z-20" style={{ backgroundColor: SECTION_BG }}>
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.p variants={fadeUp} className="font-display text-xs uppercase tracking-[0.35em] text-white/50">
              The work
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 font-script text-4xl text-brand-teal sm:text-5xl lg:text-6xl">
              Recent Installs
            </motion.h2>
          </div>

          <motion.div
            layout
            variants={fadeUp}
            className="mt-14 grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-4 lg:auto-rows-[170px]"
          >
            {visiblePhotos.map((photo, index) => (
              <motion.button
                layout
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                type="button"
                onClick={() => setOpenIndex(index)}
                className={`group relative overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] ${SIZE_CLASSES[photo.size]}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="p-3 text-left text-xs font-medium leading-snug text-white sm:text-sm">
                    {photo.caption}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {hiddenCount > 0 && (
            <motion.div variants={fadeUp} className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-teal/60 px-6 py-3 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-black"
              >
                {expanded ? 'Show Fewer Photos' : `View Full Gallery (+${hiddenCount} More)`}
                <ChevronIcon expanded={expanded} className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="px-6 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-5xl"
        >
          <motion.p variants={fadeUp} className="text-center font-display text-xs uppercase tracking-[0.35em] text-white/50">
            From commercial customers
          </motion.p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURED_REVIEWS.map((review) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                className="flex h-full flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{review.text}</p>
                <p className="mt-5 font-display text-sm uppercase tracking-wide text-white">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {openIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={`${visiblePhotos[openIndex].caption} — enlarged photo`}
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

              <motion.div
                key={openIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="aspect-[4/3] w-full max-w-2xl"
              >
                <img src={visiblePhotos[openIndex].src} alt={visiblePhotos[openIndex].alt} className="h-full w-full rounded-sm object-cover" />
                <p className="mt-4 text-center text-sm text-white/70">{visiblePhotos[openIndex].caption}</p>
              </motion.div>

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
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
