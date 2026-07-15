import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'
import LeadForm from '../components/LeadForm'

const SECTION_BG = '#41CAD2'
const PREV_SECTION_BG = '#f4f3ef' // ConcreteCoatingsDetails' light body

const PHONE_HREF = 'tel:+16232241097'
const PHONE_DISPLAY = '(623) 224-1097'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}

/** Lead capture CTA for the Concrete Coatings page (reference/BRIEF.md §6, §8). */
export default function ConcreteCoatingsCTA() {
  return (
    <section id="quote" className="relative z-40 scroll-mt-20" style={{ backgroundColor: SECTION_BG }}>
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="max-w-xl text-center lg:text-left">
            <motion.p variants={fadeUp} className="font-display text-xs uppercase tracking-[0.35em] text-brand-black/60">
              Free Quotes · No Obligation
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 font-script text-4xl text-brand-black sm:text-5xl lg:text-6xl">
              Ready For Your Next Level Space?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-brand-black/80 lg:mx-0">
              Trusted craftsmanship for every surface on your property. Let's get your quote
              started.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-full bg-brand-black px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-white hover:text-brand-black"
              >
                <PhoneIcon className="h-4 w-4" />
                Call Now
              </a>
              <a href={PHONE_HREF} className="font-display text-2xl tracking-tight text-brand-black transition-opacity hover:opacity-70">
                {PHONE_DISPLAY}
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="w-full lg:justify-self-end">
            <LeadForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
