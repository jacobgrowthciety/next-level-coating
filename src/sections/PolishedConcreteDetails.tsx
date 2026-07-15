import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // PolishedConcreteGallery's section background
const CARD_BG = '#121212'

const BENEFITS: { title: string; description: string; iconPath: string }[] = [
  {
    title: 'Low Maintenance',
    description: 'No recoating, no reapplying. A ground and honed surface just needs a regular sweep and mop.',
    iconPath: 'M5 13l4 4L19 7',
  },
  {
    title: 'High-Shine Finish',
    description: 'A reflective, glass-like sheen that brightens a space without adding a topical coating.',
    iconPath: 'M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M18.4 18.4l1.4 1.4M5.6 18.4 4.2 19.8M18.4 5.6l1.4-1.4',
  },
  {
    title: 'Built To Last',
    description: 'The concrete itself becomes the finish, so there is no coating layer to chip, peel, or wear through.',
    iconPath: 'M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z',
  },
]

/** Polished Concrete main content. New copy (not sourced from the old site — see PolishedConcrete.tsx). */
export default function PolishedConcreteDetails() {
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
            Polished concrete is your existing slab, ground down in progressive steps and honed
            to a smooth, reflective finish. There is no epoxy, no polyaspartic, no topical layer
            applied on top. The shine comes from the concrete itself, which is what gives it a
            clean, modern look that holds up without the upkeep a coated floor needs.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            It's a strong choice for a garage, showroom, or any space where you want a sleek
            surface without the maintenance schedule of a coating. Since the finish is the
            concrete itself, there is nothing to chip, peel, or recoat down the road, just a
            surface that gets swept and mopped like any other floor.
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl">
            Why Choose Polished Concrete
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
            Our process starts the same way every polyaspartic project does: heavy-duty diamond
            grinding to prep the slab and repair any cracks or imperfections along the way. From
            there, we work through progressively finer diamond grits, honing the surface step by
            step until it reaches the level of shine you're after, from a soft satin look to a
            high-gloss finish.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl">
            The result is a durable, low-maintenance floor that's ready to use as soon as we
            finish, with none of the cure time a coated system needs.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
