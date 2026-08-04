import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  heroReveal,
  heroFormReveal,
  heroRevealGroup,
  headlineContainer,
  headlineWord,
} from '../animations/variants'
import { trackClickToCall } from '../lib/analytics'

const HERO_VIDEO = '/hero-video-web.mp4' // served from public/; correct logo throughout
const HERO_POSTER = '/hero-poster.jpg' // video's last frame — reduced-motion still, OG and schema image

/**
 * What `<video poster>` shows while the clip decodes — frame 0 of HERO_VIDEO, not
 * HERO_POSTER.
 *
 * The two are different pictures and the poster is only ever on screen for the ~150ms
 * before the first video frame paints, so pointing it at the *last* frame showed every
 * visitor the end of the clip and then cut back to its beginning. Ordering it correctly
 * costs nothing: the poster now matches the frame that replaces it, so the swap is
 * invisible. The last frame stays where it earns its keep — the reduced-motion still,
 * where it is the resting state the video would have ended on, and the share card.
 *
 * Re-extract with `currentTime = 0` on the video if the clip is ever recut, or this goes
 * back to being a mismatch.
 */
const HERO_VIDEO_FIRST_FRAME = '/hero-video-first-frame.jpg'

// Split for the word-by-word headline reveal. Desktop lets this wrap naturally within its
// column (produces "ARIZONA'S TOP CONCRETE" / "COATINGS SPECIALISTS" at the current width).
const HEADLINE_WORDS = "Arizona's Top Concrete Coatings Specialists".split(' ')

// Mobile forces explicit line breaks instead of relying on natural wrap — narrow phone widths
// wrapped this to 2 uneven lines, which read too dense; this grouping keeps it a clean 3 lines.
const MOBILE_HEADLINE_LINES = [["Arizona's", 'Top'], ['Concrete', 'Coatings'], ['Specialists']]

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-black'

// Compact mobile video zone height. Applied from the start (no longer animated in from a
// full-bleed intro) so the header/headline/subhead/CTAs below are visible immediately instead of
// waiting for the video to finish playing.
//
// 38svh, down from 52svh: at 52 the media ate so much of the first screen that the primary quote
// CTA landed ~90px below the fold on an iPhone 15 and ~180px below on an iPhone SE — a cold
// visitor from a paid ad had to scroll before any call to action existed. 38svh is the point
// where the CTA pair clears the fold on both, while still giving the clip enough of the frame to
// read as a hero rather than a banner. Retune against the SE (375x667) if the copy above the
// CTAs ever grows — that's the viewport with no slack left.
//
// `svh` (not `dvh`) deliberately, matching DesktopHero below — `dvh` tracks the *current*
// mobile browser toolbar state, so it jumps (and reflows everything below it) the moment
// Safari's address bar collapses on first scroll, which is what caused the "zoom"/flicker and
// stray seams at lower section boundaries. `svh` assumes the toolbar is always shown, so the
// layout never has to reflow when it actually collapses.
const MOBILE_COMPACT_HEIGHT = 'h-[38svh]'

/**
 * Why both layouts start their media below the header rather than zooming to clear it.
 *
 * The clip is one continuous push-in, so Chase's head climbs the frame the whole way through and
 * ends ~4.4% down the source frame. The headroom above it on screen is therefore ~4.4% of however
 * tall the video *renders* — not a fixed pixel value — which on any ordinary window lands well
 * under the 80px fixed header. Cropping from the top makes it worse, not better: it moves his head
 * *up*. Hence `0%` object-positions throughout.
 *
 * Buying the clearance by rendering bigger doesn't work at 4.4%: the media would have to render
 * ~2270px tall for the head to clear, i.e. ~4000px wide against a ~1500px viewport, cropping away
 * roughly two thirds of the frame's width and leaving a chest-up close-up in place of the wide
 * shot. So both layouts instead start the media *below* the header, which makes the clearance
 * structural and costs no crop at all — the video renders at its box's own size and keeps its full
 * height. Desktop's top strip is the section's own black backing, which reads as the nav bar's
 * (already heavily scrimmed) background; mobile's is the band's. Either way the media's top edge
 * and the header bar's bottom edge land on the same 80px, so the two line up.
 *
 * DESKTOP_MEDIA_MIN_HEIGHT stays on as a floor because the horizontal origin/object-position
 * values below are tuned against that box height, not because clearance still depends on it.
 */
const DESKTOP_MEDIA_MIN_HEIGHT = 'h-[max(100%,60rem)]'
const MEDIA_TOP_INSET = 'top-20' // = h-20, the header bar's own height

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
      className={`font-display font-bold uppercase leading-[0.95] tracking-tight text-white ${sizeClassName}`}
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
      <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-white sm:text-base">
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
      onClick={trackClickToCall}
      className={`flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-teal px-4 text-sm font-medium text-brand-black transition-colors duration-300 hover:bg-white ${FOCUS_RING} ${className ?? ''}`}
    >
      <PhoneIcon className="h-3.5 w-3.5" />
      Call Now
    </a>
  )
}

/** Desktop content order: kicker → headline → paragraph → quote card → phone → trust row. */
function DesktopHeroContent({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      variants={heroRevealGroup}
      initial={reducedMotion ? 'show' : 'hidden'}
      animate="show"
      className="max-w-[620px]"
    >
      <HeroKicker delay={0} />
      <HeroHeadline sizeClassName="mt-5 text-[3.375rem]" />
      <HeroParagraph delay={0.32} />
      <motion.div
        variants={heroFormReveal}
        custom={0.46}
        // Marks the hero's own CTA pair for components/CallNowButton.tsx — the sticky mobile
        // bar appears once *these* leave the viewport, not once the whole section does.
        data-hero-cta
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

/**
 * Mobile content order: kicker → headline → paragraph → quote card → phone → trust row.
 *
 * CTAs sit *above* the trust row (matching DesktopHeroContent, which always had this order).
 * They used to follow it, which pushed the primary quote CTA a further ~74px down — enough to
 * put it below the fold on every phone we test. The trust row supports the CTA rather than
 * gating it, so it reads just as well underneath. Margins here are a notch tighter than the
 * desktop column's for the same reason: on a 667px-tall iPhone SE the hero has to fit a kicker,
 * a three-line headline, a subhead, two CTAs and the trust row, and every 4px counts.
 */
function MobileHeroContent({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      variants={heroRevealGroup}
      initial={reducedMotion ? 'show' : 'hidden'}
      animate="show"
    >
      <HeroKicker delay={0} />
      <HeroHeadline
        sizeClassName="mt-3 text-4xl sm:text-5xl"
        lines={MOBILE_HEADLINE_LINES}
      />
      {/* text-base on phones, text-lg from `sm` up. At 18px this subhead wraps to four lines in
          a 327px column (iPhone SE); at 16px it wraps to three, which is worth exactly the 36px
          that puts the quote CTA below it fully above the fold rather than clipped by it. 16px
          is a normal mobile body size, and tablets still get the larger cut. */}
      <HeroParagraph
        delay={0.28}
        className="mt-4 text-base leading-[1.5] text-white/85 sm:text-lg"
      />
      <motion.div
        variants={heroFormReveal}
        custom={0.4}
        // See the matching note in DesktopHeroContent — this is the element the sticky mobile
        // Call Now bar keys off, and on mobile it's the one that actually renders.
        data-hero-cta
        className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        <QuoteCTACard className="flex-1 sm:max-w-xs" />
        <PhoneCTAButton />
      </motion.div>
      <motion.div variants={heroReveal} custom={0.52} className="mt-5">
        <TrustIndicators />
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
      poster={HERO_VIDEO_FIRST_FRAME}
      autoPlay
      muted
      playsInline
      /* `metadata`, not `auto`. `auto` asks the browser to buffer the whole 5.1MB clip as
         aggressively as it can, which on a phone competes for bandwidth with the poster —
         the actual LCP element — and with the JS bundle this SPA needs before anything
         renders at all. Autoplay still fetches and plays the video either way; this only
         stops it from front-loading the entire file ahead of everything else. The poster is
         preloaded from index.html so it wins the race outright. */
      preload="metadata"
    />
  )
}

/**
 * Desktop (lg+): full-bleed video BACKGROUND with content overlaid + legibility scrim.
 * Object-position biased center-right so Chase stays prominent and clear of the left text
 * column now that the full lead form (previously on the right) is gone.
 */
function DesktopHero({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Kick off playback the same way MobileHero does. The copy is NOT gated on this — see the
  // note on DesktopHeroContent's render below.
  useEffect(() => {
    if (reducedMotion) return
    videoRef.current?.play().catch(() => {})
  }, [reducedMotion])

  return (
    <section id="hero" className="sticky top-0 z-0 flex min-h-[100svh] items-center overflow-hidden">
      {/* The black backing is what shows through in the header strip above the media. */}
      <div className="absolute inset-0 -z-10 bg-brand-black">
        {/* Scale + matching transform-origin (not just object-position) so there's always crop
            headroom to bias Chase rightward — object-position alone does nothing once a
            viewport's aspect ratio happens to match the video's 16:9 exactly (e.g. 1920x1080),
            which otherwise left him dead-center, under the headline. The position itself shifts
            per breakpoint (rather than one fixed value) — narrower desktop windows crop more
            horizontally so need a stronger rightward bias to clear the headline; wide monitors
            have room to relax back toward his natural framing. (Lower percentages read as further
            *right* on screen here — they show more of the source's left side, which pushes him
            over.) The three values are retuned for the taller media box below, which crops more
            horizontally than a viewport-height box did; they now land his head at a steady
            ~46% of the viewport width from ~1024px all the way up to ultrawide.
            Vertically this starts below the header (MEDIA_TOP_INSET) so his head always clears it
            — see the note there — and is floored at DESKTOP_MEDIA_MIN_HEIGHT; between the inset,
            the floor and the scale, the media covers the section at every viewport height, and
            the extra overflows past the bottom, which `overflow-hidden` clips. */}
        <div
          className={`absolute inset-x-0 origin-[55%_0%] scale-110 xl:origin-[60%_0%] 2xl:origin-[72%_0%] ${MEDIA_TOP_INSET} ${DESKTOP_MEDIA_MIN_HEIGHT}`}
        >
          <HeroMedia
            reducedMotion={reducedMotion}
            videoRef={videoRef}
            className="h-full w-full object-cover object-[55%_0%] xl:object-[60%_0%] 2xl:object-[72%_0%]"
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

      {/* Content animates in on mount, not on the video's `ended` event. It used to wait for
          the clip to finish — 8 seconds, with an 11s fallback timer behind it — during which
          the headline, subhead, both CTAs and the trust row were all at opacity 0. A visitor
          arriving cold from a paid ad got a silent video and a nav bar, with nothing on screen
          saying what the business does or offering a way to contact it, for eight seconds. The
          staggered reveal is preserved; it just starts immediately and plays over the video. */}
      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        <DesktopHeroContent reducedMotion={reducedMotion} />
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
      {/* Compact video zone, sized and cropped from the start (no shrink animation to wait on).
          Its own black backing is what shows through in the header strip above the media. */}
      <div className={`relative w-full shrink-0 overflow-hidden bg-brand-black ${MOBILE_COMPACT_HEIGHT}`}>
        {/* Media starts below the header (see MOBILE_MEDIA_TOP_INSET) rather than being zoomed
            and nudged down to dodge it — no zoom means the band shows the frame at its own size:
            the full source height, and as much width as a portrait band can fit, which is the
            wide desktop-like shot rather than a tight crop of his head.
            49% horizontally centres him on screen in the final frame, and holds within ~5px of
            centre from small phones up to 1023px because the band's aspect barely moves. */}
        <div className={`absolute inset-x-0 bottom-0 ${MEDIA_TOP_INSET}`}>
          <HeroMedia
            reducedMotion={reducedMotion}
            videoRef={videoRef}
            className="h-full w-full object-cover object-[49%_0%]"
          />
        </div>

        {/* Legibility/mood overlay — same treatment as DesktopHero. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Bottom panel — visible immediately, no longer gated behind the video's `ended` event.
          `pt-8` rather than a symmetric `py-10`: reclaimed above the kicker, where it buys the
          CTA pair fold clearance on small phones, and kept below so the section still breathes
          into whatever follows it. */}
      <div className="flex-1 bg-brand-black px-6 pb-10 pt-8">
        <MobileHeroContent reducedMotion={reducedMotion} />
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
