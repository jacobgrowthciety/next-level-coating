/**
 * The flake swatch catalog — single source of truth for the identifiers, display names and
 * order-only status used by `/flake-color-chart` (the swatch grid) and
 * `/flake-color-chart/:slug` (the per-color project gallery).
 *
 * Identifiers double as public URL segments and as the `flakeSlug` value on the `flakeGallery`
 * Sanity document, so they are effectively permanent — renaming one changes a live URL and
 * orphans any gallery document pointing at the old value. That's why the positional ones
 * (`flake-02`) keep their names even though the real color is "Raven": the *identifier* is a
 * key, the *name* is presentation. Studio mirrors this list (src/admin/schemas/flakeGallery.ts);
 * update both together.
 *
 * Names and order-only status were transcribed from the text printed inside each swatch image
 * (each photo has its color name and, where applicable, an "*Order only*" note baked in) and
 * cross-checked against the color list from the previous site. `orderOnly` lives here rather
 * than in Sanity because it's a fixed product attribute, not editorial content, and because the
 * grid renders with no Sanity fetch at all — a Sanity-only flag could never reach it.
 *
 * The source photos (up to 4480px, ~3.9MB each) were far larger than anything either view
 * renders, so each id ships as two WebP derivatives (quality 80): `-600` for the grid card and
 * `-1600` for the lightbox. Extensions are omitted below since every entry is `.webp`.
 */

export interface FlakeColor {
  /** Identifier — also the URL segment and the Sanity `flakeSlug` value. Never change these. */
  id: string
  /** Display name, as printed on the swatch image. A gallery document's `title` overrides it. */
  name: string
  /** Special-order color — not held in regular stock. Surfaced as a subtle badge. */
  orderOnly: boolean
  /** 600px WebP derivative for the grid card. */
  thumb: string
  /** 1600px WebP derivative for the lightbox. */
  full: string
  /** Descriptive alt text, built from the real color name. */
  alt: string
}

/**
 * id → display name, in on-page grid order.
 *
 * Two deliberate deviations from the printed labels:
 *  - "Arctic Volt" is spelled correctly here; the swatch image and the old site's URL both read
 *    "Artic". The typo is baked into the image pixels, but the name is user-facing copy and a
 *    search term, so the corrected spelling wins.
 *  - Qualifiers are kept ("Premium Blend", the 1"/1/4" flake sizes) because they distinguish
 *    otherwise-colliding names: "Domino" vs "Domino Premium 1\"", and the two Nester grinds.
 */
const CATALOG: { id: string; name: string; orderOnly?: true }[] = [
  { id: 'domino', name: 'Domino' }, // replaced flake-01
  { id: 'flake-02', name: 'Raven' },
  { id: 'flake-04', name: 'Pumice' },
  { id: 'flake-05', name: 'Tidal Wave' },
  { id: 'outback', name: 'Outback' }, // replaced flake-06
  { id: 'cabin-fever', name: 'Cabin Fever' }, // replaced flake-07
  { id: 'flake-08', name: 'Galaxy' },
  { id: 'nightfall', name: 'Nightfall' }, // replaced flake-09
  { id: 'flake-10', name: 'Denali Blue' },
  { id: 'flake-11', name: 'Nester 1" (Premium Blend)' },
  { id: 'flake-12', name: 'Nester 1/4" (Premium Blend)' },
  { id: 'flake-13', name: 'Gravel' },
  { id: 'flake-14', name: 'Schist' },
  { id: 'flake-15', name: 'Slate', orderOnly: true },
  { id: 'flake-16', name: 'Garnet' },
  { id: 'flake-17', name: 'Basalt' },
  { id: 'flake-18', name: 'Keystone', orderOnly: true },
  { id: 'shoreline', name: 'Shoreline' }, // replaced flake-19
  { id: 'flake-20', name: 'Slate Red', orderOnly: true },
  { id: 'flake-21', name: 'Glacier Blue', orderOnly: true },
  { id: 'flake-22', name: 'Arctic Volt', orderOnly: true },
  { id: 'flake-23', name: 'Domino Premium 1"', orderOnly: true },
  { id: 'flake-24', name: 'Iron Red', orderOnly: true },
  { id: 'flake-25', name: 'Madras', orderOnly: true },
  { id: 'flake-26', name: 'Midnight Granite (Premium Blend)' },
  { id: 'flake-27', name: 'Marsh', orderOnly: true },
  { id: 'flake-28', name: 'Dolerite' },
]

export const FLAKE_COLORS: FlakeColor[] = CATALOG.map(({ id, name, orderOnly }) => ({
  id,
  name,
  orderOnly: orderOnly === true,
  thumb: `/images/flake-colors/${id}-600.webp`,
  full: `/images/flake-colors/${id}-1600.webp`,
  // Now that the real names are structured data, alt text names the actual color instead of the
  // old generic "chip sample N of 27" placeholder.
  alt: `${name} flake color chip sample for polyaspartic floor coatings by Next Level Coatings`,
}))

/** Look up a swatch by identifier — used by the gallery route to validate its `:slug` param. */
export function getFlakeColor(id: string | undefined): FlakeColor | undefined {
  return id ? FLAKE_COLORS.find((c) => c.id === id) : undefined
}
