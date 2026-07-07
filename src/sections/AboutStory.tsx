import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Light section continuing the alternating rhythm (reference/BRIEF.md §2A) — AboutIntro above
// is dark, so the founder story returns to off-white with dark text.
const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#000000' // AboutIntro's section background

// Full verbatim founder story (reference/BRIEF.md §9 `/team-3`) paired one photo per paragraph,
// alternating photo side per paragraph — same personal-story layout as the live site. This is
// unique, personal, differentiating trust content — do not trim.
const STORY: { paragraph: string; photo: string; alt: string; caption: string }[] = [
  {
    paragraph:
      "Founded in 2020, we are a family-owned and operated garage floor coating company committed to delivering exceptional results with every project. I am Chase Gray, the owner and operator, and alongside my dedicated team, we ensure that each installation is completed to the highest standards of quality and craftsmanship.",
    photo: '/about/about-family-portrait.jpg',
    alt: 'Chase Gray and family portrait',
    caption: 'The Gray family',
  },
  {
    paragraph:
      'As a detail-oriented professional, I have spent years in the field personally training our crew to meet my exacting standards. While our company is growing rapidly, we remain focused on maintaining the highest level of quality in everything we do. To ensure the best possible results, we utilize top-of-the-line equipment, advanced technology, and premium materials, all designed to provide our customers with the fastest turnaround time without compromising on quality.',
    photo: '/about/about-chase-lisa-event.jpg',
    alt: 'Chase and Lisa Gray at a company event',
    caption: 'Chase & Lisa, North Peoria Home Show',
  },
  {
    paragraph:
      'My wife, Lisa, and I manage the business while balancing the joys and challenges of raising our four children: Bryley, Paxton, Nixon, and Remi. With ages ranging from 15 to 1, our family thrives on staying busy, and we take great pride in everything we do—both in business and at home. We are passionate about delivering an exceptional experience to our customers, and we look forward to continuing to serve you with integrity and excellence.',
    photo: '/about/about-daughter-branded.jpg',
    alt: "The Gray family's daughter wearing Next Level Coatings branded gear",
    caption: 'Next Level, even in diapers',
  },
]

// Subtle alternating tilt per photo (1-2deg) so the column reads as a curated stack of
// snapshots rather than flat, uniform rectangles.
const ROTATIONS = ['-rotate-1', 'rotate-2', '-rotate-1']

/** Founder story (reference/BRIEF.md §8 `/team-3`, §9 verbatim copy). */
export default function AboutStory() {
  return (
    <section className="relative z-30" style={{ backgroundColor: SECTION_BG }}>
      {/* Intro → Story (dark → light): light torn shape over the dark header above
          (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      {/* pb-8 (not the site's usual pb-24) — this section's content already reads tall (photo +
          copy blocks), so the standard bottom padding stacked with the CTA's own torn-edge
          transition read as an oversized dead-space gap before "Free Quotes" (BRIEF.md §4A). */}
      <div className="px-6 pb-8 pt-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-20">
          {STORY.map((block, index) => (
            <motion.div
              key={block.photo}
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <motion.div
                variants={fadeUp}
                className={`w-full max-w-sm flex-none lg:w-2/5 ${ROTATIONS[index]}`}
              >
                <img
                  src={block.photo}
                  alt={block.alt}
                  className="aspect-[4/5] w-full rounded-sm border-l-[3px] border-brand-teal object-cover shadow-xl shadow-black/20"
                />
                <p className="mt-3 text-center font-script text-xl text-brand-teal sm:text-2xl">
                  {block.caption}
                </p>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed text-brand-black/80 sm:text-xl"
              >
                {block.paragraph}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
