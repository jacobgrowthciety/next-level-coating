import { motion } from 'framer-motion'
import type { PortableTextBlock } from '@portabletext/react'
import { fadeUp } from '../animations/variants'
import SanityProse from './SanityProse'

/**
 * The two building blocks every service page's main body is assembled from: an editable H2, and
 * an editable run of paragraphs, both styled to the light body section (`#f4f3ef`, dark text).
 *
 * They are separate components rather than one "section" component because the page's structural
 * pieces sit *between* them — a heading introduces the benefit cards, and the copy belonging to
 * that same section follows them. Rendering heading and body as one unit would leave the cards
 * nowhere to go.
 *
 * Both render nothing when their content is blank. That matters more than it looks: the sections
 * carry `mt-12`, so an empty one that still rendered would leave a visible gap in the middle of
 * the page. The upstream merge (src/lib/pageContent.ts) already substitutes shipped copy for a
 * blank section, so reaching these empty means the page genuinely has nothing for that slot.
 */

const HEADING_CLASS = 'mt-12 font-script text-3xl text-brand-teal sm:text-4xl'
const BODY_CLASS = 'text-lg leading-relaxed text-brand-black/80 sm:text-xl'

export function PageSectionHeading({ children }: { children?: string }) {
  if (!children?.trim()) return null
  return (
    <motion.h2 variants={fadeUp} className={HEADING_CLASS}>
      {children}
    </motion.h2>
  )
}

export function PageSectionBody({
  blocks,
  className = '',
}: {
  blocks: PortableTextBlock[]
  /** Leading space for this slot — e.g. `mt-12` when it follows a structural block. */
  className?: string
}) {
  if (!blocks?.length) return null
  return (
    <motion.div variants={fadeUp} className={className}>
      <SanityProse blocks={blocks} className={BODY_CLASS} gapClassName="mt-6" />
    </motion.div>
  )
}
