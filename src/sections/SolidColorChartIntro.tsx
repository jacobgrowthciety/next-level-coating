import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A pattern) — mirrors FlakeColorChartIntro exactly so
// the two color-chart pages read as siblings. "Solid Color Chart" is a top-level primary nav link
// (Header.tsx PRIMARY_LINKS), so the breadcrumb skips the "Services" crumb service pages use.
const INTRO_BG = '#000000'

/** Solid Color Chart page header (reference/BRIEF.md §8 `/solid-color-chart`, §9A pattern). */
export default function SolidColorChartIntro() {
  return (
    <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Solid Color Chart</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Pick Your Shade
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            Solid Color Chart
          </motion.h1>
          {/* Unique copy written for this page — the old site's version of this URL was a Wix
              duplicate slug with no body text at all (reference/BRIEF.md §11). */}
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Prefer a clean, single-color floor over a full flake broadcast? Choose from our
            solid polyaspartic base coat colors below.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
