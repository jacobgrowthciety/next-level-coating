import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'

// Dark section immediately following the compact header (reference/BRIEF.md §9A) — Intro,
// Gallery, and the Reviews callout below form one continuous dark "proof" cluster with no
// divider between them, so this sits right after Intro with no RoughDivider at its top. A
// distinct near-black shade from Intro's pure black (#000000) so the two dark sections in the
// cluster don't read as one identical flat surface (§2A shade variance).
const SECTION_BG = '#141414'

// Slightly lighter than the section background so review cards read as raised, same
// border-l teal DNA established in Services Grid / Reviews (reference/BRIEF.md §5B, §5C).
const CARD_BG = '#1c1c1c'

// PLACEHOLDER PHOTOS — real project photography not yet sourced. Swap `caption` copy to match
// each real photo and replace <PlaceholderPhoto /> with an <img src="..." /> once available.
// Kept intentionally varied in size (one featured, four supporting, one wide) rather than a
// uniform grid (reference/BRIEF.md §9A).
const PHOTOS: { id: string; caption: string; size: 'featured' | 'small' | 'wide' }[] = [
  { id: 'p1', caption: '3-Car Garage · Full Broadcast Flake', size: 'featured' },
  { id: 'p2', caption: 'Gray & Black Flake Close-Up', size: 'small' },
  { id: 'p3', caption: 'Stem Wall Repair Detail', size: 'small' },
  { id: 'p4', caption: 'Solid Color Finish', size: 'small' },
  { id: 'p5', caption: 'Edge & Trim Detail', size: 'small' },
  { id: 'p6', caption: 'Freshly Coated — Cure In Progress', size: 'wide' },
]

// TODO (reference/BRIEF.md §9A): a drag-to-reveal before/after slider is the planned next
// enhancement for this gallery, once real before/after photo pairs are sourced from the owner.
// High priority — noted as the highest-converting visual pattern for this business.

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  )
}

/** PLACEHOLDER — stand-in for real project photography until it's sourced. */
function PlaceholderPhoto({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, #1f1f1f, #1f1f1f 14px, #171717 14px, #171717 28px)',
      }}
    >
      <CameraIcon className="h-8 w-8 text-white/15 sm:h-10 sm:w-10" />
      <span className="absolute right-2 top-2 font-display text-[0.6rem] uppercase tracking-[0.2em] text-brand-teal/60">
        Placeholder
      </span>
    </div>
  )
}

const SIZE_CLASSES: Record<(typeof PHOTOS)[number]['size'], string> = {
  featured: 'col-span-2 row-span-2',
  small: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
}

function ArrowIcon({ className, direction }: { className?: string; direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

const Star = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-teal" fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.53 6.1.72-4.55 4.2 1.2 6.05L10 14.9l-5.35 3.1 1.2-6.05L1.3 7.75l6.1-.72L10 1.5z" />
  </svg>
)

// Reviews that specifically call out garage floor work (reference/BRIEF.md §5C, §9A).
const FEATURED_REVIEWS: { name: string; text: string }[] = [
  {
    name: 'Will Gray',
    text: "All I can say is WOW!!! The crew at Next Level Coatings did a phenomenal job on my garage floor! I had serious stem wall issues that needed drastic repair. Chase, the owner, came by and gave an honest assessment and came up with a plan to repair it the right way. Kyle & Christian came out and had their new Elite System installed and completed in only 2 days. I am absolutely blown away at the end result and the finished job. I highly recommend Next Level Coatings to anyone. 10 out of 10!",
  },
  {
    name: 'Clint Tallmadge',
    text: "The team at Next Level Coatings did an amazing job on the garage floor at my cabin in Happy Jack! Communication was top notch and Chase's guys were professional, on time and did a very thorough cleanup when they were done. I couldn't be happier with the results and would recommend them to anyone that is looking for a contractor that checks all the boxes. 10/10!",
  },
]

/** Photo gallery + garage-specific reviews callout (reference/BRIEF.md §9A pattern). */
export default function GarageFlooringGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = () => setOpenIndex(null)
  const showPrev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length))
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length))

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
      <div className="px-6 pb-24 pt-16 sm:pt-20">
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
            variants={fadeUp}
            className="mt-14 grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-4 lg:auto-rows-[170px]"
          >
            {PHOTOS.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                className={`group relative overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] ${SIZE_CLASSES[photo.size]}`}
              >
                <PlaceholderPhoto />
                {/* Hover/focus caption reveal (§9A) */}
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="p-3 text-left text-xs font-medium leading-snug text-white sm:text-sm">
                    {photo.caption}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Reviews callout — features the two reviews that specifically mention garage floor
          work (reference/BRIEF.md §5C, §9A), placed just under the gallery. */}
      <div className="px-6 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-5xl"
        >
          <motion.p variants={fadeUp} className="text-center font-display text-xs uppercase tracking-[0.35em] text-white/50">
            From garage floor customers
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

      {/* Lightbox — portaled to document.body so its fixed z-[100] overlay isn't trapped
          inside this section's own stacking context (the section's own z-30 would otherwise
          rank it below the header's z-40 during paint, regardless of the overlay's z-index). */}
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
              aria-label={`${PHOTOS[openIndex].caption} — enlarged photo`}
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
                <PlaceholderPhoto className="rounded-sm" />
                <p className="mt-4 text-center text-sm text-white/70">{PHOTOS[openIndex].caption}</p>
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
