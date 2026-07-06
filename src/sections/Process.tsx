import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Dark section in the alternating color rhythm (reference/BRIEF.md §2A). Charcoal rather than
// pure black so it doesn't read identically flat against the other dark surfaces on the page.
const SECTION_BG = '#121212'
// Off-white body of Why Trust Us above — shown through the torn gaps of this section's top
// edge for the light → dark transition (must match WhyTrustUs SECTION_BG).
const PREV_SECTION_BG = '#f4f3ef'

/** "The Next Level Process" — six steps, verbatim copy (reference/BRIEF.md §9). */
const STEPS = [
  {
    n: '01',
    name: 'GRIND',
    body: 'We begin our process by diamond grinding every concrete floor, whether new or old. Using a 1000 lb machine, we ensure sufficient weight for proper grinding, supplemented by a hand grinder for edging the entire floor. Each floor undergoes diamond testing to guarantee the appropriate bond diamond. These machines are connected to three dustless vacuums to maintain cleanliness.',
  },
  {
    n: '02',
    name: 'REPAIR',
    body: 'The floor undergoes thorough vacuuming using our dustless vacuums, clearing out expansion joints and saw cuts. Following this, a dry mop loosens any remaining debris, leading to a meticulous blowing out, leaving a pristine, prepped foundation. The final step in preparation involves patching or repairing any imperfections in the concrete, such as cracks, chips, or holes, utilizing a flexible 2-part epoxy patch designed to withstand movement over time.',
  },
  {
    n: '03',
    name: 'COAT',
    body: 'We apply a self-priming, pre-pigmented 100% UV stable fast-cure polyaspartic base coat, using a squeegee and roller. This base coat is meticulously measured and rolled out in all directions to ensure uniform coverage.',
  },
  {
    n: '04',
    name: 'FLAKE',
    body: 'Next, the floor receives a hand-flaked treatment, ensuring 100% full broadcast chip coverage for comprehensive protection. Optionally, stem walls are meticulously treated beforehand, ensuring straight lines for an impeccable finish.',
  },
  {
    n: '05',
    name: 'SCRAPE',
    body: 'After the fast-cure polyaspartic base coat has fully cured, we remove all excess flake and meticulously scrape the floor in all directions to ensure a smooth finish, leaving no area untouched. Edges, joints, and stem walls undergo hand sanding to eliminate any standing flakes, ensuring a flawless surface. The floor undergoes a final dustless vacuuming to remove any remaining debris and flake before receiving its polyaspartic clear coat.',
  },
  {
    n: '06',
    name: 'SEAL',
    body: 'We then apply our 100% UV stable, slow-cure polyaspartic clear coat, meticulously measuring and applying it with a squeegee and roller in all directions to achieve a flawless spread. Optional non-slip additives can be incorporated at this stage if desired. This meticulous process results in our Next Level finish. While the exact thickness of our clear coat remains proprietary, its robust application ensures an unbeatable shine, facilitating effortless maintenance during cleaning and care of your floor.',
  },
]

// --- Rail geometry (desktop) ------------------------------------------------------------
// Dots and the connecting line are derived from these shared values so they can't drift out
// of alignment: every dot centers on the same x (RAIL_CENTER_X) and on its row's vertical
// midpoint (rows are fixed height, so the active step's larger text doesn't shift the dot),
// and the line's x/start/length are computed from that same dot geometry.
const RAIL_DOT = 12 // px — dot diameter
const RAIL_ROW = 64 // px — fixed height per step; dot sits at each row's vertical center
const RAIL_TEXT_PAD = 40 // px — left padding so the step text clears the dot column
const RAIL_CENTER_X = RAIL_DOT / 2 // px — shared x-center for every dot and the line
const RAIL_HEIGHT = STEPS.length * RAIL_ROW // px — total rail column height
// Line spans exactly from the bottom edge of the first dot to the top edge of the last dot:
//   first dot center = RAIL_ROW/2 ; last dot center = (n - 0.5) * RAIL_ROW
//   top    = firstCenter + RAIL_DOT/2   (bottom edge of first dot)
//   height = (lastCenter - RAIL_DOT/2) - top = (n - 1) * RAIL_ROW - RAIL_DOT
const RAIL_LINE_TOP = RAIL_ROW / 2 + RAIL_DOT / 2
const RAIL_LINE_HEIGHT = (STEPS.length - 1) * RAIL_ROW - RAIL_DOT
const RAIL_LINE_LEFT = RAIL_CENTER_X - 0.5 // px — centers the 1px line on RAIL_CENTER_X

/** Shared script + display heading used above both desktop and mobile step lists. */
function SectionHeading() {
  return (
    <div className="text-center">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-white/50">
        How we do it
      </p>
      <h2 className="mt-3 font-script text-4xl text-brand-teal sm:text-5xl lg:text-6xl">
        The Next Level Process
      </h2>
    </div>
  )
}

/**
 * Desktop (lg+): pinned step-cycling layout (BRIEF.md §5A). A tall scroll container
 * (6 steps × 100vh) holds a sticky 100vh inner layout. Scroll progress (0-1) maps to an
 * active step index via 6 equal segments, driving the rail highlight, the progress fill,
 * and the crossfading detail panel.
 */
function DesktopProcess({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // 6 equal segments → index 0-5 (clamp the v=1 edge back to the last step).
    const idx = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))
    setActive(idx)
  })

  const step = STEPS[active]

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-8">
          <SectionHeading />

          <div className="mt-14 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] gap-16">
            {/* Left: persistent step rail. Dots + connecting line share one coordinate system
                (see RAIL_* geometry above) so they stay perfectly aligned. */}
            <div className="relative" style={{ height: RAIL_HEIGHT }}>
              {/* Track + teal progress fill — same x-center as the dots, spanning first-dot
                  bottom edge to last-dot top edge. */}
              <div
                className="absolute w-px bg-white/10"
                style={{ left: RAIL_LINE_LEFT, top: RAIL_LINE_TOP, height: RAIL_LINE_HEIGHT }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute w-px origin-top bg-brand-teal"
                style={{
                  left: RAIL_LINE_LEFT,
                  top: RAIL_LINE_TOP,
                  height: RAIL_LINE_HEIGHT,
                  scaleY: scrollYProgress,
                }}
              />
              <ol>
                {STEPS.map((s, i) => {
                  const isActive = i === active
                  const isDone = i < active
                  return (
                    <li
                      key={s.n}
                      className="relative flex items-center"
                      style={{ height: RAIL_ROW, paddingLeft: RAIL_TEXT_PAD }}
                    >
                      {/* Dot — centered on RAIL_CENTER_X and on the row's vertical midpoint. */}
                      <span
                        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-300 ${
                          isActive
                            ? 'border-brand-teal bg-brand-teal'
                            : isDone
                              ? 'border-brand-teal bg-brand-teal/40'
                              : 'border-white/25 bg-brand-black'
                        }`}
                        style={{ left: RAIL_CENTER_X, width: RAIL_DOT, height: RAIL_DOT }}
                      />
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-display text-xl tabular-nums transition-colors duration-300 ${
                            isActive ? 'text-brand-teal' : 'text-white/30'
                          }`}
                        >
                          {s.n}
                        </span>
                        <span
                          className={`font-display uppercase tracking-tight transition-all duration-300 ${
                            isActive
                              ? 'text-3xl text-white'
                              : 'text-2xl text-white/35'
                          }`}
                        >
                          {s.name}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Right: swapping detail panel — crossfade + slight vertical slide on step change. */}
            <div className="relative min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.n}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-5xl text-brand-teal/30 tabular-nums">
                      {step.n}
                    </span>
                    <h3 className="font-script text-4xl text-white sm:text-5xl">
                      {step.name}
                    </h3>
                  </div>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                    {step.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile (< lg): no scroll-pinning (unreliable/janky on touch — BRIEF.md §5A). Each step is
 * a stacked full-width card with the same scroll-triggered staggered fade/slide-in used
 * elsewhere on mobile.
 */
function MobileProcess() {
  return (
    <div className="px-6">
      <SectionHeading />
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto mt-12 max-w-xl space-y-5"
      >
        {STEPS.map((s) => (
          <motion.li
            key={s.n}
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl text-brand-teal tabular-nums">
                {s.n}
              </span>
              <h3 className="font-script text-3xl text-white">{s.name}</h3>
            </div>
            <p className="mt-3 text-base leading-relaxed text-white/70">{s.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

export default function Process() {
  const reducedMotion = useReducedMotion() ?? false

  return (
    <section className="relative z-20" style={{ backgroundColor: SECTION_BG }}>
      {/* Why Trust Us → Process (light → dark): dark torn shape over the off-white section
          above (revealColor), so the boundary reads without a stickied reveal behind it. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />
      <div className="pb-28 pt-4">
        {/* Desktop pinned interaction; mobile stacked cards. Rendered via responsive
            visibility so each path only mounts its own scroll behaviour. */}
        <div className="hidden lg:block">
          <DesktopProcess reducedMotion={reducedMotion} />
        </div>
        <div className="lg:hidden">
          <MobileProcess />
        </div>
      </div>
    </section>
  )
}
