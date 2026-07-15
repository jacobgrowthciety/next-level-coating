import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#141414'
const PREV_SECTION_BG = '#000000' // PatiosIntro's section background
const CARD_BG = '#1c1c1c'

const CAPTIONS = [
  'Polyaspartic Patio Coating',
  'Full Broadcast Flake Patio',
  'Coated Driveway Finish',
  'Non-Slip Sidewalk Coating',
  'Freshly Coated Outdoor Concrete',
]

const ALTS = [
  'Polyaspartic patio coating with chip texture, Next Level Coatings project in Arizona',
  'Full broadcast flake finish on a backyard patio',
  'Coated driveway with a durable polyaspartic finish',
  'Non-slip sidewalk coating installed by Next Level Coatings',
  'Freshly coated outdoor concrete patio ready for use',
  'Wide view of a coated patio and pool surround',
  'Close-up of chip texture on an outdoor concrete coating',
  'Coated concrete walkway with a UV-stable polyaspartic finish',
]

// 25 real project photos (public/services/patios/). The first 7 use the same 1 featured + 2
// wide + 4 small = 12 cell mix as GarageFlooringGallery, so the initial (collapsed) view tiles
// identically to the other pages. The rest are small tiles revealed by "View Full Gallery".
const SIZES: ('featured' | 'small' | 'wide')[] = [
  'featured',
  'wide',
  'wide',
  'small',
  'small',
  'small',
  'small',
  ...Array(18).fill('small'),
]

const PHOTOS: { id: string; src: string; caption: string; alt: string; size: 'featured' | 'small' | 'wide' }[] =
  Array.from({ length: 25 }, (_, i) => {
    const n = i + 1
    return {
      id: `pt${n}`,
      src: `/services/patios/patios-${String(n).padStart(2, '0')}.webp`,
      caption: CAPTIONS[i % CAPTIONS.length],
      alt: ALTS[i % ALTS.length],
      size: SIZES[i],
    }
  })

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

const FEATURED_REVIEWS: { name: string; text: string }[] = [
  {
    name: 'Paula Tyrrell',
    text: 'Wow!! Customer service excellent! Chase was terrific to work with, as was his partner Kyle, and Christian, who actually did the work. Their crew was meticulous and efficient. During grinding of the patio, very little dust. Finished product with extra grip. Flawless finish.',
  },
  {
    name: 'Janean Johnson',
    text: 'Next Level Coatings did a great job on our driveway. They were straightforward with pricing, showed up on time, and provided clear expectations for cure times, etc.',
  },
]

/** Photo gallery + patio-specific reviews callout (reference/BRIEF.md §9A pattern). */
export default function PatiosGallery() {
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
            From patio &amp; driveway customers
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
