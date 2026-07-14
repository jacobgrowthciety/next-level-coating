import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'

// Compact page header (reference/BRIEF.md §9A pattern) — same treatment as Garage Flooring's
// and Flake Color Chart's intro.
const INTRO_BG = '#000000'

const PHONE_HREF = 'tel:+16232241097'
const PHONE_DISPLAY = '(623) 224-1097'
const EMAIL = 'nextlevelcoatingsaz@gmail.com'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="m3.5 6 8.5 6.5L20.5 6" />
    </svg>
  )
}

/** Contact page header (reference/BRIEF.md §8 `/contact`, §9A pattern). */
export default function ContactIntro() {
  return (
    <section className="relative z-10" style={{ backgroundColor: INTRO_BG }}>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:pb-12 sm:pt-32">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
            <Link to="/" className="transition-colors hover:text-brand-teal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">Contact</span>
          </motion.nav>

          <motion.p variants={fadeUp} className="mt-5 font-script text-xl text-brand-teal sm:text-2xl">
            Get In Touch
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-2 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
          >
            Contact Us
          </motion.h1>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 text-base text-white/85 transition-colors hover:text-brand-teal sm:text-lg"
            >
              <PhoneIcon className="h-4 w-4 flex-none text-brand-teal" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 break-all text-base text-white/85 transition-colors hover:text-brand-teal sm:text-lg"
            >
              <MailIcon className="h-4 w-4 flex-none text-brand-teal" />
              {EMAIL}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
