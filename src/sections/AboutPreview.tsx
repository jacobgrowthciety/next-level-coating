import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider, { COMPACT_DIVIDER_HEIGHT } from '../components/RoughDivider'

// Light section continuing the alternating color rhythm (reference/BRIEF.md §2A). Process
// above is dark, so this About teaser is off-white with dark text. A hair warmer/lighter
// than Why Trust Us's #f4f3ef so the two light sections don't read as one flat wash.
const SECTION_BG = '#faf9f5'
// Charcoal body of Process above — shown through the torn gaps of this section's top edge
// for the dark → light transition (must match Process SECTION_BG).
const PREV_SECTION_BG = '#121212'

/** About Us teaser (reference/BRIEF.md §9) — compact preview linking to the full story. */
export default function AboutPreview() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      {/* Process → About (dark → light): light torn shape over the charcoal section above
          (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider
        fillColor={SECTION_BG}
        revealColor={PREV_SECTION_BG}
        className={COMPACT_DIVIDER_HEIGHT}
      />

      <div className="section-compact px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="font-script text-4xl text-brand-teal sm:text-5xl"
          >
            About Us
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-black/80 sm:text-xl"
          >
            A family owned business providing top-tier concrete coating services to all of
            Arizona.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-black px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-brand-teal hover:text-brand-black"
            >
              Read Full Story
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
