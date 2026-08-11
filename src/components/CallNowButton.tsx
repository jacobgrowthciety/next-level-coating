import { useEffect, useState } from 'react'
import { trackClickToCall } from '../lib/analytics'

/** Matches the fixed header height (h-20 on Header's NAV_BAR) — see HERO_TRIGGER_MARGIN. */
const HEADER_HEIGHT = 80

/**
 * The hero's CTAs are considered "gone" only once they have cleared the fixed 80px header, not
 * once they cross the raw viewport top — they are already hidden *behind* the header for those
 * last 80px, so keying off y=0 brought the bar in late. Shifting the observer root down by the
 * header height also gives the trigger some distance from any single scroll position, which is
 * what stops the bar strobing when a slow scroll parks right on the boundary.
 */
const HERO_TRIGGER_MARGIN = `-${HEADER_HEIGHT}px 0px 0px 0px`

/**
 * Shrinks the observer root to the bottom 45% of the viewport, so a `data-sticky-cta-avoid`
 * element only counts as being in the pill's way once it has scrolled down into that band. See
 * the suppression effect below for why the zone is this size.
 */
const ZONE_MARGIN = '-55% 0px 0px 0px'

/** How long every show condition must hold before the bar comes in. See the gate near the JSX. */
const SHOW_DELAY = 400

/**
 * Persistent mobile "Call Now" bar — a floating dark-glass pill above the bottom edge on touch/
 * small screens (BRIEF.md §5, §6), held off-screen until the visitor has scrolled past the hero's
 * own CTAs. Showing it immediately at the top of the page would sit on top of (or duplicate) the
 * hero's full-width phone CTA.
 *
 * WHY IT FLOATS RATHER THAN BLEEDS. This used to be a full-bleed teal slab whose height was
 * `calc(3rem + env(safe-area-inset-bottom))` with the inset re-reserved as padding-bottom. iOS
 * Safari reports that inset as 0 while its bottom toolbar is expanded and ~34px once it collapses,
 * so the bar grew to ~82px mid-scroll while its contents stayed centered in the top 48px — the
 * "content isn't centered once the browser chrome goes away" symptom, plus a bar that visibly
 * resized as you scrolled. Putting the safe-area inset on an outer wrapper's padding instead, and
 * making the visible element a self-contained pill inside it, removes the failure mode
 * structurally: the pill has no safe-area math in it at all, so its contents are centered in every
 * chrome state and its height never changes. The wrapper's padding is what lifts it clear of the
 * home indicator.
 *
 * The shell is dark glass with a teal pill inside rather than a solid teal slab, mirroring the
 * header's own `bg-black/25 backdrop-blur-md` + teal pill treatment so the top and bottom of the
 * screen read as one system. Capped at `max-w-sm` so it stays a floating control on large phones
 * instead of stretching into a second navigation bar.
 *
 * Desktop keeps `md:hidden`: the header's Call Now pill is always on screen there, so a second
 * persistent phone CTA would just be the same control twice.
 */
export default function CallNowButton() {
  /** Has the visitor scrolled past the hero's CTAs (or, with no hero, far enough down)? */
  const [pastHero, setPastHero] = useState(false)
  /** Is something on screen that the bar must not cover — the footer, or an open keyboard? */
  const [suppressed, setSuppressed] = useState(false)

  useEffect(() => {
    const anchor = document.querySelector('[data-hero-cta]') ?? document.getElementById('hero')

    /* Pages with no hero at all (Contact, Blog, legal) fall back to scroll position. The show and
       hide thresholds differ on purpose — a single threshold flips on every pixel of jitter around
       it, which on a momentum scroll reads as a flicker. */
    if (!anchor) {
      let shown = false
      function onScroll() {
        if (!shown && window.scrollY > window.innerHeight * 0.6) {
          shown = true
          setPastHero(true)
        } else if (shown && window.scrollY < window.innerHeight * 0.45) {
          shown = false
          setPastHero(false)
        }
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    /* On pages with a hero, visibility is driven by an IntersectionObserver. What it observes is
       the hero's own CTA pair (`[data-hero-cta]`, set in sections/Hero.tsx), not the hero section
       itself: the bar needs to arrive the moment those CTAs scroll away, and the mobile hero runs
       ~1000px tall, so keying off the whole section left a long stretch where the hero's CTAs were
       gone but the bar hadn't come in yet — the page had no visible call to action at all through
       it. Observing the CTAs still guarantees the two can never be on screen together, which was
       the original reason for the gate. Falls back to `#hero` if the marker is ever missing. */
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: HERO_TRIGGER_MARGIN,
    })
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [])

  /**
   * Three things the bar must yield to, tracked together because they resolve to one flag.
   *
   * 1. THE FOOTER carries the phone number, address and hours, so a floating phone CTA on top of
   *    it is redundant at best and covering the real thing at worst.
   * 2. A FOCUSED FORM FIELD — on any page with a form (Contact especially) a fixed bottom element
   *    lands squarely over the submit button once the iOS keyboard pushes the layout up.
   * 3. ANYTHING MARKED `data-sticky-cta-avoid` — currently the reel carousel's prev/next arrows
   *    and dots (components/ReelOrbit.tsx), which sit at the bottom of that block and end up
   *    underneath the pill.
   *
   * On (3): the obvious fix, padding the section, does not actually work. A fixed overlay covers
   * whatever happens to be at the bottom edge of the viewport, and adding space *below* the
   * controls doesn't move them relative to any given scroll position — it only moves the next
   * section down.
   *
   * So the bar yields instead, and the whole design of this rule is choosing how long for. Hiding
   * only for the ~76px band where the two literally overlap is too little: that band is crossed in
   * a few hundred milliseconds of ordinary scrolling, so the bar would blink out and back on the
   * way past — worse than the overlap. Marking the whole carousel is too much: it is over 600px
   * tall, so the bar would be gone for something like a viewport and a half of the homepage, which
   * is the exact failure the hero gate above was rewritten to avoid.
   *
   * ZONE_MARGIN is the middle: the marked element counts as in the way only while it is inside the
   * bottom 45% of the viewport. Applied to the ~48px control row that is roughly 430px of scroll —
   * long enough that the hide and the show are two clearly separate events rather than a flicker,
   * short enough that the CTA is present for the rest of the section. The marker is an attribute
   * rather than a hard-coded selector so any future interactive block can opt out the same way.
   */
  useEffect(() => {
    const footer = document.querySelector('footer')
    const avoid = document.querySelectorAll('[data-sticky-cta-avoid]')

    let atFooter = false
    let editing = false
    const overlapping = new Set<Element>()
    const sync = () => setSuppressed(atFooter || editing || overlapping.size > 0)

    const footerObserver = footer
      ? new IntersectionObserver(
          ([entry]) => {
            atFooter = entry.isIntersecting
            sync()
          },
          { rootMargin: '0px 0px -24px 0px' },
        )
      : undefined
    footerObserver?.observe(footer!)

    /* One observer for every marked block — entries arrive per element, so the Set is what
       keeps two of them on screen at once from cancelling each other out. */
    const avoidObserver = avoid.length
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) overlapping.add(entry.target)
              else overlapping.delete(entry.target)
            }
            sync()
          },
          { rootMargin: ZONE_MARGIN },
        )
      : undefined
    avoid.forEach((el) => avoidObserver?.observe(el))

    function onFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select')) {
        editing = true
        sync()
      }
    }
    function onFocusOut() {
      editing = false
      sync()
    }

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      footerObserver?.disconnect()
      avoidObserver?.disconnect()
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  /**
   * The bar hides the instant it becomes ineligible, but only appears after it has been eligible
   * continuously for SHOW_DELAY.
   *
   * The gates above are independent, and where two of their boundaries land close together the
   * page gets a sliver of scroll that satisfies all of them — on the homepage the hero gate opens
   * about 160px before the carousel's controls reach the zone, so the bar would pop in and
   * straight back out on the way past. Tuning the geometry until those boundaries meet would fix
   * this one instance and stay fixed only until a section moved.
   *
   * Requiring the eligible state to hold for a moment fixes it as a class: any window narrower
   * than a scroll-flick never materialises, no matter which two rules produced it. Slivers wider
   * than that still show, which is correct — if the visitor has come to rest somewhere the bar
   * belongs, it belongs there. Hiding stays immediate, because every hide rule exists to get out
   * of the way of something and none of them should wait.
   *
   * It also happens to read better at the top of the page: the bar rises in once the scroll has
   * settled rather than the instant the hero's CTAs clip the header.
   */
  const [visible, setVisible] = useState(false)
  const eligible = pastHero && !suppressed

  useEffect(() => {
    if (!eligible) {
      setVisible(false)
      return
    }
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY)
    return () => clearTimeout(timer)
  }, [eligible])

  return (
    /* Outer wrapper: owns the safe-area inset and the motion, and nothing else. `pointer-events-
       none` so the transparent gutter either side of the pill never eats a tap meant for the page
       under it — the pill re-enables them for itself.

       The entrance travels 16px with a fade rather than the pill's full height, over 450ms on an
       expo-out curve. The old version slid a full-bleed slab its entire height at 300ms on the
       default easing, which is what made it read as a slam; a short, decelerating rise with the
       opacity ramping in lets it settle instead of arrive. */
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {/* Glass shell. A 4px rim around the 48px pill puts the whole control at 56px — a floating
          object with visible page on all four sides, not a second nav bar.

          The rim is deliberately thin and lightly tinted rather than the 6px/50% it started at.
          The site alternates dark sections with light ones (the cream band under the contact form,
          the teal CTA bands), and a thick 50%-black ring reads as glass only over the dark ones —
          over cream it rendered as a heavy grey frame that looked like a rendering mistake. At 4px
          and 35% it stays a halo separating the pill from whatever is behind it in both cases,
          with the drop shadow doing most of the lifting on light backgrounds. */}
      <div
        className={`mx-auto max-w-sm rounded-full border border-white/10 bg-black/35 p-1 shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-md ${
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* 3rem (48px) is the floor for the tappable pill, not a value to keep tuning down: it
            matches the 48px minimum touch target and clears Apple's 44pt guideline. Because the
            whole pill is the tap area there is no padding to trade away — slimming further would
            start costing accuracy on a control whose entire job is being easy to hit one-handed. */}
        <a
          href="tel:+16232241097"
          onClick={trackClickToCall}
          tabIndex={visible ? 0 : -1}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-teal text-center text-sm font-semibold text-brand-black transition-colors active:bg-brand-teal/85"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
          </svg>
          Call Now · (623) 224-1097
        </a>
      </div>
    </div>
  )
}
