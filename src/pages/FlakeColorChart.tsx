import FlakeColorChartIntro from '../sections/FlakeColorChartIntro'
import FlakeColorChartGallery from '../sections/FlakeColorChartGallery'
import FlakeColorChartCTA from '../sections/FlakeColorChartCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Flake Color Chart page (reference/BRIEF.md §8 `/chip-color-chart`, §9). */
export default function FlakeColorChart() {
  return (
    <main>
      <Seo
        title="Flake Color Chart | Next Level Coatings"
        description="Browse 28 flake color options for your polyaspartic garage floor coating. Tap any color to see it up close, then get a free quote from Arizona's top concrete coating specialists."
        path="/flake-color-chart"
      />
      <FlakeColorChartIntro />
      <FlakeColorChartGallery />
      <FlakeColorChartCTA />
      <CallNowButton />
    </main>
  )
}
