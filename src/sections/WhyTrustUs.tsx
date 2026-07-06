import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Light section in the page's alternating color rhythm (reference/BRIEF.md §2A): off-white
// body with dark text — the inverse of the dark sections. The rough top edge is filled with
// this same color so the torn shape connects seamlessly into the body below.
const SECTION_BG = '#f4f3ef'

/** "Why Trust Us" trust points (reference/BRIEF.md §9). */
const TRUST = [
  {
    label: '4X Stronger Than Epoxy',
    path: 'M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z',
  },
  {
    label: 'Lifetime Warranty',
    path: 'M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
  },
  {
    label: 'One Day Installation',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 4 2.3-1 1.7-5-2.9V6h2v6.4Z',
  },
  {
    label: 'Family Owned & Operated',
    path: 'M12 3 3 11h2v9h5v-6h4v6h5v-9h2L12 3Z',
  },
  {
    label: 'Five Star Google Rated',
    path: 'm12 2 3 6.3 6.9.9-5 4.8 1.3 6.8L12 17.8 5.8 20.8l1.3-6.8-5-4.8 6.9-.9L12 2Z',
  },
]

export default function WhyTrustUs() {
  return (
    <section className="relative z-10">
      {/* Hero → Why Trust Us (dark → light): the frayed off-white shape reveals the dark,
          stickied hero video through its torn gaps (no revealColor = transparent overlap). */}
      <RoughDivider fillColor={SECTION_BG} />

      {/* Solid body */}
      <div className="px-6 pb-24 pt-4" style={{ backgroundColor: SECTION_BG }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-6xl"
        >
          <motion.h2
            variants={fadeUp}
            className="text-center font-script text-4xl text-brand-teal sm:text-5xl"
          >
            Why Trust Us
          </motion.h2>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-5">
            {TRUST.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="flex flex-col items-center gap-4 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-teal/50 bg-brand-teal/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-brand-teal"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={item.path} />
                  </svg>
                </span>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-black">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
