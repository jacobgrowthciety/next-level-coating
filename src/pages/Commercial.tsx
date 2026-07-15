import CommercialIntro from '../sections/CommercialIntro'
import CommercialGallery from '../sections/CommercialGallery'
import CommercialDetails from '../sections/CommercialDetails'
import CommercialCTA from '../sections/CommercialCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Commercial service page (reference/BRIEF.md §8 `/commercial`, §9). */
export default function Commercial() {
  return (
    <main>
      <Seo
        title="Commercial Floor Coatings | Next Level Coatings"
        description="High-performance commercial polyaspartic coatings for warehouses, showrooms, and commercial kitchens. Slip-resistant, durable, and installed fast. Free quotes."
        path="/commercial"
        image="https://www.nextlevelcoatingsaz.com/services/commercial/commercial-01.webp"
      />
      <CommercialIntro />
      <CommercialGallery />
      <CommercialDetails />
      <CommercialCTA />
      <CallNowButton />
    </main>
  )
}
