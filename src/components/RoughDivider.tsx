import maskUrl from '../assets/dividers/rough-edge-mask.png'

// Force luminance interpretation — the PNG's alpha is opaque, so alpha-masking would show
// everything; luminance uses the black/white RGB (white = keep fill, black = cut through).
// `WebkitMaskSourceType` is WebKit's equivalent for older Safari (< 15.4).
const maskStyle = {
  WebkitMaskImage: `url(${maskUrl})`,
  maskImage: `url(${maskUrl})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  maskMode: 'luminance',
  WebkitMaskSourceType: 'luminance',
} as React.CSSProperties

const HIGHLIGHT_OFFSET = 3 // px the teal outline peeks above the torn edge = stroke thickness

// Shared compact divider size for short-content sections (About Preview, Why Trust Us).
export const COMPACT_DIVIDER_HEIGHT = 'h-16 w-full sm:h-20 lg:h-24'

/**
 * Torn brush divider sitting at the TOP of a "rising" section (reference/BRIEF.md §4A, §2A).
 *
 * The frayed shape is solid at the bottom (connects seamlessly into the section body) and
 * frays upward. A thin brand-teal sliver traces the fray so it reads on any background.
 *
 * Works in both directions because the shape's COLOR is just the fill layer's background:
 * - `fillColor`   — the rising (lower) section's body color, painted in the brush shape.
 * - `revealColor` — what shows through the torn gaps above the fray:
 *     • omit it (transparent) to reveal a stickied section behind via z-index overlap
 *       (Hero → Why Trust Us: the frayed light shape reveals the dark hero video behind it).
 *     • pass the previous section's solid color for a self-contained boundary between two
 *       in-flow sections (Why Trust Us → Process: light reveal color above a dark fill).
 */
export default function RoughDivider({
  fillColor,
  revealColor,
  className = 'h-32 w-full sm:h-40 lg:h-52',
}: {
  fillColor: string
  revealColor?: string
  className?: string
}) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      {/* The reveal backing, as a layer rather than the wrapper's background so it can run 1px
          ABOVE the divider. The divider sits flush with the section's top edge, and that edge is
          usually on a fractional pixel — without the overhang the section's own (opposite-toned)
          background antialiases through on that row as a hairline. The 1px lands on the previous
          section, which is this exact colour, so nothing changes visually. */}
      {revealColor && (
        <div
          className="absolute inset-x-0 -top-px bottom-0"
          style={{ backgroundColor: revealColor }}
        />
      )}
      {/* Teal outline (behind, nudged up) — only the sliver above the fill's edge shows. */}
      <div
        className="absolute inset-0"
        style={{
          ...maskStyle,
          backgroundColor: '#41CAD2',
          transform: `translateY(-${HIGHLIGHT_OFFSET}px)`,
        }}
      />
      {/* Section-colored shape (top layer) — its solid lower portion joins the body below. */}
      <div className="absolute inset-0" style={{ ...maskStyle, backgroundColor: fillColor }} />
      {/* Seam guard. The fray is all at the TOP of the shape — the bottom is solid fill — so an
          opaque strip down here is invisible, but running it 1px past the divider box covers the
          sub-pixel seam where the divider meets the section body (see index.css). Painted last so
          it also hides the antialiased bottom edge of the revealColor backing. */}
      <div className="absolute inset-x-0 -bottom-px h-2" style={{ backgroundColor: fillColor }} />
    </div>
  )
}
