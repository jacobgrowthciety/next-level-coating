import SolidColorChartIntro from '../sections/SolidColorChartIntro'
import SolidColorChartGrid from '../sections/SolidColorChartGrid'
import SolidColorChartCTA from '../sections/SolidColorChartCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Solid Color Chart page (reference/BRIEF.md §8 `/solid-color-chart`, §9A).
 *
 * NOTE: the old site's version of this page lived at the Wix auto-duplicate slug
 * `/copy-of-paver-sealing` and had no unique copy at all — just two vendor-branded images
 * (§11 flagged it as needing real copy). This page is written fresh and fully in-brand: no
 * vendor logos, branding, or third-party color chart links. */
export default function SolidColorChart() {
  return (
    <main>
      <Seo
        title="Solid Color Chart | Next Level Coatings"
        description="Browse our solid polyaspartic garage floor color options — 16 single-color base coat shades, from concrete grays to safety colors. Get a free quote from Arizona's top concrete coating specialists."
        path="/solid-color-chart"
      />
      <SolidColorChartIntro />
      <SolidColorChartGrid />
      <SolidColorChartCTA />
      <CallNowButton />
    </main>
  )
}
