import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleIn } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Dark section immediately following the compact header (reference/BRIEF.md §9A, §4A), same
// near-black shade GarageFlooringGallery uses so the two in-flow dark sections (Intro's pure
// black vs. this section) read with shade variance rather than as one flat surface (§2A).
const SECTION_BG = '#141414'
const PREV_SECTION_BG = '#000000' // FlakeColorChartIntro's section background

const TOTAL_COLORS = 28
// flake-11 and flake-21 were sourced as .png, the rest .jpg (public/images/flake-colors/).
const PNG_INDEXES = new Set([11, 21])

// Each image has the color name printed directly on it (task brief), so no separate on-screen
// text label is rendered per swatch — alt text stays descriptive-but-generic since we don't
// have the per-color names as structured data.
const FLAKE_COLORS: { id: string; src: string; alt: string }[] = Array.from(
  { length: TOTAL_COLORS },
  (_, i) => {
    const n = i + 1
    const padded = String(n).padStart(2, '0')
    const ext = PNG_INDEXES.has(n) ? 'png' : 'jpg'
    return {
      id: `flake-${padded}`,
      src: `/images/flake-colors/flake-${padded}.${ext}`,
      alt: `Next Level Coatings flake color chip sample ${n} of ${TOTAL_COLORS}`,
    }
  },
)

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
              <motion.button
                key={color.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: (index % 4) * 0.06 }}
                className="group relative aspect-square overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
              >
                <img
                  src={color.src}
                  alt={color.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </motion.button>
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
                  src={FLAKE_COLORS[openIndex].src}
                  alt={FLAKE_COLORS[openIndex].alt}
                  className="max-h-[75vh] w-full rounded-sm object-contain"
                />
                <p className="mt-4 text-sm text-white/50">
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
