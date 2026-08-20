import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'
import { PageSectionBody, PageSectionHeading } from '../components/PageSectionBody'
import type { PageDetailsProps } from '../lib/pageContent'

const SECTION_BG = '#f4f3ef'
const PREV_SECTION_BG = '#141414' // PoolDecksGallery's section background
const CARD_BG = '#121212'

const BENEFITS: { title: string; description: string; iconPath: string }[] = [
  {
    title: '100% UV Stable',
    description: 'Your deck resists fading, even under Arizona\'s blazing sun.',
    iconPath: 'M12 3a9 9 0 1 0 9 9c0-.46-.03-.92-.08-1.36A5.5 5.5 0 0 1 12 3Z',
  },
  {
    title: 'Non-Slip Safety',
    description: 'Adds an extra layer of safety, perfect for active families and entertaining guests.',
    iconPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v6l4 2',
  },
  {
    title: 'Cooler Poolside',
    description: 'Significantly reduces surface temperatures, so bare feet stay comfortable.',
    iconPath: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8',
  },
]

/**
 * Pool Decks main content (reference: old site /pool-decks page copy).
 *
 * Two prose slots, editable in Sanity: slot 0 is the lead copy, slot 1's heading introduces the
 * BENEFITS cards and its copy follows them. The cards stay in code.
 */
export default function PoolDecksDetails({ sections }: PageDetailsProps) {
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

          <PageSectionBody blocks={sections[1]?.body ?? []} className="mt-12" />
        </motion.div>
      </div>
    </section>
  )
}
