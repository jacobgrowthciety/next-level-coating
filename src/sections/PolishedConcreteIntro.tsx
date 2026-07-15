import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

const INTRO_BG = '#000000'

/** Polished Concrete page header (reference/BRIEF.md §8 `/polished-concrete`, §9A pattern). */
export default function PolishedConcreteIntro() {
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
            <span className="text-white/80">Polished Concrete</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Diamond Ground
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            Polished Concrete
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            A smooth, high-shine finish achieved through precision diamond grinding, for a sleek,
            low-maintenance surface.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
