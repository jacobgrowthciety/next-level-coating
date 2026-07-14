import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  heroReveal,
  heroFormReveal,
  heroRevealGroup,
  headlineContainer,
  headlineWord,
} from '../animations/variants'
import LeadForm from '../components/LeadForm'
import CallNowButton from '../components/CallNowButton'

const HERO_VIDEO = '/hero_video_trimmed_sharp.mp4' // served from public/; correct logo throughout
const HERO_POSTER = '/hero-poster.jpg' // video's last frame — poster + reduced-motion still

// Split for the word-by-word headline reveal.
const HEADLINE_WORDS = "Arizona's Top Concrete Coatings Specialists".split(' ')

// Compact mobile video zone height, and the zoom that frames Chase's head/shoulders there (the
// zone is portrait + the source landscape, so object-position alone can't crop vertically — a
// top-anchored scale does the actual reframing). Tuned by screenshot. Applied from the start
// (no longer animated in from a full-bleed intro) so the header/headline/subhead/form below are
// visible immediately instead of waiting for the video to finish playing.
const MOBILE_COMPACT_HEIGHT = 'h-[52dvh]'
const MOBILE_COMPACT_SCALE = 1.5
// Nudge the zoomed frame down in the compact state so Chase's head clears the fixed header
// (the sliver this opens at the very top is hidden under the header's dark scrim). Tuned by screenshot.
const MOBILE_COMPACT_SHIFT = 32

/** Shared reveal content — kicker → headline (word-by-word) → subhead → call button → form. */
function HeroContent({
  revealed,
  reducedMotion,
}: {
  revealed: boolean
  reducedMotion: boolean
}) {
  return (
    <motion.div
      variants={heroRevealGroup}
      // Reduced motion: start already shown so no fade/slide runs on mount.
      initial={reducedMotion ? 'show' : 'hidden'}
      animate={revealed ? 'show' : 'hidden'}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <div className="max-w-xl">
        <motion.p
          variants={heroReveal}
          custom={0}
          className="font-script text-xl text-brand-teal sm:text-2xl"
        >
          Family Owned &amp; Operated
        </motion.p>
        <motion.h1
          variants={headlineContainer}
          className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:mt-2 lg:text-7xl"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span key={i} variants={headlineWord} className="mr-[0.22em] inline-block">
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          variants={heroReveal}
          custom={0.32}
          className="mt-6 max-w-lg text-lg text-white/80"
        >
          Specializing in garage floors, commercial, patios, sidewalks,
          driveways, grind n' seal, pool decks, and pavers.
        </motion.p>
        <motion.div variants={heroReveal} custom={0.46} className="mt-8 hidden md:block">
          <a
            href="tel:+16232241097"
            className="inline-flex items-center gap-2 rounded-full border border-brand-teal/60 px-6 py-3 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-black"
          >
            Call (623) 224-1097
          </a>
        </motion.div>
      </div>

      <motion.div
        variants={heroFormReveal}
        custom={0.6}
        className="w-full max-w-md lg:justify-self-end"
      >
        <LeadForm />
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
 * Desktop (lg+): approved full-bleed video BACKGROUND with content overlaid + legibility scrim.
 * Unchanged from the approved design.
 */
function DesktopHero({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const revealed = useHeroReveal(reducedMotion, videoRef)

  return (
    <section className="sticky top-0 z-0 flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <HeroMedia
          reducedMotion={reducedMotion}
          videoRef={videoRef}
          className="h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-28">
        <HeroContent revealed={revealed} reducedMotion={reducedMotion} />
      </div>

      <CallNowButton />
    </section>
  )
}

/**
 * Mobile (< lg): the video plays within its already-compact top zone from the start, with the
 * header/headline/subhead/form visible immediately below it — rather than an immersive 100dvh
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
    <section className="relative z-0 flex min-h-[100dvh] flex-col overflow-hidden">
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
            className="h-full w-full object-cover object-[38%_15%]"
          />
        </div>

        {/* Legibility/mood overlay — same treatment as DesktopHero. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Bottom panel — visible immediately, no longer gated behind the video's `ended` event. */}
      <div className="flex-1 bg-brand-black px-6 py-12">
        <HeroContent revealed reducedMotion={reducedMotion} />
      </div>

      <CallNowButton />
    </section>
  )
}

/** Picks the mobile vs desktop hero; both share reveal behaviour and content. */
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
