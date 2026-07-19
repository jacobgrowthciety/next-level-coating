import { motion } from 'framer-motion'
import { fadeUp, scaleIn } from '../animations/variants'
import RoughDivider from '../components/RoughDivider'

// Dark section immediately following the compact header (reference/BRIEF.md §9A, §4A), same
// near-black shade FlakeColorChartGallery uses so the two in-flow dark sections (Intro's pure
// black vs. this one) read with shade variance rather than as one flat surface (§2A).
const SECTION_BG = '#141414'
const PREV_SECTION_BG = '#000000' // SolidColorChartIntro's section background

/**
 * Next Level Coatings' own available solid base coat colors. These hex values are the one
 * intentional exception to the teal/black/white/gray token system (§2A) — they're literal
 * product colors being displayed, not brand UI chrome. Every other element on this page
 * (background, text, card borders) stays strictly within the brand tokens.
 */
const SOLID_COLORS: { name: string; hex: string }[] = [
  { name: 'Light Gray', hex: '#C7C9CA' },
  { name: 'Mid Gray', hex: '#8B9297' },
  { name: 'Dark Concrete', hex: '#5A5D60' },
  { name: 'Concrete Gray', hex: '#8C8478' },
  { name: 'Beige', hex: '#E0B876' },
  { name: 'Sand', hex: '#DEC9A3' },
  { name: 'Tan', hex: '#EFC98B' },
  { name: 'Beachwood', hex: '#7C5245' },
  { name: 'White', hex: '#F1EEE9' },
  { name: 'Black', hex: '#16130F' },
  { name: 'Safety Yellow', hex: '#F0C419' },
  { name: 'Safety Red', hex: '#E9291C' },
  { name: 'Brick Red', hex: '#B23021' },
  { name: 'Pale Blue', hex: '#9DB6B6' },
  { name: 'Sapphire Blue', hex: '#2B2E6B' },
  { name: 'Forest Green', hex: '#14301B' },
]

/** Solid color swatch grid (reference/BRIEF.md §8 `/solid-color-chart`, §4 staged reveal).
 * Unlike the flake chart these are flat color values rather than photographed chip samples, so
 * there's nothing to enlarge — no lightbox here, just a labeled swatch grid. */
export default function SolidColorChartGrid() {
  return (
    <section className="relative z-20" style={{ backgroundColor: SECTION_BG }}>
      {/* Intro → Grid (dark → dark): near-black torn shape over Intro's pure black section
          above (revealColor), a self-contained boundary between two in-flow sections. */}
      <RoughDivider fillColor={SECTION_BG} revealColor={PREV_SECTION_BG} />

      <div className="px-6 pb-24 pt-4">
        <div className="mx-auto max-w-6xl">
          {/* 1 col mobile → 2 tablet → 3 desktop. Staggered scroll-triggered reveal (§4):
              delay keys off the column position so each row cascades left-to-right rather
              than the whole grid animating as one block. */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLID_COLORS.map((color, index) => (
              <motion.div
                key={color.hex}
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: (index % 3) * 0.08 }}
              >
                {/* Swatch: inner hairline border keeps the lightest colors (White, Sand) from
                    bleeding into the dark section, and the darkest (Black, Forest Green) from
                    disappearing into it. */}
                <div
                  className="aspect-[16/10] w-full rounded-lg shadow-lg shadow-black/40 ring-1 ring-inset ring-white/15"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-3 font-display text-lg uppercase tracking-tight text-white">
                  {color.name}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-white/50"
          >
            Colors shown are approximate. Actual color may vary slightly depending on lighting
            and screen settings.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
