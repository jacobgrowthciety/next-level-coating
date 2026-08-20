import GarageFlooringIntro from '../sections/GarageFlooringIntro'
import GarageFlooringGallery from '../sections/GarageFlooringGallery'
import GarageFlooringDetails from '../sections/GarageFlooringDetails'
import GarageFlooringCTA from '../sections/GarageFlooringCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Garage Flooring — flagship service page (reference/BRIEF.md §8 `/garage-flooring`, §9, §9A). */
export default function GarageFlooring() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/garage-flooring')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/garage-flooring"
        image={ogImage}
      />
      <GarageFlooringIntro h1={h1} body={bodyContent} />
      <GarageFlooringGallery />
      <GarageFlooringDetails sections={bodySections} />
      <GarageFlooringCTA />
      <CallNowButton />
    </main>
  )
}
