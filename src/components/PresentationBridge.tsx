import { lazy, Suspense, useEffect, useState } from 'react'

/**
 * Answers Sanity Presentation's connection handshake when the site is being previewed.
 *
 * Presentation loads the real site in an iframe and then tries to open a two-way channel to a
 * visual-editing runtime on the page. With nothing listening, that attempt times out and editors
 * are met with "Unable to connect, check the browser console" over their preview — the site is
 * fine and rendering behind it, but the tool reads as broken. Mounting this makes the handshake
 * succeed, and lets Presentation and the site keep their URLs in step as you navigate.
 *
 * Scope, deliberately: this is the connection ONLY. There is no click-to-edit here, because that
 * needs stega-encoded content — the Sanity client emitting invisible marker characters inside
 * every string it returns. Those characters would flow straight into this site's <title> and meta
 * description, which is not a risk worth taking on a site whose whole point is search ranking.
 * Drafts are not shown either: the preview frames production, which serves published content.
 *
 * Two things keep this off the critical path for real visitors:
 *   1. It renders nothing at all unless the page is inside a frame.
 *   2. The runtime is a dynamic import, so its chunk is only ever fetched in that case.
 * A visitor reading about garage floors downloads none of it.
 */
const VisualEditing = lazy(() =>
  import('@sanity/visual-editing/react-router').then((m) => ({ default: m.VisualEditing })),
)

export default function PresentationBridge() {
  const [framed, setFramed] = useState(false)

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

  // Checked in an effect rather than during render because it is a browser-only fact; this also
  // keeps the very first render identical for everyone.
  if (!framed) return null

  return (
    <Suspense fallback={null}>
      <VisualEditing />
    </Suspense>
  )
}
