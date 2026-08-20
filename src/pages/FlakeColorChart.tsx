import FlakeColorChartIntro from '../sections/FlakeColorChartIntro'
import FlakeColorChartGallery from '../sections/FlakeColorChartGallery'
import FlakeColorChartCTA from '../sections/FlakeColorChartCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Flake Color Chart page (reference/BRIEF.md §8 `/chip-color-chart`, §9). */
export default function FlakeColorChart() {
  const { metaTitle, metaDescription, h1, bodyContent, ogImage } = usePageContent('/flake-color-chart')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={ogImage}
        path="/flake-color-chart"
      />
      <FlakeColorChartIntro h1={h1} body={bodyContent} />
      <FlakeColorChartGallery />
      <FlakeColorChartCTA />
      <CallNowButton />
    </main>
  )
}
