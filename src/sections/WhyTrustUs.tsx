import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import maskUrl from '../assets/dividers/rough-edge-mask.png'

// Section background — the rough divider strip and the solid body share this exact color
// so the masked edge connects seamlessly into the body below. Dark charcoal (BRIEF.md §2 neutrals).
const SECTION_BG = '#0a0a0c'

/** "Why Trust Us" trust points (reference/BRIEF.md §9). */
const TRUST = [
  {
    label: '4X Stronger Than Epoxy',
    path: 'M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z',
  },
  {
    label: 'Lifetime Warranty',
    path: 'M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
  },
  {
    label: 'One Day Installation',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 4 2.3-1 1.7-5-2.9V6h2v6.4Z',
  },
  {
    label: 'Family Owned & Operated',
    path: 'M12 3 3 11h2v9h5v-6h4v6h5v-9h2L12 3Z',
  },
  {
    label: 'Five Star Google Rated',
    path: 'm12 2 3 6.3 6.9.9-5 4.8 1.3 6.8L12 17.8 5.8 20.8l1.3-6.8-5-4.8 6.9-.9L12 2Z',
  },
]

// Shared mask props. Force luminance interpretation — the PNG's alpha is fully opaque, so the
// default alpha-based mask would show everything; luminance uses the black/white RGB instead.
// `WebkitMaskSourceType` is WebKit's equivalent for older Safari (< 15.4).
const maskStyle = {
  WebkitMaskImage: `url(${maskUrl})`,
  maskImage: `url(${maskUrl})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  maskMode: 'luminance',
  WebkitMaskSourceType: 'luminance',
} as React.CSSProperties

const HIGHLIGHT_OFFSET = 3 // px the teal copy peeks above the dark edge = stroke thickness

// Main dark shape (top layer) — its solid lower portion connects seamlessly into the body.
const darkLayerStyle: React.CSSProperties = { ...maskStyle, backgroundColor: SECTION_BG }
// Teal outline (behind, nudged up) — only the sliver above the dark edge shows, tracing the fray.
const highlightLayerStyle: React.CSSProperties = {
  ...maskStyle,
  backgroundColor: '#41CAD2',
  transform: `translateY(-${HIGHLIGHT_OFFSET}px)`,
}

export default function WhyTrustUs() {
  return (
    <section className="relative z-10">
      {/* Rough brush top edge. Two stacked copies of the same mask: a teal outline nudged up
          behind the dark shape, so a thin teal sliver traces the frayed edge against any background. */}
      <div aria-hidden="true" className="relative h-32 w-full sm:h-40 lg:h-52">
        <div className="absolute inset-0" style={highlightLayerStyle} />
        <div className="absolute inset-0" style={darkLayerStyle} />
      </div>

      {/* Solid body */}
      <div className="px-6 pb-24 pt-4" style={{ backgroundColor: SECTION_BG }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-6xl"
        >
          <motion.h2
            variants={fadeUp}
            className="text-center font-script text-4xl text-brand-teal sm:text-5xl"
          >
            Why Trust Us
          </motion.h2>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-5">
            {TRUST.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="flex flex-col items-center gap-4 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-teal/40 bg-brand-teal/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-brand-teal"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={item.path} />
                  </svg>
                </span>
                <p className="text-sm font-semibold uppercase tracking-wide text-white">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
