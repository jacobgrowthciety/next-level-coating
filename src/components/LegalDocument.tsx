import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from './RoughDivider'
import { trackClickToCall, trackClickToEmail } from '../lib/analytics'
import { BUSINESS, type LegalBlock, type LegalBullet } from '../content/legal'

// Compact dark page header + light document body — the About page pattern
// (reference/BRIEF.md §9A) with the alternating dark → light rhythm (§2A), minus the
// hero/gallery these text-only legal pages don't need.
const HEADER_BG = '#000000'
const BODY_BG = '#f4f3ef'

// Copy, NAP and types now live in content/legal.ts so the build-time prerenderer can read the same
// source (see the note at the top of that file). Re-exported here because this module was the
// original home and the legal pages already import BUSINESS from it.
export { BUSINESS } from '../content/legal'
export type { LegalBlock, LegalBullet, LegalDoc } from '../content/legal'

/** Renders a bullet's inline runs — plain strings pass through, objects become internal links. */
function Bullet({ bullet }: { bullet: LegalBullet }) {
  if (typeof bullet === 'string') return <>{bullet}</>
  return (
    <>
      {bullet.map((run, i) =>
        typeof run === 'string' ? (
          <span key={i}>{run}</span>
        ) : (
          <Link
            key={i}
            to={run.to}
            className="underline transition-colors hover:text-brand-teal"
          >
            {run.text}
          </Link>
        ),
      )}
    </>
  )
}

/**
 * Shared shell for the standalone legal pages (`/privacy-policy`, `/terms-conditions`) — a
 * compact branded header followed by a plain, readable text document. Each page owns its own
 * <Seo> and copy; this only handles layout/typography so the two stay visually identical.
 */
export default function LegalDocument({
  title,
  lastUpdated,
  intro,
  blocks,
}: {
  title: string
  lastUpdated: string
  intro: string
  blocks: LegalBlock[]
}) {
  return (
    <>
      {/* Compact header (§9A) */}
      <section className="relative z-10" style={{ backgroundColor: HEADER_BG }}>
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
            <motion.nav
              variants={fadeUp}
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-white/50"
            >
              <Link to="/" className="transition-colors hover:text-brand-teal">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/80">{title}</span>
            </motion.nav>

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
            >
              {title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-white/50">
              Last updated: {lastUpdated}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Document body */}
      <section className="relative z-30" style={{ backgroundColor: BODY_BG }}>
        <RoughDivider fillColor={BODY_BG} revealColor={HEADER_BG} />

        <div className="px-6 pb-24 pt-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-relaxed text-brand-black/80 sm:text-lg">{intro}</p>

            {blocks.map((block) => (
              <div key={block.heading} className="mt-12">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-black sm:text-3xl">
                  {block.heading}
                </h2>
                {block.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-base leading-relaxed text-brand-black/80 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
                {block.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {/* Index keys: these lists are static per page and never reorder, and a
                        segmented bullet can't be used as a key the way the old strings were. */}
                    {block.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-base leading-relaxed text-brand-black/80 sm:text-lg"
                      >
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 flex-none rounded-full bg-brand-teal" />
                        <span>
                          <Bullet bullet={bullet} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact block — NAP repeated as real links so it's tappable on mobile. */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-black sm:text-3xl">
                Contact Us
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-black/80 sm:text-lg">
                If you have questions about this page, contact us at:
              </p>
              <address className="mt-4 space-y-1.5 text-base not-italic leading-relaxed text-brand-black/80 sm:text-lg">
                <p className="font-semibold text-brand-black">{BUSINESS.legalName}</p>
                <p>{BUSINESS.address}</p>
                <p>
                  <a href={BUSINESS.phoneHref} onClick={trackClickToCall} className="transition-colors hover:text-brand-teal">
                    {BUSINESS.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    onClick={trackClickToEmail}
                    className="break-all transition-colors hover:text-brand-teal"
                  >
                    {BUSINESS.email}
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
