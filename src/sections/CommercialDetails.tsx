import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // CommercialGallery's section background
const CARD_BG = '#121212'

const ENVIRONMENTS: { name: string; description: string; iconPath: string }[] = [
  {
    name: 'Warehouses',
    description: 'Withstands heavy foot traffic, machinery, and daily operations without breaking down.',
    iconPath: 'M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z',
  },
  {
    name: 'Showrooms',
    description: 'A flawless, polished finish that upgrades ordinary concrete into a professional surface.',
    iconPath: 'M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5',
  },
  {
    name: 'Commercial Kitchens',
    description: 'A safe, slip-resistant surface built to handle spills and daily wear.',
    iconPath: 'M6 3v7a3 3 0 0 0 3 3v8M6 3v4M9 3v4M6 10h3M15 3c-1.5 0-2 2-2 4s.5 4 2 4 2-2 2-4-.5-4-2-4Zm0 8v10',
  },
]

/** Commercial main content (reference: old site /commercial page copy, cleaned for React). */
export default function CommercialDetails() {
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
            Next Level Coating takes pride in delivering commercial floor coatings that perfectly
            balance durability and aesthetics. Our high-performance commercial polyaspartic
            coating meets the needs of any business space, whether it's a bustling warehouse, a
            sleek showroom, or a busy commercial kitchen. Designed to withstand heavy foot
            traffic, machinery, and daily operations, these coatings provide a safe,
            slip-resistant surface that lasts for years.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            From warehouses and showrooms to commercial kitchens and golf courses, concrete
            coatings are the best way to enhance and protect any commercial area. Using premium
            products alongside state-of-the-art equipment, and supported by certified installers,
            we get you the best results that last a lifetime. There is no job too big for us.
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">
            Built For Business
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ENVIRONMENTS.map((env) => (
              <div
                key={env.name}
                className="flex flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/50 bg-brand-teal/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={env.iconPath} />
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-xl uppercase tracking-tight text-white">
                  {env.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{env.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Beyond their strength, our commercial polyaspartic coatings are customizable and come
            in a range of colors and finishes to enhance the style of your space. Our meticulous
            application ensures a flawless finish, transforming ordinary concrete into a
            polished, professional foundation. With fast installation that minimizes downtime, we
            help you get back to business quickly while upgrading your flooring to something
            extraordinary.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
