import { useEffect, useState } from 'react'
import { trackClickToCall } from '../lib/analytics'

/**
 * Persistent mobile "Call Now" bar — always visible on touch/small screens (BRIEF.md §5, §6),
 * but held off-screen until the visitor has scrolled substantially past the hero. Showing it
 * immediately at the top of the page would sit on top of (or duplicate) the hero's own
 * full-width phone CTA.
 *
 * On pages with a hero (currently just Home), visibility is driven by an IntersectionObserver.
 * What it observes is the hero's own CTA pair (`[data-hero-cta]`, set in sections/Hero.tsx), not
 * the hero section itself: the bar needs to arrive the moment those CTAs scroll away, and the
 * mobile hero runs ~1000px tall, so keying off the whole section left a long stretch where the
 * hero's CTAs were gone but the bar hadn't come in yet — the page had no visible call to action
 * at all through it. Observing the CTAs still guarantees the two can never be on screen together,
 * which was the original reason for the gate.
 *
 * Falls back to `#hero` if the CTA marker is ever missing, then to a scroll-position heuristic on
 * pages with no hero at all.
 */
export default function CallNowButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const anchor = document.querySelector('[data-hero-cta]') ?? document.getElementById('hero')

    if (!anchor) {
      function onScroll() {
        setVisible(window.scrollY > window.innerHeight * 0.6)
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href="tel:+16232241097"
      onClick={trackClickToCall}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed inset-x-0 bottom-0 z-50 box-border flex items-center justify-center gap-2 bg-brand-teal px-4 text-center text-sm font-semibold text-brand-black shadow-lg transition-transform duration-300 motion-reduce:transition-none md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      /* The tappable row is a fixed 3rem — never derived from viewport units, so browser
         chrome collapsing on scroll can't restretch it. The safe-area inset is added *outside*
         that row (height includes it, padding-bottom reserves it) rather than on top of a
         content-driven height, which is what used to make the bar jump: iOS Safari reports
         safe-area-inset-bottom as 0 while the bottom toolbar is expanded and ~34px once it
         collapses. Now that inset only ever backfills teal behind the home indicator; the
         row holding the icon and number stays exactly 3rem in both states.

         3rem (48px) is the floor for this row, not a value to keep tuning down: it matches the
         48px minimum touch target and still clears Apple's 44pt guideline, and because the whole
         bar is the tap area there is no padding to trade away. Slimming further would start
         costing accuracy on a control whose entire job is being easy to hit one-handed. */
      style={{
        height: 'calc(3rem + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
      </svg>
      Call Now · (623) 224-1097
    </a>
  )
}
