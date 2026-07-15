import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  heroReveal,
  heroFormReveal,
  heroRevealGroup,
  headlineContainer,
  headlineWord,
} from '../animations/variants'

const HERO_VIDEO = '/hero_video_trimmed_sharp.mp4' // served from public/; correct logo throughout
const HERO_POSTER = '/hero-poster.jpg' // video's last frame — poster + reduced-motion still

// Split for the word-by-word headline reveal. Desktop lets this wrap naturally within its
// column (produces "ARIZONA'S TOP CONCRETE" / "COATINGS SPECIALISTS" at the current width).
const HEADLINE_WORDS = "Arizona's Top Concrete Coatings Specialists".split(' ')

// Mobile forces explicit line breaks instead of relying on natural wrap — narrow phone widths
// wrapped this to 2 uneven lines, which read too dense; this grouping keeps it a clean 3 lines.
const MOBILE_HEADLINE_LINES = [["Arizona's", 'Top'], ['Concrete', 'Coatings'], ['Specialists']]

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-black'

// Compact mobile video zone height, and the zoom that frames Chase's head/shoulders there (the
// zone is portrait + the source landscape, so object-position alone can't crop vertically — a
// top-anchored scale does the actual reframing). Tuned by screenshot. Applied from the start
// (no longer animated in from a full-bleed intro) so the header/headline/subhead/CTAs below are
// visible immediately instead of waiting for the video to finish playing.
// `svh` (not `dvh`) deliberately, matching DesktopHero below — `dvh` tracks the *current*
// mobile browser toolbar state, so it jumps (and reflows everything below it) the moment
// Safari's address bar collapses on first scroll, which is what caused the "zoom"/flicker and
// stray seams at lower section boundaries. `svh` assumes the toolbar is always shown, so the
// layout never has to reflow when it actually collapses.
const MOBILE_COMPACT_HEIGHT = 'h-[52svh]'
const MOBILE_COMPACT_SCALE = 1.15
// Nudge the zoomed frame down in the compact state so Chase's head clears the fixed header
// (the sliver this opens at the very top is hidden under the header's dark scrim). Tuned by screenshot.
const MOBILE_COMPACT_SHIFT = 22

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3.5h5.5L18 8v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9.5 12.5h5M9.5 15.5h3.5" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/** Small kicker line — first content in reveal order on both layouts. */
function HeroKicker({ delay = 0 }: { delay?: number }) {
  return (
    <motion.p
      variants={heroReveal}
      custom={delay}
      className="font-script text-xl text-brand-teal sm:text-2xl"
    >
      Family Owned &amp; Operated
    </motion.p>
  )
}

/**
 * Word-by-word headline reveal. `sizeClassName` lets desktop/mobile pick their own scale.
 * `lines`, when given, forces explicit line breaks (each sub-array is one line) instead of
 * letting the words wrap naturally — used on mobile so the break points stay predictable
 * across widths rather than depending on how much room the words happen to have.
 */
function HeroHeadline({
  sizeClassName,
  lines,
}: {
  sizeClassName: string
  lines?: string[][]
}) {
  const lineGroups = lines ?? [HEADLINE_WORDS]
  return (
    <motion.h1
      variants={headlineContainer}
      className={`font-display uppercase leading-[0.95] tracking-tight text-white ${sizeClassName}`}
    >
      {lineGroups.map((line, li) => (
        <span key={li} className="block">
          {line.map((word, wi) => (
            <motion.span key={wi} variants={headlineWord} className="mr-[0.22em] inline-block last:mr-0">
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}

function HeroParagraph({ delay = 0.32, className }: { delay?: number; className?: string }) {
  return (
    <motion.p
      variants={heroReveal}
      custom={delay}
      className={className ?? 'mt-7 max-w-[540px] text-lg leading-[1.5] text-white/85'}
    >
      Specializing in garage floors, commercial, patios, sidewalks, driveways, pool decks, and
      polished concrete.
    </motion.p>
  )
}

const TRUST_ITEMS = [
  {
    label: '1-Day Installs',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 4 2.3-1 1.7-5-2.9V6h2v6.4Z',
  },
  {
    label: 'Premium Materials',
    path: 'M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
  },
  {
    label: '5-Star Rated',
    path: 'm12 2 3 6.3 6.9.9-5 4.8 1.3 6.8L12 17.8 5.8 20.8l1.3-6.8-5-4.8 6.9-.9L12 2Z',
  },
]

/** Compact trust row — small teal icons + white labels, one row when space allows. */
function TrustIndicators({ className }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-8 gap-y-2.5 ${className ?? ''}`}>
      {TRUST_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] flex-none text-brand-teal"
            fill="currentColor"
          >
            <path d={item.path} />
          </svg>
          <span className="text-sm font-semibold text-white drop-shadow-sm">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Compact quote CTA card — replaces the full lead form in the hero (primary conversion action).
 * Links to the page's existing quote form section (`#quote`, per FinalCTA below) rather than
 * duplicating its fields here.
 */
function QuoteCTACard({ className }: { className?: string }) {
  return (
    <a
      href="#quote"
      className={`group flex min-h-[60px] items-center gap-3 rounded-lg border border-white/15 bg-black/50 px-4 py-3 backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-teal/70 hover:bg-black/65 hover:shadow-lg hover:shadow-black/40 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 ${FOCUS_RING} ${className ?? ''}`}
    >
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
        <QuoteIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white sm:text-base">
        Get Your Free Quote
      </span>
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-teal text-brand-black transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
        <ArrowIcon className="h-3.5 w-3.5" />
      </span>
    </a>
  )
}

/** Secondary phone CTA — solid teal, but visually a notch quieter than the quote card (its
 * primary sibling): shrink-wrapped rather than growing to fill the row, and a plain font weight
 * instead of the card's bold title. */
function PhoneCTAButton({ className }: { className?: string }) {
  return (
    <a
      href="tel:+16232241097"
      className={`flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-teal px-4 text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-white ${FOCUS_RING} ${className ?? ''}`}
    >
      <PhoneIcon className="h-3.5 w-3.5" />
      Call (623) 224-1097
    </a>
  )
}

/** Desktop content order: kicker → headline → paragraph → quote card → phone → trust row. */
function DesktopHeroContent({
  revealed,
  reducedMotion,
}: {
  revealed: boolean
  reducedMotion: boolean
}) {
  return (
    <motion.div
      variants={heroRevealGroup}
      initial={reducedMotion ? 'show' : 'hidden'}
      animate={revealed ? 'show' : 'hidden'}
      className="max-w-[620px]"
    >
      <HeroKicker delay={0} />
      <HeroHeadline sizeClassName="mt-5 text-6xl" />
      <HeroParagraph delay={0.32} />
      <motion.div
        variants={heroFormReveal}
        custom={0.46}
        className="mt-9 flex items-center gap-3"
      >
        <QuoteCTACard className="max-w-xs flex-1" />
        <PhoneCTAButton />
      </motion.div>
      <motion.div variants={heroReveal} custom={0.6} className="mt-9">
        <TrustIndicators />
      </motion.div>
    </motion.div>
  )
}

/** Mobile content order: kicker → headline → paragraph → trust row → quote card → phone. */
function MobileHeroContent({
  revealed,
  reducedMotion,
}: {
  revealed: boolean
  reducedMotion: boolean
}) {
  return (
    <motion.div
      variants={heroRevealGroup}
      initial={reducedMotion ? 'show' : 'hidden'}
      animate={revealed ? 'show' : 'hidden'}
    >
      <HeroKicker delay={0} />
      <HeroHeadline
        sizeClassName="mt-4 text-4xl sm:text-5xl"
        lines={MOBILE_HEADLINE_LINES}
      />
      <HeroParagraph
        delay={0.28}
        className="mt-5 text-lg leading-[1.5] text-white/85"
      />
      <motion.div variants={heroReveal} custom={0.4} className="mt-6">
        <TrustIndicators />
      </motion.div>
      <motion.div
        variants={heroFormReveal}
        custom={0.52}
        className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        <QuoteCTACard className="flex-1 sm:max-w-xs" />
        <PhoneCTAButton />
      </motion.div>
    </motion.div>
  )
}

/** Reusable video/poster element (autoplay-once; not looped so it holds the last frame). */
function HeroMedia({
  reducedMotion,
  videoRef,
  className,
}: {
  reducedMotion: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  className: string
}) {
  if (reducedMotion) {
    return <img src={HERO_POSTER} alt="" aria-hidden="true" className={className} />
  }
  return (
    <video
      ref={videoRef}
      className={className}
      src={HERO_VIDEO}
      poster={HERO_POSTER}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  )
}

/** Shared autoplay-once → reveal-on-`ended` behaviour (with autoplay-blocked fallback). */
function useHeroReveal(reducedMotion: boolean, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [revealed, setRevealed] = useState(reducedMotion)
  useEffect(() => {
    if (reducedMotion) return
    const video = videoRef.current
    if (!video) return
    const reveal = () => setRevealed(true)
    video.addEventListener('ended', reveal)
    video.play().catch(() => {})
    const fallback = window.setTimeout(reveal, 11000)
    return () => {
      video.removeEventListener('ended', reveal)
      window.clearTimeout(fallback)
    }
  }, [reducedMotion, videoRef])
  return revealed
}

/**
 * Desktop (lg+): full-bleed video BACKGROUND with content overlaid + legibility scrim.
 * Object-position biased center-right so Chase stays prominent and clear of the left text
 * column now that the full lead form (previously on the right) is gone.
 */
function DesktopHero({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const revealed = useHeroReveal(reducedMotion, videoRef)

  return (
    <section id="hero" className="sticky top-0 z-0 flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Scale + matching transform-origin (not just object-position) so there's always crop
            headroom to bias Chase rightward — object-position alone does nothing once a
            viewport's aspect ratio happens to match the video's 16:9 exactly (e.g. 1920x1080),
            which otherwise left him dead-center, under the headline. The position itself shifts
            per breakpoint (rather than one fixed value) — narrower desktop windows crop more
            horizontally so need a stronger rightward bias to clear the headline; wide monitors
            have room to relax back toward his natural framing. */}
        <div className="absolute inset-0 origin-[74%_25%] scale-110 xl:origin-[70%_25%] 2xl:origin-[64%_24%]">
          <HeroMedia
            reducedMotion={reducedMotion}
            videoRef={videoRef}
            className="h-full w-full object-cover object-[74%_25%] xl:object-[70%_25%] 2xl:object-[64%_24%]"
          />
        </div>
        {/* Layered scrim: strong left→right gradient for copy legibility (clearer around Chase
            on the right), a light bottom lift, a bottom-left radial darken so the trust row
            stays readable over whatever the image happens to show there, and a soft outer
            vignette so the edges never look like a flat, uniformly-dark rectangle. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_0%_100%,rgba(0,0,0,0.55),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        <DesktopHeroContent revealed={revealed} reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}

/**
 * Mobile (< lg): the video plays within its already-compact top zone from the start, with the
 * header/headline/subhead/CTAs visible immediately below it — rather than an immersive 100dvh
 * intro the viewer has to wait through before the rest of the page appears (revised from the
 * original full-bleed → shrink sequence in BRIEF.md §5 "Mobile layout").
 */
function MobileHero({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    videoRef.current?.play().catch(() => {})
  }, [reducedMotion])

  return (
    <section id="hero" className="relative z-0 flex min-h-[100svh] flex-col overflow-hidden">
      {/* Compact video zone, sized and cropped from the start (no shrink animation to wait on). */}
      <div className={`relative w-full shrink-0 overflow-hidden ${MOBILE_COMPACT_HEIGHT}`}>
        {/* Top-anchored zoom frames Chase's head/shoulders in the compact zone. */}
        <div
          className="absolute inset-0 origin-top"
          style={{ transform: `scale(${MOBILE_COMPACT_SCALE}) translateY(${MOBILE_COMPACT_SHIFT}px)` }}
        >
          <HeroMedia
            reducedMotion={reducedMotion}
            videoRef={videoRef}
            className="h-full w-full object-cover object-[38%_30%]"
          />
        </div>

        {/* Legibility/mood overlay — same treatment as DesktopHero. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Bottom panel — visible immediately, no longer gated behind the video's `ended` event. */}
      <div className="flex-1 bg-brand-black px-6 py-10">
        <MobileHeroContent revealed reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}

/** Picks the mobile vs desktop hero; both share reveal behaviour and content building blocks. */
export default function Hero() {
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1023.98px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023.98px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile ? (
    <MobileHero reducedMotion={reducedMotion} />
  ) : (
    <DesktopHero reducedMotion={reducedMotion} />
  )
}
