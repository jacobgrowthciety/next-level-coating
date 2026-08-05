import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider, { COMPACT_DIVIDER_HEIGHT } from '../components/RoughDivider'
import ReelOrbit, { type ReelItem } from '../components/ReelOrbit'

/**
 * Charcoal, not the off-white this section used to be. It is the first block after the hero, and
 * the homepage's colour rhythm now holds one continuous dark run from the hero through Services
 * (reference/BRIEF.md §2A) rather than alternating light/dark on every section — so proof of work
 * reads as part of the same premium opening rather than a bright interruption. Same charcoal the
 * Process section used before it moved to black, so no new colour enters the palette.
 */
const SECTION_BG = '#121212'

const INSTAGRAM_PROFILE = 'https://instagram.com/nextlevelcoatings_' // per reference/BRIEF.md §7

/**
 * Self-hosted from public/reels/ rather than embedded from Instagram — no third-party script,
 * nothing for an ad blocker to break, and no CDN round-trip. Re-encoded to 720x1280 (the card
 * renders at 360px, so this is 2x for retina); only the active clip is ever fetched.
 *
 * All three are verified Next Level Coatings posts. Instagram's `/reel/<id>/` URL opens a
 * scrolling feed player that auto-advances, so anything captured from it can silently end up
 * being a different account's clip — use the profile-scoped `/nextlevelcoatings_/reel/<id>/`
 * form and confirm the author before and after capture if these are ever refreshed.
 */
const REELS: ReelItem[] = [
  {
    src: '/reels/reel-1.mp4',
    poster: '/reels/reel-1.jpg',
    label: 'A large custom garage floor install — 80 gallons of polyaspartic and 700lbs of flake',
  },
  {
    src: '/reels/reel-2.mp4',
    poster: '/reels/reel-2.jpg',
    label: 'True polished concrete, mechanically refined to a finished sheen',
  },
  {
    src: '/reels/reel-3.mp4',
    poster: '/reels/reel-3.jpg',
    label: 'The Next Level Coatings crew completing a residential install',
  },
]

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm6.4-2.6a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0Z" />
    </svg>
  )
}

/**
 * "Featured Projects" — real completed work, immediately after the hero, so the first thing a
 * visitor gets after the pitch is evidence rather than more claims. Replaces the former trust
 * badge row wholesale; those claims still appear where they carry more weight (1-day installs
 * and 5-star rated in the hero trust row, 4X-stronger in Services, lifetime warranty in the
 * final CTA), so nothing is lost by dropping the icon grid.
 *
 * The carousel itself is untouched — same component, same swipe, autoplay, sizing, animation and
 * responsive behaviour. Only the section around it changed.
 */
export default function FeaturedProjects() {
  return (
    <section className="relative z-10">
      {/* Hero → Featured Projects: the frayed charcoal shape reveals the dark, stickied hero
          video through its torn gaps (no revealColor = transparent overlap). Dark-on-dark now,
          so this boundary reads as a texture change rather than a hard colour flip. */}
      <RoughDivider fillColor={SECTION_BG} className={COMPACT_DIVIDER_HEIGHT} />

      {/* seam-guard rather than a background on the <section>: this section must stay
          transparent so the divider's torn gaps keep revealing the stickied hero, which leaves
          this body div as the only thing painting the section's bottom edge. */}
      <div className="seam-guard pb-24 pt-4" style={{ backgroundColor: SECTION_BG }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="mx-auto max-w-2xl px-6 text-center">
            <motion.p
              variants={fadeUp}
              className="font-display text-xs uppercase tracking-[0.35em] text-white/50"
            >
              Recent Projects
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-script text-4xl text-brand-teal sm:text-5xl"
            >
              See Our Work in Motion
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg"
            >
              A selection of residential and commercial flooring projects completed across Arizona.
            </motion.p>
          </div>

          {/* Deliberately no px-6 here: the carousel clips its own fanned-out cards, and the
              wider that clip box is relative to the card, the further its edge sits from the
              card's drop shadow. Padding the stage pulled the clip in tight around the card and
              sheared the shadow into a visible rectangle. */}
          <motion.div variants={fadeUp} className="mt-10">
            <ReelOrbit items={REELS} tone="dark" className="mx-auto max-w-4xl" />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 px-6 text-center">
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/50 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-brand-teal hover:decoration-brand-teal"
            >
              <InstagramGlyph className="h-4 w-4" />
              See more on Instagram
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
