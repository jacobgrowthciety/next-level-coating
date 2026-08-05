import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * ReelOrbit — 3D video carousel for vertical (9:16) reels.
 *
 * Ported from the Framer code component of the same name. Framer's runtime imports
 * (`addPropertyControls`, `ControlType`, `useIsStaticRenderer`) are gone — the first two only
 * drew the canvas props panel, and the third reported Framer's static-export pass, which never
 * happens in a client-rendered SPA. Every property-control `defaultValue` is re-declared as a
 * parameter default below; they were the only source of defaults for all but one prop.
 *
 * Behaviour differs from the original in five deliberate ways, all documented at their sites:
 *   1. The rAF loop writes transforms straight to the DOM instead of through React state.
 *   2. The loop parks itself when the carousel settles, and while the section is off screen.
 *   3. `prefers-reduced-motion` actually removes motion rather than swapping its mechanism.
 *   4. Card spacing is decoupled from a literal 360° ring, though ordering stays cyclic — LAYOUT.
 *   5. Only the active video is allowed to fetch.
 */

export interface ReelItem {
  /** Video source — self-hosted path or absolute URL. */
  src: string
  /** Poster frame. Shown before playback and for every inactive card. */
  poster?: string
  /** Accessible description of this clip. */
  label?: string
}

export interface ReelOrbitProps {
  items: ReelItem[]
  /** Card width: the smaller of this % of the stage and `cardMaxWidth`. */
  cardWidthPercent?: number
  cardMaxWidth?: number
  cornerRadius?: number
  /** Y-rotation applied per step of separation, in degrees. See LAYOUT. */
  spreadAngle?: number
  /** Lateral offset per step, as a % of card width. */
  spreadX?: number
  /** How far back each step of separation pushes a card, in px. */
  depth?: number
  scaleFalloff?: number
  opacityFalloff?: number
  perspective?: number
  showArrows?: boolean
  /**
   * Which background the carousel sits on. Affects only the inactive dot colour — everything
   * else (cards, arrows, mute button) already reads on either. Purely cosmetic; no behaviour,
   * sizing, playback or layout differs between the two.
   */
  tone?: 'light' | 'dark'
  cardBackground?: string
  shadowColor?: string
  className?: string
}

/*
 * LAYOUT — why card spacing is decoupled from a literal 360° ring.
 *
 * The original placed card `i` at `rotateY(i * 360/count) translateZ(radius)`, a true ring. That
 * works with six or eight cards; with three it does not. 360/3 = 120°, so both neighbours sit
 * past the 90° point where a card turns edge-on and begins showing its back — you get a mirrored
 * video, and adding `backface-visibility: hidden` to fix that erases the neighbours entirely,
 * leaving one lonely card and no 3D read at all.
 *
 * So the geometry is decoupled from the ring: each step of separation rotates a card ~34°, slides
 * it sideways and drops it back in Z, rather than spacing cards by a literal 360/count. Cards stay
 * comfortably inside the 90° limit and face the viewer. `backface-visibility: hidden` is still set
 * as a guard for anyone dialling `spreadAngle` past 90.
 *
 * Ordering around the ring IS still cyclic, though — see `wrapOffset`. Offsets take the short way
 * round, so there is always one card to the left and one to the right of the front card, and
 * navigation never hits an end. That's what makes it read as rotation rather than as a stack that
 * fans off to one side, and it means every position is composed symmetrically, not just the middle
 * one.
 */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (from: number, to: number, alpha: number) => from + (to - from) * alpha

/** Folds a raw offset into [-count/2, count/2) — the short way round a ring of `count` cards. */
const wrapOffset = (offset: number, count: number) => {
  const half = count / 2
  return ((((offset + half) % count) + count) % count) - half
}

/** Folds an unbounded ring position back to a real card index in [0, count). */
const modIndex = (value: number, count: number) => ((value % count) + count) % count

/** Fraction of a card's width a pointer must travel to advance one step. */
const DRAG_STEP_RATIO = 0.55
/** Distance (in steps) below which the animation is considered settled and the loop parks. */
const SETTLE_EPSILON = 0.0005
/** Pointer travel (px) under which a release counts as a tap, not a drag. */
const TAP_SLOP = 6
/** Floor so distant cards stay faintly present instead of vanishing. */
const MIN_CARD_OPACITY = 0.16

export default function ReelOrbit({
  items,
  cardWidthPercent = 78,
  cardMaxWidth = 360,
  cornerRadius = 24,
  spreadAngle = 34,
  spreadX = 62,
  depth = 180,
  scaleFalloff = 0.16,
  // 0.42 with a floor, not 0.55: at 0.55 a card two steps out lands at exactly opacity 0, so
  // with three clips the far one was invisible and the deck only ever read as two cards.
  opacityFalloff = 0.42,
  perspective = 1200,
  showArrows = true,
  tone = 'light',
  cardBackground = '#111111',
  // Tight and light. The original `0 24px 70px rgba(0,0,0,0.35)` threw a 70px haze that the
  // clipping wrapper below sliced off square, so the card sat inside a visible grey rectangle
  // instead of floating on the off-white section. Keeping the blur well inside the clip's
  // breathing room is what removes that box.
  shadowColor = 'rgba(0,0,0,0.22)',
  className,
}: ReelOrbitProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const rafRef = useRef<number | null>(null)
  const positionRef = useRef(0)
  const targetRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const startXRef = useRef(0)
  const movedRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const reels = useMemo(() => (items || []).filter((item) => item?.src), [items])
  const count = reels.length
  /** The card actually on screen, folded out of the unbounded ring position. */
  const currentIndex = modIndex(activeIndex, count)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  /**
   * Writes the transform for every card at a given continuous position.
   *
   * Deliberately imperative. The original called `setRingRotation` inside `startTransition` on
   * every animation frame, which re-rendered the whole component — all three <video> elements
   * and their wrappers — sixty times a second, and marked that update interruptible so React
   * could defer the very thing driving the animation. Writing to `style` directly keeps React
   * out of the frame loop entirely; `activeIndex` is the only state the animation touches, and
   * it changes once per navigation.
   */
  const paint = useCallback(
    (position: number) => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return
        // Wrapped, shortest-path offset — this is what makes the deck read as a rotating ring
        // rather than a stack that fans off to one side. Raw `index - position` puts every
        // other card to the RIGHT of the front one, so sitting on the first clip left both
        // neighbours crowded to one side and the composition lopsided. Folding the offset into
        // [-count/2, count/2) means each card takes the short way round, so with three clips
        // there is always exactly one to the left and one to the right, at every position.
        const offset = wrapOffset(index - position, count)
        const distance = Math.abs(offset)
        const scale = clamp(1 - distance * scaleFalloff, 0.5, 1)
        const opacity = clamp(1 - distance * opacityFalloff, MIN_CARD_OPACITY, 1)

        card.style.transform = `translateX(${offset * spreadX}%) translateZ(${-distance * depth}px) rotateY(${-offset * spreadAngle}deg) scale(${scale})`
        card.style.opacity = String(opacity)
        card.style.zIndex = String(100 - Math.round(distance * 10))
        // Only the front card should take pointer events, or a faded neighbour swallows taps
        // meant for the video beneath it.
        card.style.pointerEvents = distance < 0.5 ? 'auto' : 'none'
      })
    },
    [count, depth, opacityFalloff, scaleFalloff, spreadAngle, spreadX],
  )

  /**
   * Starts the frame loop, if it isn't already running.
   *
   * The loop stops itself once the carousel is within SETTLE_EPSILON of its target and no drag
   * is in progress. The original re-scheduled unconditionally, so it ran at 60fps forever —
   * parked on one card, scrolled out of view, or sitting in a background tab.
   */
  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return

    const tick = () => {
      const target = targetRef.current + dragOffsetRef.current
      positionRef.current = lerp(positionRef.current, target, 0.16)

      if (!draggingRef.current && Math.abs(target - positionRef.current) < SETTLE_EPSILON) {
        positionRef.current = target
        paint(positionRef.current)
        rafRef.current = null
        return
      }

      paint(positionRef.current)
      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }, [paint])

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // Unbounded — `activeIndex` is a position on an endless ring, not an array index. It may run
  // negative or past the end; `currentIndex` folds it back to a real card. That's what lets the
  // deck keep turning the same way forever instead of hitting a wall at either end.
  const goPrev = useCallback(() => setActiveIndex((i) => i - 1), [])
  const goNext = useCallback(() => setActiveIndex((i) => i + 1), [])

  /** Jump to a specific card by the shortest way round, so dots never spin the long way. */
  const goToCard = useCallback(
    (target: number) => setActiveIndex((i) => i + wrapOffset(target - modIndex(i, count), count)),
    [count],
  )

  // Target follows the active card. Under reduced motion the position snaps rather than
  // animating: no interpolation, no frame loop, no CSS transition standing in for one.
  useEffect(() => {
    targetRef.current = activeIndex
    if (reducedMotion) {
      positionRef.current = activeIndex
      paint(activeIndex)
      return
    }
    startLoop()
  }, [activeIndex, paint, reducedMotion, startLoop])

  // Paint once on mount so cards are positioned before any interaction.
  useEffect(() => {
    paint(positionRef.current)
  }, [paint, count])

  /**
   * Gates everything expensive on visibility: no video fetches and no frame loop until the
   * section is actually on screen, and both stop again when it leaves.
   */
  useEffect(() => {
    const node = stageRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '0px', threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) stopLoop()
  }, [inView, stopLoop])

  /**
   * Playback. Only the active card plays, and only while the section is on screen and the
   * visitor hasn't asked for reduced motion. Everything else is paused and rewound so it
   * re-enters at its poster frame rather than mid-shot.
   */
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      const shouldPlay = index === currentIndex && inView && !reducedMotion
      if (shouldPlay) {
        video.play().catch(() => {})
      } else {
        video.pause()
        if (index !== currentIndex) video.currentTime = 0
      }
    })
  }, [currentIndex, inView, reducedMotion, count])

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = muted
    })
  }, [muted, currentIndex])

  useEffect(() => stopLoop, [stopLoop])

  const stepWidth = useCallback(() => {
    const stage = stageRef.current
    const width = stage ? stage.clientWidth : 320
    return Math.max(120, width * DRAG_STEP_RATIO)
  }, [])

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    draggingRef.current = true
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    movedRef.current = 0
    dragOffsetRef.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return
      const dx = event.clientX - startXRef.current
      movedRef.current = Math.abs(dx)

      // Negative dx (dragging left) advances forward, matching the direction the cards travel.
      const raw = -dx / stepWidth()
      const target = targetRef.current
      // No end stops: the ring has no ends, so a drag is only limited to a single step so a
      // fast flick can't skip several cards at once.
      dragOffsetRef.current = clamp(raw, -1, 1)

      if (!reducedMotion) startLoop()
      else paint(target + dragOffsetRef.current)
    },
    [paint, reducedMotion, startLoop, stepWidth],
  )

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return
      const offset = dragOffsetRef.current
      draggingRef.current = false
      dragOffsetRef.current = 0
      pointerIdRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      // A drag past a quarter step commits to the next card; anything less springs back.
      const next = Math.abs(offset) > 0.25 ? activeIndex + (offset > 0 ? 1 : -1) : activeIndex

      if (next !== activeIndex) {
        setActiveIndex(next)
      } else {
        // Same card — re-run the loop so the rubber-banded position springs back to centre.
        targetRef.current = activeIndex
        if (reducedMotion) paint(activeIndex)
        else startLoop()
      }
    },
    [activeIndex, paint, reducedMotion, startLoop],
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    },
    [goNext, goPrev],
  )

  if (count === 0) return null

  return (
    <div className={className}>
      {/* Clipping wrapper. Cards fan out to ±124% of card width, which on a phone reaches well
          past the viewport and would widen the whole page. The symmetric py/-my pair extends
          the clip box vertically without changing layout height, so the cards' drop shadows
          survive instead of being sheared off at the card's own edge. */}
      <div className="-my-16 overflow-hidden py-16">
        <div
          ref={stageRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Recent jobs"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative mx-auto flex touch-pan-y select-none items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-4"
          style={{
            perspective: `${perspective}px`,
            WebkitPerspective: `${perspective}px`,
            width: '100%',
            cursor: 'grab',
          }}
        >
          {/* Sized box the cards stack inside — its 9:16 ratio is what gives the stage its
            height, so nothing needs a magic pixel min-height. */}
          <div
            className="relative"
            style={{
              width: `min(${cardWidthPercent}%, ${cardMaxWidth}px)`,
              aspectRatio: '9 / 16',
              transformStyle: 'preserve-3d',
            }}
          >
            {reels.map((reel, index) => (
              <div
                key={reel.src}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                onClick={() => {
                  // Tap a neighbour to bring it forward — but only if the pointer barely moved,
                  // so the end of a swipe doesn't register as a tap on whatever it landed under.
                  if (movedRef.current <= TAP_SLOP && index !== currentIndex) goToCard(index)
                }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: `${cornerRadius}px`,
                  background: cardBackground,
                  boxShadow: `0 14px 34px ${shadowColor}`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  src={reel.src}
                  poster={reel.poster}
                  muted={muted}
                  loop
                  playsInline
                  /* Always `none`, never bound to state. play() loads the media on its own, so
                     this alone stops the page fetching three videos up front — and keeping the
                     attribute constant is what makes playback reliable. Flipping it to `auto`
                     on the active card re-ran the media resource selection algorithm in the
                     same commit as the effect's play(), aborting that play and leaving every
                     card paused with no error surfaced (the rejection is swallowed below). */
                  preload="none"
                  aria-label={reel.label ?? `Recent job ${index + 1} of ${count}`}
                  draggable={false}
                  className="h-full w-full bg-black object-cover"
                />
              </div>
            ))}
          </div>

          {/* Controls track the CARD, not the stage. The stage has to stay wide enough for the
            fanned-out cards to have somewhere to go, so anchoring the arrows and mute button to
            its edges left them stranded hundreds of px away from the video they act on. This
            overlay re-centres a box of exactly card width and hangs the controls off that. */}
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <div
              className="relative h-full"
              style={{ width: `min(${cardWidthPercent}%, ${cardMaxWidth}px)` }}
            >
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                className="pointer-events-auto absolute bottom-4 right-4 z-[200] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              >
                {muted ? <MutedIcon /> : <SoundIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows live in this row rather than flanking the stage. Because the deck fans to one
          side, a right-hand arrow pinned beside the card always landed on top of the cards
          behind it; down here nothing overlaps and the three controls read as one group. */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {showArrows && <ArrowButton side="left" onClick={goPrev} />}

          <div className="flex items-center gap-2">
            {reels.map((reel, index) => (
              <button
                key={reel.src}
                type="button"
                onClick={() => goToCard(index)}
                aria-label={`Show job ${index + 1}`}
                aria-current={index === currentIndex}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${
                  index === currentIndex
                    ? 'w-8 bg-brand-teal'
                    : tone === 'dark'
                      ? 'w-2 bg-white/25 hover:bg-white/45'
                      : 'w-2 bg-brand-black/25 hover:bg-brand-black/40'
                }`}
              />
            ))}
          </div>

          {showArrows && <ArrowButton side="right" onClick={goNext} />}
        </div>
      )}
    </div>
  )
}

function ArrowButton({
  side,
  onClick,
  disabled = false,
}: {
  side: 'left' | 'right'
  onClick: () => void
  /** Unused while the ring is cyclic (there are no ends to stop at), kept for non-looping use. */
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous job' : 'Next job'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-black/10 bg-white text-brand-black shadow-md transition-all duration-300 hover:bg-brand-teal hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:opacity-25 disabled:shadow-none disabled:hover:bg-white disabled:hover:text-brand-black"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {side === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  )
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3 2.9-2.9-1.1-1.1L15.4 11l-2.9-2.9v7.8L15.4 13l2.9 2.9 1.1-1.1L16.5 12Z" />
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Zm11.5 3a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2Zm-2 -7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z" />
    </svg>
  )
}
