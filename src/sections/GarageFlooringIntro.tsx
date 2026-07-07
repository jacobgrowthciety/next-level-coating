import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A) — service pages do NOT use the full video hero,
// that treatment is homepage-only. Solid dark background, no image/video, minimal vertical
// space so visitors reach real content (gallery, comparison cards) quickly. Directly followed
// by the Gallery/Reviews cluster below with no divider — they read as one continuous dark block.
const INTRO_BG = '#000000'

/** Garage Flooring page header (reference/BRIEF.md §8 `/garage-flooring`, §9A pattern). */
export default function GarageFlooringIntro() {
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
            <span>Services</span>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Garage Flooring</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Our Specialty
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            Garage Flooring
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Solid color or full broadcast flake, prepped and finished by a crew that treats garage
            floors as our specialty — not a side job.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
