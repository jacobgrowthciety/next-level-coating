import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { trackClickToCall } from '../lib/analytics'

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

/**
 * NAVBAR RESPONSIVE SYSTEM — one place, three states.
 *
 * 1. Full desktop (>= 1280px): every value below sits at its ceiling, which is the approved
 *    large-desktop rendering — 12px links, 32px gaps, a 137px logo, a 14px/16px-padded CTA.
 *    The ceiling starts at 1280 rather than at some larger width because the bar is capped at
 *    `max-w-7xl` (1280px): above that the container stops growing, so the room available to the
 *    bar is the same at 1440, 1600 and 1920 as it is at 1280, and so is what fits in it. Scaling
 *    across that range would only shrink type nothing was competing for — which is exactly what a
 *    first pass at this did, tightening the links to 19px at 1440 while the space around the group
 *    ballooned to 150px.
 * 2. Condensed desktop (1180-1280px): the only band where the container actually narrows, so it is
 *    the only band that ramps. Each value interpolates linearly between its floor at 1180 and its
 *    ceiling at 1280, written as `clamp(floor, calc(<slope>vw + <intercept>), ceiling)` — all of
 *    them solving the same two endpoints, so the bar tightens evenly instead of one part
 *    collapsing ahead of the others.
 * 3. Mobile / hamburger (< 1180px): the link group is display:none and the existing hamburger
 *    takes over, untouched. Everything below the breakpoint keeps its original unprefixed classes,
 *    so the mobile bar renders exactly as it did.
 *
 * WHY THE LABELS WRAPPED: nothing here set `white-space: nowrap`, and a flex item's automatic
 * minimum size lets a text item shrink to its longest *word*. So once the row ran out of room the
 * browser resolved it by breaking "Flake Color Chart" and "Solid Color Chart" over two lines and
 * stacking "Call Now" onto three — the row never overflowed, it just folded. `shrink-0` +
 * `whitespace-nowrap` on every item removes that escape hatch, `flex-nowrap` keeps the group a
 * single row, and the breakpoint below is set where the row still has room to spare.
 *
 * This scale is deliberately NOT wired to the hero's `--hero-u`: the bar has its own content and
 * its own crowding point, and tying the two would mean neither could be tuned without disturbing
 * the other.
 */

/**
 * Bar shell. Height is a hard 80px at every width — see the note on the header element.
 *
 * The 640px step is written `min-[640px]:` rather than `sm:` on purpose. Tailwind sorts arbitrary
 * min-width variants into their own bucket AHEAD of the named breakpoints, so a `sm:` utility wins
 * over a `min-[1180px]:` one setting the same property — silently, and only above 1180px. Keeping
 * both steps in the same (arbitrary) bucket makes them sort by value, which is what the cascade
 * here depends on. Same reason on NAV_LOGO below, where the stakes are higher: `sm:h-[68px]`
 * beating `min-[1180px]:h-auto` would have pinned the height while the width scaled, i.e. squashed
 * the logo at every width under 1920.
 */
const NAV_BAR =
  'mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 min-[640px]:px-6 min-[1180px]:px-[clamp(44px,calc(2.7vw_+_12px),64px)]'

/**
 * Logo: 105px -> 137px wide with `height:auto`, so it scales without distorting. Width-driven
 * (not height-driven) because width is what competes with the links for room. Below the desktop
 * breakpoint it keeps its original fixed heights untouched.
 */
const NAV_LOGO =
  'h-[60px] w-auto min-[640px]:h-[68px] min-[1180px]:h-auto min-[1180px]:w-[clamp(105px,calc(32vw_-_272.6px),137px)]'

/** Link group: one non-wrapping row, gaps 20px -> 32px. */
const NAV_LINK_GROUP =
  'hidden min-w-0 flex-nowrap items-center gap-[clamp(20px,calc(12vw_-_121.6px),32px)] min-[1180px]:flex'

/**
 * Link: 11px -> 12px. font-display (Microgramma D Extended) per the brand hierarchy — nav sits
 * with the headings, not with body copy, and font-medium resolves to the 500 (Medium Extended)
 * cut; the 700 Bold cut is reserved for H1/H2. Microgramma is an *extended* face and runs much
 * wider than the body font at the same size, which is why the ceiling is 12px and the tracking
 * is tight. `leading-none` pins the line box to the glyph height so nothing here can ever add to
 * the bar's height.
 */
const NAV_LINK =
  'shrink-0 whitespace-nowrap font-display text-[length:clamp(11px,calc(1vw_-_0.8px),12px)] font-medium uppercase leading-none tracking-tight text-white/85 transition-colors hover:text-brand-teal'

/** Dropdown chevron, sized in `em` so it tracks the link's own type size and stays aligned to it. */
const NAV_CHEVRON = 'h-[1.33em] w-[1.33em] flex-none'

/**
 * Call Now: a single-line pill at every width. Font 13px -> 14px, padding-inline 14px -> 16px,
 * icon 1.15em (= the 16px it was drawn at when the label is at its 14px ceiling). `min-h-[42px]`
 * is a desktop-only floor for the click target; below the breakpoint the pill keeps its original
 * 36px box and its `::after` touch overlay, which is what mobile is tuned around.
 */
const NAV_CTA =
  'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-brand-black transition-colors after:absolute after:left-0 after:top-1/2 after:h-11 after:w-full after:-translate-y-1/2 after:content-[""] hover:bg-brand-teal/80 min-[1180px]:min-h-[42px] min-[1180px]:gap-[0.45em] min-[1180px]:px-[clamp(14px,calc(2vw_-_9.6px),16px)] min-[1180px]:py-0 min-[1180px]:text-[length:clamp(13px,calc(1vw_+_1.2px),14px)] min-[1180px]:leading-none'

const NAV_CTA_ICON = 'h-4 w-4 flex-none min-[1180px]:h-[1.15em] min-[1180px]:w-[1.15em]'

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

  // The bar's 80px height (h-20 on NAV_BAR) is deliberately NOT part of the fluid scale: the
  // hero's media inset and top padding, and the mobile panel's own offset, are all keyed to
  // exactly 80px, so a fluid bar height would move the hero. Everything inside the bar is
  // vertically centered and pinned to `leading-none`, so no amount of text can change it.
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Dark gradient scrim behind the bar so any overlap with the hero reads as intentional. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      />
      <div className="relative bg-black/25 backdrop-blur-md">
      <div className={NAV_BAR}>
        {/* Logo → Home — fills most of the bar height without making it taller. */}
        <Link to="/" className="flex shrink-0 items-center" aria-label="Next Level Coatings — Home">
          <img src="/logo.png" alt="Next Level Coatings" className={NAV_LOGO} />
        </Link>

        {/* Desktop nav */}
        <nav className={NAV_LINK_GROUP}>
          <Link to="/" className={NAV_LINK}>
            Home
          </Link>

          {/* Services dropdown — controlled (not pure CSS :hover) so it can be force-closed on navigation. */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`${NAV_LINK} inline-flex items-center gap-[0.33em]`}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              onFocus={() => setServicesOpen(true)}
            >
              Services
              <svg aria-hidden="true" viewBox="0 0 20 20" className={NAV_CHEVRON} fill="currentColor">
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
            <Link key={l.to} to={l.to} className={NAV_LINK}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Call Now (always visible) + mobile hamburger */}
        <div className="flex items-center gap-2">
          {/* The painted pill stays 32px tall — its original proportions. Below the `sm`
              breakpoint the label is hidden and it collapses to an icon-only pill measuring
              48x32, which is under the 44px touch-target baseline on the one control that is a
              mobile visitor's *only* way to contact the business on the first screen.

              The target is fixed with an `::after` overlay rather than min-h/min-w on the box
              itself: growing the box to 44 made the icon-only state read as a near-square blob
              instead of a pill. The pseudo-element is invisible, takes part in hit-testing on
              the anchor's behalf, and is out of flow, so it buys the 6px above and below
              without touching layout or the shape. Full width so the target is never narrower
              than the pill it sits on. */}
          <a href={PHONE_HREF} onClick={trackClickToCall} className={NAV_CTA}>
            <PhoneIcon className={NAV_CTA_ICON} />
            <span className="hidden sm:inline">Call Now</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            /* h-11/w-11 = 44px, the touch-target baseline; was h-10 (40px). */
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white min-[1180px]:hidden"
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
            className="fixed inset-x-0 top-20 bottom-0 z-[100] overflow-y-auto overscroll-contain border-t border-white/10 bg-black/95 backdrop-blur-md min-[1180px]:hidden"
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
