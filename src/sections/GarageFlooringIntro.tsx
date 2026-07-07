import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'

// Page-level hero — dark, image-forward, but not the full autoplay video treatment used on
// Home (reference/BRIEF.md §9 note: "doesn't need the full video treatment, but should feel
// premium and on-brand"). Reuses the hero video's settled last frame (Chase broadcasting flake
// mid-install) since it's real footage of exactly this service, rather than sourcing a new asset.
// Bottom of the overlay resolves to solid black so RoughDivider's revealColor can match exactly.
const INTRO_BG = '#000000'
export { INTRO_BG }

const PHONE_HREF = 'tel:+16232241097'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}

/** Garage Flooring page hero (reference/BRIEF.md §8 `/garage-flooring`, §9). */
export default function GarageFlooringIntro() {
  return (
    <section className="relative z-10 overflow-hidden" style={{ backgroundColor: INTRO_BG }}>
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[62%_22%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/45" />
        {/* Resolves to solid black at the very bottom edge — must match INTRO_BG so the next
            section's RoughDivider revealColor reads as a seamless continuation. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-36 sm:pb-24 sm:pt-40 lg:flex lg:min-h-[80vh] lg:items-center lg:pb-28 lg:pt-44">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="font-script text-xl text-brand-teal sm:text-2xl"
          >
            Our Specialty
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:mt-3 lg:text-7xl"
          >
            Garage Flooring
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            Solid color or full broadcast flake, prepped and finished by a crew that treats
            garage floors as our specialty — not a side job.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
          >
            <a
              href="#quote"
              className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-brand-black transition-colors duration-300 hover:bg-white"
            >
              Get My Free Quote
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full border border-brand-teal/60 px-6 py-3.5 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-black"
            >
              <PhoneIcon className="h-4 w-4" />
              Call (623) 224-1097
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
