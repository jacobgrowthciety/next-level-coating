import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import SanityProse from '../components/SanityProse'
import type { PageIntroProps } from '../lib/pageContent'

const INTRO_BG = '#000000'

/** Pool Decks page header (reference/BRIEF.md §8 `/pool-decks`, §9A pattern). */
export default function PoolDecksIntro({ h1, body }: PageIntroProps) {
  return (
    <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span>Services</span>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Pool Decks</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Poolside
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            {h1}
          </motion.h1>
          <motion.div variants={fadeUp} className="mt-4">
            <SanityProse blocks={body} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
