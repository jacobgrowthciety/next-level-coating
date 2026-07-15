import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // PatiosGallery's section background
const CARD_BG = '#121212'

const BENEFITS: { title: string; description: string; iconPath: string }[] = [
  {
    title: 'Cooler Underfoot',
    description: 'This material drops the surface temperature from the heat, even in direct Arizona sun.',
    iconPath: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8',
  },
  {
    title: 'Built-In Traction',
    description: 'More chip texture than our garage floors for extra grip, plus an optional non-slip additive.',
    iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v6l4 2',
  },
  {
    title: '100% UV Stable',
    description: '4X stronger than epoxy and built to last a lifetime outside in the sun.',
    iconPath: 'M12 3a9 9 0 1 0 9 9c0-.46-.03-.92-.08-1.36A5.5 5.5 0 0 1 12 3Z',
  },
]

/** Patios, Sidewalks & Driveways main content (reference: old site /patios page copy, cleaned for React). */
export default function PatiosDetails() {
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
            Our patios, sidewalks, and driveways are an affordable solution to bring your
            concrete to life. Our polyaspartic system is 100% UV stable and 4X stronger than
            epoxy, built to last a lifetime outside in the Arizona sun. We leave our patios with
            more chip texture than our garage floors to create more traction, but can also add a
            non-slip additive for even more grip. Not only is it a strength and aesthetic
            upgrade, but this material will drop the surface temperature from the heat as well.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Applying concrete patio coatings requires precision. Achieving an even and smooth
            finish involves techniques that take time and practice to perfect, such as rolling,
            spraying, and troweling. Our professionals use specialized tools to evenly spread the
            coating without streaks, bubbles, or patches.
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">
            Made For The Arizona Sun
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/50 bg-brand-teal/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={b.iconPath} />
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-xl uppercase tracking-tight text-white">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{b.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Concrete patio coatings serve as a protective barrier for your patio surface. Better
            than epoxy, our coatings are made from polyaspartic material to better shield the
            concrete from weather damage, wear, and tear. We offer finishes ranging from high
            gloss to natural textures.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Your concrete patio should be a space to gather, relax, and create lasting memories.
            A professional-grade polyaspartic patio coating adds years to its lifespan, ensures
            safety, and enhances its visual appeal, turning your patio into an investment rather
            than an expense.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
