import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Light section continuing the alternating color rhythm (reference/BRIEF.md §2A, §5C).
// Services Grid above is dark, so Reviews returns to light. A hair cooler/lighter than
// Why Trust Us's #f4f3ef and About's #faf9f5 so the three light sections on the page
// don't read as one flat wash.
const SECTION_BG = '#f6f5f0'
// Services Grid's dark body above — shown through the torn gaps of this section's top edge
// for the dark → light transition (must match ServicesGrid SECTION_BG).
const PREV_SECTION_BG = '#0a0a0a'

// Reviews are credibility, not showmanship (§5C) — cards stay static (no click/expand), but
// keep the same dark-card + teal-stripe DNA established in Services Grid's compact cards so
// the two sections feel like one design system, even though this section's own background
// is light per the alternating rhythm.
const CARD_BG = '#121212'

const REVIEWS: { name: string; text: string }[] = [
  {
    name: 'Will Gray',
    text: "All I can say is WOW!!! The crew at Next Level Coatings did a phenomenal job on my garage floor! I had serious stem wall issues that needed drastic repair. Chase, the owner, came by and gave an honest assessment and came up with a plan to repair it the right way. Kyle & Christian came out and had their new Elite System installed and completed in only 2 days. I am absolutely blown away at the end result and the finished job. I highly recommend Next Level Coatings to anyone. 10 out of 10!",
  },
  {
    name: 'C OJ',
    text: 'Crew was on time, professional and fast. They explained the process and time line before they started and made sure that I was clear on the process. Next Level’s equipment kept the dust to a minimum and very controlled mess during the process. My garage floor looks amazing! The crew left my property clean and with no evidence of them even being there! Job was complete in one day! Thank you again Next Level and I highly recommend for any of your floor coating needs!',
  },
  {
    name: 'Clint Tallmadge',
    text: "The team at Next Level Coatings did an amazing job on the garage floor at my cabin in Happy Jack! Communication was top notch and Chase's guys were professional, on time and did a very thorough cleanup when they were done. I couldn't be happier with the results and would recommend them to anyone that is looking for a contractor that checks all the boxes. 10/10!",
  },
  {
    name: 'Kristie McGehee',
    text: 'Absolutely love my new patio! The whole experience from the estimate to finished patio was great! I highly recommend them.',
  },
  {
    name: 'Cheryl Clemens',
    text: 'These guys are the best ... they were able to do the job in the time I needed at the price I wanted and the results are amazing!',
  },
  {
    name: 'Chris Johnson',
    text: 'Great product, Great results, and even better customer service! 10/10 would recommend Next Level to all my friends and family! Thanks again!',
  },
]

const LEAVE_REVIEW_URL = 'https://form.trustmary.com/c/G51dCrMfO?source=widget'

const Star = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-teal" fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.53 6.1.72-4.55 4.2 1.2 6.05L10 14.9l-5.35 3.1 1.2-6.05L1.3 7.75l6.1-.72L10 1.5z" />
  </svg>
)

/** Reviews section (reference/BRIEF.md §5C) — static grid of verified Google reviews. */
export default function Reviews() {
  return (
    <section className="relative z-50" style={{ backgroundColor: SECTION_BG }}>
      {/* Services → Reviews (dark → light): light torn shape over the near-black section
          above (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              variants={fadeUp}
              className="font-display text-xs uppercase tracking-[0.35em] text-brand-black/50"
            >
              Five-star rated
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-script text-4xl text-brand-teal sm:text-5xl lg:text-6xl"
            >
              Reviews
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base leading-relaxed text-brand-black/70 sm:text-lg"
            >
              Verified 5-star reviews, pulled directly from Google.
            </motion.p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                className="flex h-full flex-col rounded-sm border-l-[3px] border-brand-teal p-7"
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{review.text}</p>
                <p className="mt-5 font-display text-sm uppercase tracking-wide text-white">
                  {review.name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Secondary link only — this is a review-collection form for new prospects, not a
              display widget, so it must not compete with the featured testimonials above (§5C). */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <a
              href={LEAVE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wide text-brand-black/50 underline decoration-brand-black/20 underline-offset-4 transition-colors duration-300 hover:text-brand-teal hover:decoration-brand-teal"
            >
              Leave us a review
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
