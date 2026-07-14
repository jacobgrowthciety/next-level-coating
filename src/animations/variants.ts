import type { Variants } from 'framer-motion'

/** Shared motion variants — scroll-triggered staged reveals (see reference/BRIEF.md §4). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

/**
 * Hero reveal — slow easeOut fade + subtle upward translate, used when the hero video ends.
 * Each element reads its own delay via `custom` for a deliberate top-to-bottom cascade.
 */
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

/** Like heroReveal, plus a gentle scale-in so the form panel settles into place. */
export const heroFormReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

/** Headline: container orchestrates a word-by-word rise (reads more premium than one block). */
export const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.14, staggerChildren: 0.06 } },
}

export const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

/** Group wrapper that just propagates the show/hidden label to hero reveal children. */
export const heroRevealGroup: Variants = {
  hidden: {},
  show: {},
}

/** Fade + scale-in, same duration/easing as fadeUp — for grid items (e.g. color swatches)
 * where a slight scale reads better than a vertical slide. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}
