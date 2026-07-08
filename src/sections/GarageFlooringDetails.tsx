import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Light section continuing the alternating rhythm (reference/BRIEF.md §2A) — the header +
// gallery + reviews cluster above is dark, so the body copy/comparison cards return to
// off-white with dark text.
const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // GarageFlooringGallery's section background

// Dark comparison cards on the light body, reusing the Services/Reviews card DNA (sharp
// corners, single teal accent stripe) called out in the task brief for these two options.
const CARD_BG = '#121212'

const OPTIONS: {
  eyebrow: string
  title: string
  description: string
  iconPath: string
}[] = [
  {
    eyebrow: 'Standard',
    title: '1-Day Install',
    // Verbatim claim (reference/BRIEF.md §9): "1-day polyaspartic systems — prepped, poured,
    // chipped and clear coated in just one day."
    description:
      'We offer 1-day polyaspartic systems — prepped, poured, chipped, and clear coated in just one day.',
    iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 4 2.3-1 1.7-5-2.9V6h2v6.4Z',
  },
  {
    eyebrow: 'Upgrade',
    title: 'Double Clear Coat',
    // Verbatim claim (reference/BRIEF.md §9): "a double polyaspartic clear coat system to
    // achieve a smoother, glossier finish."
    description:
      'We also offer a double polyaspartic clear coat system to achieve a smoother, glossier finish.',
    iconPath: 'M4 17 12 21l8-4M4 12l8 4 8-4M12 3 4 7l8 4 8-4-8-4Z',
  },
]

/** Garage Flooring main content (reference/BRIEF.md §8 `/garage-flooring`, §9, verbatim copy). */
export default function GarageFlooringDetails() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      {/* Gallery/Reviews → Details (dark → light): light torn shape over the dark cluster
          above (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed text-brand-black/80 sm:text-xl"
          >
            Without a proper coating, your concrete floor may quickly develop cracks, stains,
            and other forms of damage. With our polyaspartic garage floor coating you have the
            option of a solid single-color floor, or a full broadcast flake floor. Whatever
            your goals are, our expertise is sure to offer the perfect solution.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg leading-relaxed text-brand-black/80 sm:text-xl"
          >
            Here at Next Level, garage floors are our specialty! When you hire one of our
            professionals, they'll handle the entire process from start to finish.
          </motion.p>

          {/* Visual callout for the two upsell differentiators (task brief: pull these out of
              paragraph text rather than leaving them buried). Heading added so the two option
              h3s below sit under their own h2 instead of skipping straight from the page's h1
              (SEO audit fix — this section previously had no heading of its own). */}
          <motion.h2
            variants={fadeUp}
            className="mt-12 font-script text-3xl text-brand-teal sm:text-4xl"
          >
            Two Ways To Level Up
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {OPTIONS.map((option) => (
              <div
                key={option.title}
                className="flex flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/50 bg-brand-teal/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-brand-teal"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={option.iconPath} />
                    </svg>
                  </span>
                  <span className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-brand-teal/70">
                    {option.eyebrow}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
                  {option.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {option.description}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-12 text-lg leading-relaxed text-brand-black/80 sm:text-xl"
          >
            Upgrading your garage floor with a durable, aesthetically pleasing coating is a
            worthwhile investment, but taking a DIY approach often leads to unnecessary stress
            and subpar results. At Next Level Coatings, we bring precision, efficiency, and
            peace of mind to the table.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
