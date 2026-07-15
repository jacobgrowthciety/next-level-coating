import { useEffect, useState } from 'react'

/**
 * Persistent mobile "Call Now" bar — always visible on touch/small screens (BRIEF.md §5, §6),
 * but held off-screen until the visitor has scrolled substantially past the hero. Showing it
 * immediately at the top of the page would sit on top of (or duplicate) the hero's own
 * full-width phone CTA.
 *
 * On pages with a hero (`#hero`, currently just Home), visibility is driven by an
 * IntersectionObserver on that element — the bar appears once the hero has fully scrolled out of
 * view, so it can never overlap the hero's quote/phone CTAs. Pages without a hero fall back to a
 * simple scroll-position heuristic.
 */
export default function CallNowButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')

    if (!hero) {
      function onScroll() {
        setVisible(window.scrollY > window.innerHeight * 0.6)
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href="tel:+16232241097"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-brand-teal px-4 py-3.5 text-center text-base font-semibold text-brand-black shadow-lg transition-transform duration-300 motion-reduce:transition-none md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))' }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
      </svg>
      Call Now · (623) 224-1097
    </a>
  )
}
