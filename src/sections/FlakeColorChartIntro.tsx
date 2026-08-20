import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import SanityProse from '../components/SanityProse'
import type { PageIntroProps } from '../lib/pageContent'

// Compact page header (reference/BRIEF.md §9A pattern) — same treatment as Garage Flooring's
// intro. "Flake Color Chart" is a top-level primary nav link (not a Services dropdown item,
// see Header.tsx PRIMARY_LINKS), so the breadcrumb skips the "Services" crumb Garage Flooring
// uses.
const INTRO_BG = '#000000'

/** Flake Color Chart page header (reference/BRIEF.md §8 `/chip-color-chart`, §9A pattern). */
export default function FlakeColorChartIntro({ h1, body }: PageIntroProps) {
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
            className="mt-2 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            {h1}
          </motion.h1>
          {/* This copy promises a click-through to per-color project examples: each swatch links
              to /flake-color-chart/<id>, backed by a `flakeGallery` document, and colors without
              photos yet show a "coming soon" state. An editor rewriting it in Studio should keep
              that affordance described without over-promising real installs. */}
          <motion.div variants={fadeUp} className="mt-4">
            <SanityProse blocks={body} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
