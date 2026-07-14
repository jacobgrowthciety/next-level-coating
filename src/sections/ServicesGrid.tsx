import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Dark section in the alternating color rhythm (reference/BRIEF.md §2A). About preview above
// is light, so Services returns to dark. Near-black rather than Process's #121212 so the two
// dark sections on the page don't read as one identical flat surface (§2A shade variance).
const SECTION_BG = '#0a0a0a'
// Off-white body of About preview above — shown through the torn gaps of this section's top
// edge for the light → dark transition (must match AboutPreview SECTION_BG).
const PREV_SECTION_BG = '#faf9f5'

const FLAGSHIP_SLUG = '/garage-flooring'

/**
 * One card per real service page (reference/BRIEF.md §5B, §8). `num` is a fixed identity
 * label (not a grid-position index) — each service keeps its own number regardless of
 * whether it's currently in the detail slot or the compact grid. Slugs use the rebuild's
 * clean internal routes (matching AboutPreview's `/about` convention), i.e. the recommended
 * §8 renames for the two Wix auto-duplicate slugs (polished-concrete, not copy-of-grind-seal).
 *
 * Descriptions are verbatim from §5B. Grind & Seal and Polished Concrete only have
 * placeholder copy there (real copy not yet sourced from the live site — see §11); flagged
 * below for whoever swaps in the real content later.
 */
const SERVICES: { num: string; name: string; to: string; description: string }[] = [
  {
    num: '01',
    name: 'Garage Flooring',
    to: FLAGSHIP_SLUG,
    description:
      'Our specialty — 1-day polyaspartic systems, prepped, chipped, and clear coated in a single day.',
  },
  {
    num: '02',
    name: 'Commercial',
    to: '/commercial',
    description:
      'Durable, slip-resistant coatings built for warehouses, showrooms, and commercial kitchens — installed fast to minimize downtime.',
  },
  {
    num: '03',
    name: 'Residential',
    to: '/residential',
    description:
      '4X stronger than epoxy, UV-stable, and low maintenance — a lasting upgrade for garages, patios, and pool decks.',
  },
  {
    num: '04',
    name: 'Patios, Sidewalks & Driveways',
    to: '/patios',
    description:
      '100% UV-stable and 4X stronger than epoxy, with extra chip texture for slip resistance outdoors.',
  },
  {
    num: '05',
    name: 'Pool Decks',
    to: '/pool-decks',
    description:
      'Non-slip and UV-stable — and it drastically drops surface temperature, so bare feet stay comfortable even in Arizona summers.',
  },
  {
    num: '06',
    name: 'Paver Sealing',
    to: '/paver-sealing',
    description:
      'Commercial-grade acrylic urethane sealer, backed by a 4-year warranty even under the Arizona sun.',
  },
  {
    num: '07',
    name: 'Grind & Seal',
    to: '/grind-seal',
    // PLACEHOLDER — real copy not yet sourced from the live site (BRIEF.md §5B, §11).
    description: 'A refined grind-and-seal finish for a clean, low-maintenance concrete surface.',
  },
  {
    num: '08',
    name: 'Polished Concrete',
    to: '/polished-concrete',
    // PLACEHOLDER — real copy not yet sourced from the live site (BRIEF.md §5B, §11).
    description: 'A polished concrete finish bringing a smooth, high-shine surface to any space.',
  },
  {
    num: '09',
    name: 'Concrete Coatings',
    to: '/concrete-coatings',
    description:
      'Premium resurfacing for garages, warehouses, offices, and patios — tailored coating systems built to last.',
  },
]

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]'

const Arrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * Services grid (reference/BRIEF.md §5B) — an interactive grid where one service is always
 * shown in an expanded "detail" form (number, name, one-line description, Explore link), and
 * the rest sit as compact cards (number, name, arrow).
 *
 * Desktop/tablet (sm+): clicking a compact card swaps it into a fixed top-left detail slot
 * while the previously-selected service returns to compact form — a shared-layout animation
 * (`layout` + `layoutId`) rather than a jarring content swap. Defaults to Garage Flooring (the
 * flagship service, per its own page notes in §9).
 *
 * Mobile (single-column list): the grid is reordered so this doesn't apply the same way — a
 * swap-to-top-slot would move the expanded card off-screen above whichever compact card the
 * viewer just tapped further down the list, forcing them to scroll back up to see it. Instead
 * the tapped card expands in place, right where it is in the list, and the list order never
 * changes.
 *
 * Each card is a real `<Link>` whose `href` always points at its own page — the compact/detail
 * distinction is only a visual preview state, never a change of destination. Clicking a
 * compact card intercepts the click to swap the selection (unless a modifier key requests a
 * new tab/window, which is left to the browser); the current detail card has no interception,
 * so clicking or pressing Enter on it navigates for real. Because the same anchor persists
 * across the reorder (matched by key), keyboard focus survives the swap — Tab to a service,
 * Enter to preview it, Enter again to open it.
 */
export default function ServicesGrid() {
  const [selected, setSelected] = useState(FLAGSHIP_SLUG)

  // Below `sm` (640px) the grid is a single column, where BRIEF.md's swap-to-top-slot pattern
  // reads as the page jumping the expanded card away from what the viewer just tapped — see the
  // docstring above. This only changes list order/positioning, not the compact/detail styling.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639.98px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639.98px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const ordered = isMobile
    ? SERVICES
    : [SERVICES.find((s) => s.to === selected)!, ...SERVICES.filter((s) => s.to !== selected)]

  const selectService = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    setSelected(to)
  }

  return (
    <section className="relative z-40" style={{ backgroundColor: SECTION_BG }}>
      {/* About → Services (light → dark): near-black torn shape over the off-white About
          section above (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-28 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              variants={fadeUp}
              className="font-display text-xs uppercase tracking-[0.35em] text-white/50"
            >
              What we do
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 font-script text-4xl text-brand-teal sm:text-5xl lg:text-6xl"
            >
              Our Services
            </motion.h2>

            {/* Trimmed polyaspartic educational copy (§9) as the intro, replacing the
                original site's closing bullet list. */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg"
            >
              Polyaspartic floor coating is a resin used for protecting and enhancing
              concrete surfaces. Derived from polyurea, it cures quickly and offers
              exceptional durability. Unlike traditional epoxy or polyurethane, its unique
              chemical structure delivers superior performance — no matter the application.
            </motion.p>
          </div>

          {/* Desktop/tablet: the detail slot is always the first item in `ordered`, so it always
              lands in the grid's first (top-left) cell regardless of which service currently
              occupies it, with the rest auto-flowing around it in their fixed order. Mobile:
              `ordered` is just `SERVICES` unchanged, so the selected card expands in place. */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((service) => {
              const isDetail = service.to === selected
              const isFlagship = service.to === FLAGSHIP_SLUG

              return (
                <motion.div
                  key={service.to}
                  layout
                  layoutId={`service-card-${service.to}`}
                  variants={fadeUp}
                  transition={{ layout: { type: 'spring', stiffness: 260, damping: 28 } }}
                  className={isDetail ? 'sm:col-span-2 lg:row-span-2' : ''}
                >
                  <Link
                    to={service.to}
                    aria-current={isDetail ? 'true' : undefined}
                    onClick={isDetail ? undefined : (e) => selectService(e, service.to)}
                    className={`group relative flex h-full rounded-sm border-l-[3px] transition-colors duration-300 ${FOCUS_RING} ${
                      isDetail
                        ? 'flex-col justify-between border-brand-teal bg-white/[0.05] p-8 hover:bg-brand-teal/[0.08] lg:min-h-[20rem]'
                        : 'items-center gap-5 border-brand-teal/50 bg-white/[0.03] py-6 pl-6 pr-5 hover:-translate-y-1 hover:border-brand-teal hover:bg-brand-teal/[0.07]'
                    }`}
                  >
                    {isDetail ? (
                      <>
                        <div className="flex items-start justify-between">
                          <span className="font-display text-6xl tabular-nums text-brand-teal transition-colors duration-300 lg:text-7xl">
                            {service.num}
                          </span>
                          {isFlagship && (
                            <span className="mt-2 font-display text-[0.65rem] uppercase tracking-[0.3em] text-brand-teal/70">
                              Flagship service
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-4xl">
                            {service.name}
                          </h3>
                          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                            {service.description}
                          </p>
                          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors duration-300 group-hover:text-brand-teal">
                            Explore
                            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-display text-3xl tabular-nums text-brand-teal/60 transition-colors duration-300 group-hover:text-brand-teal">
                          {service.num}
                        </span>
                        <span className="min-w-0 flex-1 font-display text-lg uppercase leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-brand-teal">
                          {service.name}
                        </span>
                        <Arrow className="h-5 w-5 flex-none text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-teal" />
                      </>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
