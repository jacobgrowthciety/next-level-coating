import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider, { COMPACT_DIVIDER_HEIGHT } from '../components/RoughDivider'

// The page's second teal moment, and the same token as the closing CTA (reference/BRIEF.md §2A).
const SECTION_BG = '#41CAD2'
// Services' near-black body above — shown through the torn gaps of this section's top edge for
// the dark → teal transition (must match ServicesGrid SECTION_BG).
const PREV_SECTION_BG = '#0a0a0a'

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/**
 * Mid-page CTA — a short pause between Services and the Process walkthrough, catching visitors
 * who are already sold before asking them to read six process steps.
 *
 * Deliberately the compact cut of the closing CTA rather than a second hero: one column, centred,
 * no lead form and no phone block (both live in FinalCTA, which this links to via the existing
 * `#quote` anchor). Black-on-teal for the same reason FinalCTA is — teal type would vanish
 * against a teal body — and the button is the same black pill used there and in About Preview.
 * `COMPACT_DIVIDER_HEIGHT` keeps the torn edge short so the whole section stays a beat, not a
 * destination.
 */
export default function MidPageCTA() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      {/* Services → Mid CTA (dark → teal): teal torn shape over the near-black section above
          (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider
        fillColor={SECTION_BG}
        revealColor={PREV_SECTION_BG}
        className={COMPACT_DIVIDER_HEIGHT}
      />

      <div className="px-6 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="font-display text-xs uppercase tracking-[0.35em] text-brand-black/60"
          >
            Let's Build a Plan
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-script text-4xl text-brand-black sm:text-5xl"
          >
            Every Great Floor Starts With a Conversation
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-brand-black/80 sm:text-lg"
          >
            Tell us about your project and we'll recommend the best flooring system for your
            space and provide a free estimate.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <a
              href="#quote"
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand-black px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-white hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#41CAD2]"
            >
              Get My Free Estimate
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
