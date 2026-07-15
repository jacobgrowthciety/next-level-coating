import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'

/** Sitemap (reference/BRIEF.md §6A + §8). Slugs cleaned up per the brief's rename recommendations. */
const SERVICES = [
  { label: 'Garage Flooring', to: '/garage-flooring' },
  { label: 'Commercial', to: '/commercial' },
  { label: 'Residential', to: '/residential' },
  { label: 'Patios, Sidewalks & Driveways', to: '/patios' },
  { label: 'Pool Decks', to: '/pool-decks' },
  { label: 'Polished Concrete', to: '/polished-concrete' },
  { label: 'Concrete Coatings', to: '/concrete-coatings' },
]

const PRIMARY_LINKS = [
  { label: 'Flake Color Chart', to: '/flake-color-chart' },
  { label: 'Solid Color Chart', to: '/solid-color-chart' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const PHONE_HREF = 'tel:+16232241097'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const location = useLocation()

  // Close any open nav menu on every route change (reference/BRIEF.md §6A) — don't leave a
  // stale open dropdown or mobile menu after navigating.
  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }, [location.pathname])

  const navLinkClass =
    'text-sm font-medium text-white/85 transition-colors hover:text-brand-teal'

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Dark gradient scrim behind the bar so any overlap with the hero reads as intentional. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      />
      <div className="relative bg-black/25 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo → Home — fills most of the bar height without making it taller. */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="Next Level Coatings — Home">
          <img src="/logo.png" alt="Next Level Coatings" className="h-14 w-auto sm:h-16" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>

          {/* Services dropdown — controlled (not pure CSS :hover) so it can be force-closed on navigation. */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`${navLinkClass} inline-flex items-center gap-1`}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              onFocus={() => setServicesOpen(true)}
            >
              Services
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.2 7.5 10 12l4.8-4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div
              className={`absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 transition-all duration-150 ${
                servicesOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              <div className="rounded-xl border border-white/10 bg-black/90 p-2 shadow-xl backdrop-blur-md">
                {SERVICES.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={() => setServicesOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-brand-teal"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {PRIMARY_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Call Now (always visible) + mobile hamburger */}
        <div className="flex items-center gap-2">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-teal/80"
          >
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      </div>

      {/* Mobile menu panel — portaled to document.body so it isn't trapped inside the header's own
          z-40 stacking context (same fix as the GarageFlooringGallery lightbox): page sections use
          z-index up to z-[60] locally, which would otherwise rank above the header regardless of
          any z-index given to a element nested inside it. Fixed, full-viewport, with its own
          scroll (never trap content with no way to reach it). */}
      {mobileOpen &&
        createPortal(
          <div
            className="fixed inset-x-0 top-20 bottom-0 z-[100] overflow-y-auto overscroll-contain border-t border-white/10 bg-black/95 backdrop-blur-md lg:hidden"
            style={{ maxHeight: 'calc(100dvh - 5rem)' }}
          >
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10">
              Home
            </Link>

            {/* Services accordion — collapsed by default so the 8 service links don't force the
                whole menu past the viewport height (was cutting off Primary links with no way to
                scroll to them). */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                aria-expanded={mobileServicesOpen}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-gray hover:bg-white/10"
              >
                Services
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M5.2 7.5 10 12l4.8-4.5" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <div className="space-y-1 pb-1">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 pl-5 text-sm text-white/85 hover:bg-white/10"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="my-2 h-px bg-white/10" />
            {PRIMARY_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          </div>,
          document.body,
        )}
    </header>
  )
}
