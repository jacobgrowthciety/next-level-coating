import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A pattern) — same treatment as Garage Flooring's
// intro. "Flake Color Chart" is a top-level primary nav link (not a Services dropdown item,
// see Header.tsx PRIMARY_LINKS), so the breadcrumb skips the "Services" crumb Garage Flooring
// uses.
const INTRO_BG = '#000000'

/** Flake Color Chart page header (reference/BRIEF.md §8 `/chip-color-chart`, §9A pattern). */
export default function FlakeColorChartIntro() {
  return (
    <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Flake Color Chart</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Find Your Flake
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            Flake Color Chart
          </motion.h1>
          {/* BRIEF.md §9 copy adapted: the original promised a click-through to per-color
              project examples, but no per-color project photo data exists yet to build that —
              swapped for an accurate description of the enlarge/lightbox interaction actually
              built below. Revisit if per-color project photos are sourced later. */}
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Choose from our wide variety of color options for your floor. Tap any color to see
            it up close.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
