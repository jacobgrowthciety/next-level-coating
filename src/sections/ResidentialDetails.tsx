import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // ResidentialGallery's section background
const CARD_BG = '#121212'

const WHY_CARDS: { title: string; description: string; iconPath: string }[] = [
  {
    title: 'Built To Last',
    description: '4X stronger than residential epoxy flooring, offering unmatched durability that withstands wear and tear.',
    iconPath: 'M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z',
  },
  {
    title: 'Safety First',
    description: 'Optional non-slip additives make this a great choice for pool decks or areas prone to spills and moisture.',
    iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v6l4 2',
  },
]

const STEPS: { n: string; name: string; body: string }[] = [
  {
    n: '01',
    name: 'Diamond Grinding',
    body: 'We start by grinding your concrete floor with heavy-duty machinery and use hand grinders for edges, ensuring maximum adhesion for the coating.',
  },
  {
    n: '02',
    name: 'Epoxy Repair',
    body: 'Cracks, chips, and other imperfections are repaired with a flexible two-part epoxy patch for a smooth foundation.',
  },
  {
    n: '03',
    name: 'Base Coat Application',
    body: 'A UV-stable polyaspartic base coat is applied evenly, creating a strong bond that also preps the surface for flakes.',
  },
  {
    n: '04',
    name: 'Flake Application',
    body: 'We spread full-broadcast chips across the floor for complete coverage and added texture.',
  },
  {
    n: '05',
    name: 'Scraping & Cleaning',
    body: 'After the base coat cures, we scrape away excess flakes, sand edges, and vacuum to prep for the final layer.',
  },
  {
    n: '06',
    name: 'Clear Coat Sealing',
    body: 'Finally, we apply a high-quality polyaspartic clear coat for exceptional protection, enhanced shine, and optional non-slip features.',
  },
]

/** Residential main content (reference: old site /residential page copy, cleaned for React). */
export default function ResidentialDetails() {
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
            When it comes to upgrading your home, every detail matters. Your floors, especially
            in high-traffic areas like garages, patios, and pool decks, deserve as much attention
            as the rest of your living space. Our residential polyaspartic floor coating services
            give homeowners in Arizona a practical and stunning solution for concrete surfaces.
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">
            Why Choose Residential Polyaspartic
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_CARDS.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/50 bg-brand-teal/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-teal" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={card.iconPath} />
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{card.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            At Next Level Coating, we're proud of the meticulous process we've developed to
            ensure every project exceeds expectations. Our six-step method guarantees the
            perfect balance of precision and efficiency, offering same-day completion without
            cutting corners.
          </motion.p>

          <motion.ol variants={fadeUp} className="mt-8 space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="rounded-sm border-l-[3px] border-brand-teal/60 bg-white/60 p-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl tabular-nums text-brand-teal">{step.n}</span>
                  <h3 className="font-display text-xl uppercase tracking-tight text-brand-black">
                    {step.name}
                  </h3>
                </div>
                <p className="mt-2 text-base leading-relaxed text-brand-black/75">{step.body}</p>
              </li>
            ))}
          </motion.ol>

          <motion.p variants={fadeUp} className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            We're licensed, bonded, and insured (ROC #352138), and we back every residential
            polyaspartic floor coating with a lifetime warranty. Our family-owned business treats
            your home like our own, ensuring attention to detail, respect for your space, and
            high-quality results.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            Is your home in need of a refresh? Whether it's your garage, patio, pool deck, or
            walkway, our residential polyaspartic floor coating can give your space the
            durability, functionality, and beauty it deserves.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
