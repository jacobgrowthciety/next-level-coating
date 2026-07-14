import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Light section continuing the alternating rhythm (reference/BRIEF.md §2A) — the intro + form
// cluster above is dark, so this closing block returns to off-white with dark text, same
// pattern as GarageFlooringDetails.
const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#0A0A0A' // ContactFormSection's background

// Task brief service-area list (supersedes BRIEF.md §9's truncated "...").
const SERVICE_AREAS = [
  'Peoria',
  'Surprise',
  'Sun City',
  'Glendale',
  'Phoenix',
  'Scottsdale',
  'Paradise Valley',
  'Cave Creek',
  'Goodyear',
  'Buckeye',
  'Litchfield',
  'Tempe',
  'Mesa',
  'Queen Creek',
]

/** Warranty/brand line + service area list (reference/BRIEF.md §8 `/contact`, §9). */
export default function ContactInfo() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed text-brand-black/80 sm:text-xl"
          >
            Here at Next Level Coatings our name speaks for itself. We strive off attention to
            detail. All floors are backed with a 15 year warranty.
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl"
          >
            Proudly Servicing
          </motion.h2>
          <motion.ul
            variants={fadeUp}
            className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-brand-black/70 sm:text-base"
          >
            {SERVICE_AREAS.map((area, i) => (
              <li key={area} className="flex items-center gap-3">
                {area}
                {i < SERVICE_AREAS.length - 1 && (
                  <span aria-hidden="true" className="text-brand-teal">
                    &middot;
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
