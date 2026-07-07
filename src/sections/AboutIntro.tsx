import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A pattern, reused for a non-service page) — no
// video hero, matching Garage Flooring's GarageFlooringIntro treatment.
const INTRO_BG = '#000000'

/** About page header (reference/BRIEF.md §8 `/team-3`, §9A pattern). */
export default function AboutIntro() {
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
            <span className="text-white/80">About</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Family Owned & Operated
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            About Us
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            A family owned business providing top-tier concrete coating services to all of
            Arizona.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
