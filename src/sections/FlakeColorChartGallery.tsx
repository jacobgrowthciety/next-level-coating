import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleIn } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'
import { FLAKE_COLORS } from '../lib/flakeColors'

// Dark section immediately following the compact header (reference/BRIEF.md §9A, §4A), same
// near-black shade GarageFlooringGallery uses so the two in-flow dark sections (Intro's pure
// black vs. this section) read with shade variance rather than as one flat surface (§2A).
const SECTION_BG = '#141414'
const PREV_SECTION_BG = '#000000' // FlakeColorChartIntro's section background

// The swatch catalog itself now lives in src/lib/flakeColors.ts — the per-color gallery route
// reads the same list to validate its :slug param, so it can't drift from this grid.

function ArrowIcon({ className, direction }: { className?: string; direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

/** Flake swatch grid + lightbox (reference/BRIEF.md §8 `/chip-color-chart`, §9A lightbox pattern
 * — structurally mirrors GarageFlooringGallery's lightbox, adapted to a uniform catalog grid
 * instead of a varied-size portfolio grid, since these are 28 same-size color swatches rather
 * than a curated mix of project photos. */
export default function FlakeColorChartGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = () => setOpenIndex(null)
  const showPrev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + FLAKE_COLORS.length) % FLAKE_COLORS.length))
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % FLAKE_COLORS.length))

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
      {/* Intro → Gallery (dark → dark): near-black torn shape over Intro's pure black section
          above (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <div className="mx-auto max-w-6xl">
          {/* Uniform catalog grid — 2 cols mobile up to 5 cols desktop, unlike the
              varied-size portfolio grid used for real project photos elsewhere. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {FLAKE_COLORS.map((color, index) => (
              // The swatch (enlarge) and "Learn More" (navigate) are two separate controls in
              // one card rather than a link nested in a button — nesting interactive elements
              // is invalid markup and leaves keyboard/screen-reader users unable to reach the
              // inner one. The card itself is a plain div for that reason.
              <motion.div
                key={color.id}
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: (index % 4) * 0.06 }}
                className="flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Enlarge ${color.name} flake color swatch`}
                  className="group relative aspect-square overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
                >
                  <img
                    src={color.thumb}
                    alt={color.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Special-order marker. Deliberately understated — a neutral translucent pill
                      in the corner, not a warning color: these are still fully available, just
                      not held in stock. `aria-hidden` because the same fact is already announced
                      in the Learn More link's accessible name below. */}
                  {color.orderOnly && (
                    <span
                      aria-hidden="true"
                      // Bottom-LEFT on purpose: every swatch photo has the Next Level watermark
                      // baked into its bottom-right corner and its printed color name across
                      // the top, leaving this the only consistently clear corner.
                      className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-full bg-black/70 px-2 py-[3px] font-display text-[0.5rem] uppercase tracking-[0.15em] text-white/75 backdrop-blur-sm sm:text-[0.55rem]"
                    >
                      Order Only
                    </span>
                  )}
                </button>
                <Link
                  to={`/flake-color-chart/${color.id}`}
                  className="group/link mt-2 flex flex-col items-center rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
                >
                  {/* The color name is printed inside each swatch image, but it was never
                      readable as text — so it's rendered here too for search engines, screen
                      readers, and anyone who can't make out small type on the photo. */}
                  <span className="text-center font-display text-[0.6rem] uppercase leading-tight tracking-[0.12em] text-white/85 transition-colors group-hover/link:text-brand-teal sm:text-[0.7rem]">
                    {color.name}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 font-display text-[0.55rem] uppercase tracking-[0.2em] text-white/45 transition-colors group-hover/link:text-brand-teal sm:text-[0.6rem]">
                    Learn More
                    <svg
                      viewBox="0 0 24 24"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="sr-only">
                    about {color.name}
                    {color.orderOnly ? ' (special order only)' : ''}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox — portaled to document.body so its fixed z-[100] overlay isn't trapped
          inside this section's own stacking context (same fix as GarageFlooringGallery). */}
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
              aria-label={`${FLAKE_COLORS[openIndex].alt} — enlarged`}
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
                aria-label="Previous color"
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
                className="flex w-full max-w-xl flex-col items-center"
              >
                <img
                  src={FLAKE_COLORS[openIndex].full}
                  alt={FLAKE_COLORS[openIndex].alt}
                  className="max-h-[75vh] w-full rounded-sm object-contain"
                />
                <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-white/85">
                  {FLAKE_COLORS[openIndex].name}
                  {FLAKE_COLORS[openIndex].orderOnly && (
                    <span className="ml-2 align-middle font-display text-[0.6rem] tracking-[0.15em] text-white/50">
                      (Order Only)
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {openIndex + 1} / {FLAKE_COLORS.length}
                </p>
              </motion.div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  showNext()
                }}
                aria-label="Next color"
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
