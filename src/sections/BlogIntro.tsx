import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A) — same treatment as the service pages
// (GarageFlooringIntro): solid dark background, no hero video, minimal vertical space so the
// post grid below reads as one continuous dark block with this header.
const INTRO_BG = '#000000'

/** Blog listing page header. */
export default function BlogIntro() {
  return (
    <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          {/* Breadcrumb (§9A) */}
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Blog</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            News &amp; Tips
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            The Latest
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Coating guides, project spotlights, and advice from the Next Level Coatings crew across
            the Phoenix Valley.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
