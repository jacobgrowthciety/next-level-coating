import SolidColorChartIntro from '../sections/SolidColorChartIntro'
import SolidColorChartGrid from '../sections/SolidColorChartGrid'
import SolidColorChartCTA from '../sections/SolidColorChartCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Solid Color Chart page (reference/BRIEF.md §8 `/solid-color-chart`, §9A).
 *
 * NOTE: the old site's version of this page lived at the Wix auto-duplicate slug
 * `/copy-of-paver-sealing` and had no unique copy at all — just two vendor-branded images
 * (§11 flagged it as needing real copy). This page is written fresh and fully in-brand: no
 * vendor logos, branding, or third-party color chart links. */
export default function SolidColorChart() {
  const { metaTitle, metaDescription, h1, bodyContent, ogImage } = usePageContent('/solid-color-chart')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={ogImage}
        path="/solid-color-chart"
      />
      <SolidColorChartIntro h1={h1} body={bodyContent} />
      <SolidColorChartGrid />
      <SolidColorChartCTA />
      <CallNowButton />
    </main>
  )
}
