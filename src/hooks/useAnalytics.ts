import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Sends a GA4 page_view on each client-side route change.
 *
 * The gtag.js snippet in index.html fires exactly one page_view, for the document that actually
 * loaded. React Router navigations never reload the document, so without this every in-session
 * navigation was invisible to GA4 — sessions and events landed, but per-route pageview counts
 * only ever credited the entry page.
 *
 * Deliberately does not re-`config` gtag; that would re-initialize the tag on every navigation.
 * A plain page_view event carrying the page_* params is what GA4 expects for SPA routing.
 */
export default function useAnalytics() {
  const location = useLocation()

  // Seeded with the path the document loaded at — the one gtag('config') has already reported —
  // so the landing page isn't counted twice. Tracking the last-sent path rather than a
  // "have we run once?" boolean also keeps the effect idempotent under StrictMode's double
  // invoke in dev, which would otherwise slip a duplicate past a one-shot guard.
  const lastPath = useRef(window.location.pathname)

  useEffect(() => {
    const { pathname, search, hash } = location
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    // Built from the router's own location rather than re-read from window.location at send
    // time, so page_location can never disagree with page_path — reading the two from
    // different sources at different moments is how they drift apart mid-navigation.
    const url = `${window.location.origin}${pathname}${search}${hash}`

    // react-helmet-async commits the route's new <title> during an animation frame, so a
    // synchronous send (or one deferred by a timer) reports the *previous* route's title.
    const frame = requestAnimationFrame(() => {
      // A newer navigation that landed while this frame was pending supersedes it; without
      // this guard the callback would pair that route's document.title with this route's path.
      if (lastPath.current !== pathname) return

      window.gtag?.('event', 'page_view', {
        page_path: pathname,
        page_location: url,
        page_title: document.title,
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [location])
}
