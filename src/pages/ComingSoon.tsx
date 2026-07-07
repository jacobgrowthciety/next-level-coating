import { Link } from 'react-router-dom'
import CallNowButton from '../components/CallNowButton'

const PHONE_HREF = 'tel:+16232241097'

/** Shared placeholder for any sitemap route not yet built (reference/BRIEF.md §6B). */
export default function ComingSoon() {
  return (
    <main>
      <section
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center"
        style={{ backgroundColor: '#000000' }}
      >
        <p className="font-script text-4xl text-brand-teal sm:text-5xl">Coming Soon</p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
          This page is under construction. Check back soon, or reach out and we'll help you
          right away.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-brand-teal hover:text-brand-teal"
          >
            Back to Home
          </Link>
          <a
            href={PHONE_HREF}
            className="rounded-full bg-brand-teal px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-brand-black transition-colors hover:bg-brand-teal/80"
          >
            Call Now
          </a>
        </div>
      </section>
      <CallNowButton />
    </main>
  )
}
