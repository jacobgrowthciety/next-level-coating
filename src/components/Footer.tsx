import { Link } from 'react-router-dom'
import { trackClickToCall, trackClickToEmail } from '../lib/analytics'

/** Sitemap (reference/BRIEF.md §6A + §8) — same lists as Header, kept local per this codebase's
 * per-component convention (ServicesGrid also keeps its own copy rather than sharing one). */
const SERVICES = [
  { label: 'Garage Flooring', to: '/garage-flooring' },
  { label: 'Commercial', to: '/commercial' },
  { label: 'Residential', to: '/residential' },
  { label: 'Patios, Sidewalks & Driveways', to: '/patios' },
  { label: 'Pool Decks', to: '/pool-decks' },
  { label: 'Polished Concrete', to: '/polished-concrete' },
  { label: 'Concrete Coatings', to: '/concrete-coatings' },
]

const COMPANY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
  { label: 'Flake Color Chart', to: '/flake-color-chart' },
  { label: 'Solid Color Chart', to: '/solid-color-chart' },
]

const PHONE_HREF = 'tel:+16232241097'
const PHONE_DISPLAY = '(623) 224-1097'
const EMAIL = 'nextlevelcoatingsaz@gmail.com'
const INSTAGRAM_HANDLE = 'nextlevelcoatings_' // per reference/BRIEF.md §7

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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Site footer (reference/BRIEF.md §7, §8) — persistent across every page, like Header. */
export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#000000' }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + service area + license */}
          <div>
            <Link to="/" aria-label="Next Level Coatings — Home">
              <img src="/logo.png" alt="Next Level Coatings" className="h-16 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Servicing all of Arizona.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
              ROC License #352138
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-teal">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href={PHONE_HREF} onClick={trackClickToCall} className="inline-flex items-center gap-2 transition-colors hover:text-brand-teal">
                  <PhoneIcon className="h-4 w-4 flex-none" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} onClick={trackClickToEmail} className="inline-flex items-center gap-2 break-all transition-colors hover:text-brand-teal">
                  <MailIcon className="h-4 w-4 flex-none" />
                  {EMAIL}
                </a>
              </li>
            </ul>
            {/* Instagram only. A Facebook icon used to sit here pointing at href="#" — a dead
                placeholder, since no page URL was ever confirmed. Removed rather than left
                broken: A2P/brand review treats non-functional links as a legitimacy signal.
                Restore it (with the real URL) if the owners provide a page. */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next Level Coatings on Instagram"
                className="text-white/60 transition-colors hover:text-brand-teal"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-teal">
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-white/70 transition-colors hover:text-brand-teal">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand-teal">
              Company
            </p>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-brand-teal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Next Level Coatings LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-white/40 transition-colors hover:text-brand-teal">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-xs text-white/40 transition-colors hover:text-brand-teal">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
