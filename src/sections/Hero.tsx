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
import { usePageContent } from '../lib/pageContent'
import SanityProse from '../components/SanityProse'

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

// Mobile forces explicit line breaks instead of relying on natural wrap — narrow phone widths
// wrapped this to 2 uneven lines, which read too dense; this grouping keeps it a clean 3 lines.
//
// These words are a hardcoded copy of the shipped headline, so they only apply while the
// headline still *is* the shipped one. The heading is editable in Sanity now, and rendering
// this grouping against a rewritten headline would print the old words on mobile — so
// HeroHeadline checks that the two still match before using it (see there). Desktop has no
// such list; it wraps naturally within its column and adapts to any headline on its own.
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
 * The desktop media box therefore runs from this inset to the section's bottom and no further —
 * see the note at the box itself for why anything larger is crop the viewer pays for and never
 * sees. It used to carry a `max(100%,60rem)` floor, which meant that on any viewport shorter than
 * 960px the clip rendered 1056px tall no matter how little of it fit: a 1366x768 Windows laptop,
 * whose browser viewport is ~657px once Chrome's own chrome is subtracted, showed the top 55% of
 * that render — a chest-up close-up where a MacBook-height window showed the wide shot.
 */
const MEDIA_TOP_INSET = 'top-20' // = h-20, the header bar's own height

/**
 * Floor for the desktop hero section, in rem rather than a viewport unit.
 *
 * `min-h-[100svh]` alone broke on short windows: the column is centered, so once its fixed 651px
 * exceeded the viewport it overflowed symmetrically and its top slid under the 80px fixed header
 * (at a 657px viewport — a 1366x768 laptop minus browser chrome — the kicker sat at y=83, flush
 * against the nav; the screenshot that started this was exactly that).
 *
 * The scale below is what actually fixes that, by shrinking the whole column on short windows
 * instead of letting it overrun them. This floor is only the backstop underneath it — at the
 * scale's own floor the column measures ~576px, so 32rem (512px) is what keeps a genuinely
 * abnormal window (a half-height browser, a kiosk) showing a hero rather than a bare strip.
 */
const DESKTOP_SECTION_MIN_HEIGHT = 'min-h-[max(100svh,32rem)]'

/**
 * ONE unit drives the entire desktop hero.
 *
 * `--hero-u` is the headline's font size, and every other measurement in the desktop hero — kicker,
 * subhead, the gaps between them, column width, page padding, and the CTA/trust controls — is a
 * fixed multiple of it. So the hero doesn't have a set of independently-responsive parts; it has
 * one design that scales as a whole, which is the only way the proportions in it stay put across
 * window sizes. Scaling the type alone (what this did before) is what left a 37px headline sitting
 * next to a 60px button that had not moved: the pieces were individually fine and collectively
 * wrong.
 *
 * The design is drawn at u = 3.375rem (54px), i.e. the 1920x1080 rendering, and every multiplier
 * below is that design's px value / 54. `min(2.8vw, 5vh)` scales u by whichever axis is actually
 * the constraint — width alone overflows short-wide windows (1366x657, ultrawide), height alone
 * shrinks type on tall narrow ones. The 2.875rem (46px) floor is deliberately close to the ceiling:
 * the hero only needs to give back ~15% to fit a laptop, and holding the band that narrow is what
 * makes every desktop size look like the same hero rather than a family of them. Controls stay
 * legible and clickable at the floor (48px CTA, 41px phone button).
 */
const DESKTOP_UNIT = '[--hero-u:clamp(2.875rem,min(2.8vw,5vh),3.375rem)]'

/** Type: 54 / 24 / 18px at the design size. */
const DESKTOP_HEADLINE = 'text-[length:var(--hero-u)]'
const DESKTOP_KICKER = 'text-[length:calc(var(--hero-u)*0.4444)]'
const DESKTOP_PARAGRAPH = 'text-[length:calc(var(--hero-u)*0.3333)]'

/** Vertical rhythm: the old mt-5 / mt-7 / mt-9 (20 / 28 / 36px). */
const DESKTOP_GAP_XS = 'mt-[calc(var(--hero-u)*0.3704)]'
const DESKTOP_GAP_SM = 'mt-[calc(var(--hero-u)*0.5185)]'
const DESKTOP_GAP_MD = 'mt-[calc(var(--hero-u)*0.6667)]'

/**
 * The base the controls' internal `em` sizing resolves against — 16px at the design size, which is
 * exactly what those components inherit on mobile, so setting it here scales the CTA cards and
 * trust row on desktop while leaving the mobile layout untouched.
 */
const DESKTOP_CONTROL_BASE = 'text-[length:calc(var(--hero-u)*0.2963)]'

/**
 * Widths in `em`, so they scale with their own font size and the copy keeps its shape.
 *
 * A px column is what made a smaller headline change shape rather than just get smaller: at 54px
 * the copy breaks across four lines, but at 37px that same 620px fits more words per line, so short
 * windows got a differently-wrapped, lopsided headline. In em the ratio of column width to glyph
 * width is constant, so the break points are identical at every size. 11.5em x 54px = the 620px
 * column these were tuned at; 30em x 18px = the 540px subhead.
 */
const DESKTOP_COLUMN_WIDTH = 'max-w-[calc(var(--hero-u)*11.4815)]'
const DESKTOP_HEADLINE_WIDTH = 'max-w-[11.5em]'
const DESKTOP_PARAGRAPH_WIDTH = 'max-w-[30em]'

/**
 * Column padding, also in units of u (64px horizontal / 43px vertical at the design size) so the
 * whitespace around the hero scales with the hero.
 *
 * The top adds the 80px the fixed header occupies so that `items-center` centers the column in the
 * space BELOW the nav rather than in the raw viewport — otherwise every window sits the copy high
 * by half the header's height. The horizontal value also replaces a flat `px-6`, which left the
 * copy 24px off the bezel on any window narrower than the 80rem content cap and read as unpadded.
 */
const DESKTOP_COLUMN_PADDING =
  'px-[calc(var(--hero-u)*1.1852)] pb-[calc(var(--hero-u)*0.8)] pt-[calc(5rem_+_var(--hero-u)*0.8)]'

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

/**
 * Small kicker line — first content in reveal order on both layouts. `sizeClassName` lets desktop
 * swap in its fluid scale; the default is mobile's fixed pair, which is already right there.
 */
function HeroKicker({
  delay = 0,
  sizeClassName = 'text-xl sm:text-2xl',
}: {
  delay?: number
  sizeClassName?: string
}) {
  return (
    <motion.p
      variants={heroReveal}
      custom={delay}
      className={`font-script text-brand-teal ${sizeClassName}`}
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
 *
 * Reads the homepage heading straight from usePageContent rather than taking it as a prop:
 * Hero is homepage-only, and the alternative is threading two values through DesktopHero and
 * MobileHero purely to reach this leaf. The hook caches per route, so this and HeroParagraph
 * below share one fetch.
 */
function HeroHeadline({
  sizeClassName,
  lines,
}: {
  sizeClassName: string
  lines?: string[][]
}) {
  const { h1 } = usePageContent('/')
  const words = h1.split(/\s+/).filter(Boolean)
  // `lines` is a hardcoded grouping of the shipped headline's words. Use it only while it still
  // spells that headline — otherwise an editor's rewrite would render the *old* words on mobile
  // while desktop showed the new ones. Comparing the two is self-validating: it stays correct if
  // either the grouping or the copy changes, with nothing to remember to update.
  const groupingMatchesHeadline = lines?.flat().join(' ') === words.join(' ')
  const lineGroups = lines && groupingMatchesHeadline ? lines : [words]
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

/**
 * The subhead under the headline, now editable in Sanity (see HeroHeadline on why this reads
 * the hook directly).
 *
 * A <div> wrapping paragraphs rather than a <p>, because an editor can write more than one.
 * The caller's className stays on the wrapper and the type styles in it — size, leading, colour
 * — inherit down to the paragraphs, so a single paragraph renders byte-identically to the <p>
 * this replaced. SanityProse is passed an empty className so it adds only inter-paragraph
 * spacing and does not fight those inherited styles.
 */
function HeroParagraph({ delay = 0.32, className }: { delay?: number; className?: string }) {
  const { bodyContent } = usePageContent('/')
  return (
    <motion.div
      variants={heroReveal}
      custom={delay}
      className={className ?? 'mt-7 max-w-[540px] text-lg leading-[1.5] text-white/85'}
    >
      <SanityProse blocks={bodyContent} className="" />
    </motion.div>
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

/**
 * Compact trust row — small teal icons + white labels, one row when space allows.
 *
 * Sizing is in `em` against this element's own font size (see DESKTOP_CONTROL_BASE): 2em/0.625em
 * gaps, 1.125em icons and 0.875em labels are the 32/10/18/14px this was drawn at, and stay so
 * wherever the font size is the inherited 16px — i.e. everywhere on mobile. Desktop overrides that
 * one font size with a fraction of `--hero-u` and the whole row scales with the rest of the hero.
 */
function TrustIndicators({ className }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-[2em] gap-y-[0.625em] ${className ?? ''}`}>
      {TRUST_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-[0.5em]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[1.125em] w-[1.125em] flex-none text-brand-teal"
            fill="currentColor"
          >
            <path d={item.path} />
          </svg>
          <span className="text-[0.875em] font-semibold text-white drop-shadow-sm">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Compact quote CTA card — replaces the full lead form in the hero (primary conversion action).
 * Links to the page's existing quote form section (`#quote`, per FinalCTA below) rather than
 * duplicating its fields here.
 *
 * Every dimension is `em` against the card's own font size — 3.75em/1em/0.75em/2em/1.75em are the
 * 60/16/12/32/28px this was drawn at, unchanged wherever that font size is the inherited 16px. See
 * TrustIndicators above for why.
 */
function QuoteCTACard({ className }: { className?: string }) {
  return (
    <a
      href="#quote"
      className={`group flex min-h-[3.75em] items-center gap-[0.75em] rounded-lg border border-white/15 bg-black/50 px-[1em] py-[0.75em] backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-teal/70 hover:bg-black/65 hover:shadow-lg hover:shadow-black/40 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 ${FOCUS_RING} ${className ?? ''}`}
    >
      <span className="flex h-[2em] w-[2em] flex-none items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
        <QuoteIcon className="h-[1em] w-[1em]" />
      </span>
      <span className="min-w-0 flex-1 truncate text-center text-[0.875em] font-semibold text-white sm:text-[1em]">
        Get Your Free Quote
      </span>
      <span className="flex h-[1.75em] w-[1.75em] flex-none items-center justify-center rounded-full bg-brand-teal text-brand-black transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
        <ArrowIcon className="h-[0.875em] w-[0.875em]" />
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
      className={`flex min-h-[3em] items-center justify-center gap-[0.5em] whitespace-nowrap rounded-lg bg-brand-teal px-[1em] font-medium text-brand-black transition-colors duration-300 hover:bg-white ${FOCUS_RING} ${className ?? ''}`}
    >
      <PhoneIcon className="h-[0.875em] w-[0.875em]" />
      {/* The label carries the type size rather than the <a>, so the button's own em-based box
          (3em = the 48px it was drawn at) stays measured against the 16px base, not the 14px label. */}
      <span className="text-[0.875em]">Call Now</span>
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
      className={DESKTOP_COLUMN_WIDTH}
    >
      <HeroKicker delay={0} sizeClassName={DESKTOP_KICKER} />
      <HeroHeadline
        sizeClassName={`${DESKTOP_GAP_XS} ${DESKTOP_HEADLINE} ${DESKTOP_HEADLINE_WIDTH}`}
      />
      <HeroParagraph
        delay={0.32}
        className={`${DESKTOP_GAP_SM} ${DESKTOP_PARAGRAPH} ${DESKTOP_PARAGRAPH_WIDTH} leading-[1.5] text-white/85`}
      />
      <motion.div
        variants={heroFormReveal}
        custom={0.46}
        // Marks the hero's own CTA pair for components/CallNowButton.tsx — the sticky mobile
        // bar appears once *these* leave the viewport, not once the whole section does.
        data-hero-cta
        className={`flex items-center gap-[calc(var(--hero-u)*0.2222)] ${DESKTOP_GAP_MD}`}
      >
        {/* 20em x the control base = the 320px `max-w-xs` this was drawn at, now scaling with it. */}
        <QuoteCTACard className={`max-w-[20em] flex-1 ${DESKTOP_CONTROL_BASE}`} />
        <PhoneCTAButton className={DESKTOP_CONTROL_BASE} />
      </motion.div>
      <motion.div variants={heroReveal} custom={0.6} className={DESKTOP_GAP_MD}>
        <TrustIndicators className={DESKTOP_CONTROL_BASE} />
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
    <section
      id="hero"
      className={`sticky top-0 z-0 flex items-center overflow-hidden ${DESKTOP_UNIT} ${DESKTOP_SECTION_MIN_HEIGHT}`}
    >
      {/* The black backing is what shows through in the header strip above the media. */}
      <div className="absolute inset-0 -z-10 bg-brand-black">
        {/* The media box is EXACTLY the area the viewer can see — full width, from the header's
            bottom edge (MEDIA_TOP_INSET, so his head always clears the nav — see the note there)
            to the section's bottom. That is the least-cropped a full-bleed 16:9 background can be:
            `object-cover` only ever discards the difference between the source's aspect ratio and
            its box's, so any box bigger than what's on screen throws away frame for nothing.

            It used to be bigger in two ways, and both were pure crop. `scale-110` zoomed 10% past
            the viewport to buy overflow the transform-origin could slide around, and the box ran a
            further 80px below the section (`h-full` from an inset top), which is picture that only
            ever existed under the fold. Together they left ~62% of the frame visible on a 1366x657
            laptop; on the same window the box now shows 100% of the clip's width and 75% of its
            height — the most a 2.37:1 opening can show of a 1.78:1 source, the rest being the
            arithmetic of cover fill rather than anything left to tune.

            The object-position stays: it does nothing on windows wider than 16:9 (there is no
            horizontal overflow left to position) but still biases Chase rightward, clear of the
            headline, on the taller windows where cover crops width instead of height. */}
        <div className={`absolute inset-x-0 bottom-0 ${MEDIA_TOP_INSET}`}>
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
      <div className={`mx-auto w-full max-w-7xl ${DESKTOP_COLUMN_PADDING}`}>
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
