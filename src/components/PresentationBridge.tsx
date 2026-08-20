import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { HistoryAdapterNavigate } from '@sanity/visual-editing'

/**
 * Answers Sanity Presentation's connection handshake when the site is being previewed.
 *
 * Presentation loads the real site in an iframe and then opens a two-way channel to a
 * visual-editing runtime on the page. With nothing listening, that attempt times out and editors
 * get "Unable to connect, check the browser console" over their preview — the site is fine and
 * rendering behind it, but the tool reads as broken.
 *
 * Scope, deliberately: the connection ONLY. No click-to-edit, because that needs stega-encoded
 * content — the Sanity client emitting invisible marker characters inside every string, which
 * would flow into this site's <title> and meta description. Not a risk worth taking on a site
 * whose whole point is search ranking. No draft preview either: Presentation frames production,
 * which serves published content.
 *
 * TWO CONSTRAINTS SHAPE THIS FILE — change either and it breaks in ways that are hard to trace:
 *
 * 1. It uses `enableVisualEditing` from the package root, NOT the `/react-router` entry. That
 *    entry calls `useRevalidator`, which throws "must be used within a data router" on a plain
 *    <BrowserRouter> — and because it throws during render inside the frame, it takes the whole
 *    page down with it. The blank preview is worse than the banner it was meant to fix.
 *
 * 2. The `@sanity/visual-editing` major must match the Studio's. Presentation talks over
 *    @sanity/comlink, and Studio (sanity 3.99) is on comlink v3 / presentation-comlink v1.
 *    visual-editing v4+ moved to comlink v4 / presentation-comlink v2, and the two sides then
 *    cannot complete a handshake — the banner appears exactly as if nothing were mounted at all.
 *    v3.x is the line that pairs with Studio v3. Re-check this when upgrading either side.
 *
 * Real visitors are unaffected: it renders nothing and imports nothing unless the page is framed.
 */
export default function PresentationBridge() {
  const [framed, setFramed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Presentation's callback for "the site navigated" — held in a ref so the effect that reports
  // navigation does not have to re-run (and re-enable the runtime) on every route change.
  const reportNavigation = useRef<HistoryAdapterNavigate | null>(null)

  useEffect(() => {
    let inFrame: boolean
    try {
      inFrame = window.self !== window.top
    } catch {
      // Reading window.top across origins throws a security error — and only a framed page can
      // be in that position, so the throw is itself the answer.
      inFrame = true
    }
    setFramed(inFrame)
  }, [])

  useEffect(() => {
    if (!framed) return

    let disable: (() => void) | undefined
    let cancelled = false

    import('@sanity/visual-editing').then(({ enableVisualEditing }) => {
      // The import is async, so the component can unmount before it lands.
      if (cancelled) return
      disable = enableVisualEditing({
        history: {
          // Presentation hands us a callback to notify it when the site navigates itself.
          subscribe: (cb) => {
            reportNavigation.current = cb
            return () => {
              reportNavigation.current = null
            }
          },
          // Presentation driving the site: someone changed the URL in the preview toolbar, or
          // opened a document whose location resolves elsewhere.
          update: (update) => {
            if (update.type === 'push' || update.type === 'replace') {
              navigate(update.url, { replace: update.type === 'replace' })
            } else if (update.type === 'pop') {
              navigate(-1)
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      disable?.()
    }
  }, [framed, navigate])

  // The other direction: clicking a link inside the preview should move Studio's URL bar too.
  useEffect(() => {
    reportNavigation.current?.({
      type: 'push',
      url: `${location.pathname}${location.search}${location.hash}`,
    })
  }, [location])

  return null
}
