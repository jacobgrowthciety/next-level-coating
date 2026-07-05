import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'

/**
 * Placeholder hero section — scaffolding only.
 * The signature cinematic video sequence is specified in reference/BRIEF.md §5.
 */
export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
        >
          Arizona's Top Concrete Coatings Specialists
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg text-brand-gray"
        >
          Specializing in garage floors, commercial, patios, sidewalks,
          driveways, grind n' seal, pool decks, and pavers.
        </motion.p>
        <motion.a
          variants={fadeUp}
          href="tel:+16232241097"
          className="mt-10 inline-block rounded-full bg-brand-teal px-8 py-3 font-semibold text-brand-black transition-colors hover:bg-brand-teal/80"
        >
          Call Now
        </motion.a>
      </motion.div>
    </section>
  )
}
