import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'
import { PageSectionBody, PageSectionHeading } from '../components/PageSectionBody'
import type { PageDetailsProps } from '../lib/pageContent'

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

/**
 * Concrete Coatings main content (reference: old site /concrete-coatings page copy).
 *
 * Two prose slots, editable in Sanity: slot 0 is the lead copy, slot 1's heading introduces the
 * SPACES chips and its copy follows them. The chips themselves stay in code — they are design,
 * not prose.
 */
export default function ConcreteCoatingsDetails({ sections }: PageDetailsProps) {
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
          <PageSectionBody blocks={sections[0]?.body ?? []} />

          <PageSectionHeading>{sections[1]?.heading}</PageSectionHeading>
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

          <PageSectionBody blocks={sections[1]?.body ?? []} className="mt-12" />
        </motion.div>
      </div>
    </section>
  )
}
