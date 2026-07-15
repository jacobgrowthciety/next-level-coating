import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // ConcreteCoatingsGallery's section background
const CARD_BG = '#121212'

const SPACES: { name: string; iconPath: string }[] = [
  { name: 'Garages', iconPath: 'M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z' },
  { name: 'Warehouses', iconPath: 'M4 20V9l8-5 8 5v11M4 20h16M9 20v-6h6v6' },
  { name: 'Retail Spaces', iconPath: 'M4 9V4h16v5M4 9l1 11h14l1-11M4 9h16M10 13v4' },
  { name: 'Offices', iconPath: 'M4 20V4h10v16M14 8h6v12h-6M7 8h1M7 12h1M7 16h1' },
  { name: 'Patios', iconPath: 'M12 3 4 7l8 4 8-4-8-4Zm-8 4v10l8 4 8-4V7' },
]

/** Concrete Coatings main content (reference: old site /concrete-coatings page copy, cleaned for React). */
export default function ConcreteCoatingsDetails() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <motion.p variants={fadeUp} className="text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            At Next Level Coatings, we provide durable, high-performance flooring solutions
            designed to handle Arizona's heat, dust, and daily wear. As a family-owned business
            serving the Greater Phoenix area, we specialize in premium resurfacing services,
            including concrete floor coatings, epoxy systems, and polyaspartic concrete coatings
            for residential and commercial properties.
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">
            Coatings For Every Space
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-3">
            {SPACES.map((space) => (
              <span
                key={space.name}
                className="inline-flex items-center gap-2 rounded-full border-l-[3px] border-brand-teal px-5 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: CARD_BG }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-teal" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={space.iconPath} />
                </svg>
                {space.name}
              </span>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Our advanced epoxy and polyaspartic systems create a seamless, professional finish
            while resisting moisture, stains, chemicals, UV exposure, and heavy use, perfect for
            homes and businesses alike.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            What makes our process different is the attention we give to every project. We don't
            believe in shortcuts or cookie-cutter solutions. Instead, we take the time to assess
            your space, discuss your goals, and recommend the best coating system for your needs.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Our polyaspartic concrete coatings are especially popular for their fast cure times,
            durability, and modern appearance. We complete many projects in as little as one day,
            minimizing downtime without sacrificing quality. As a local, family-run company, Next
            Level Coatings is built on trust, quality craftsmanship, and clear communication.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
