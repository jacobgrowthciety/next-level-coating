import GarageFlooringIntro from '../sections/GarageFlooringIntro'
import GarageFlooringGallery from '../sections/GarageFlooringGallery'
import GarageFlooringDetails from '../sections/GarageFlooringDetails'
import GarageFlooringCTA from '../sections/GarageFlooringCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Garage Flooring — flagship service page (reference/BRIEF.md §8 `/garage-flooring`, §9, §9A). */
export default function GarageFlooring() {
  return (
    <main>
      <Seo
        title="Garage Floor Coating in Arizona | Next Level Coatings"
        description="1-day polyaspartic garage floor coatings, 4X stronger than epoxy, with a lifetime warranty. Serving Phoenix, Surprise, Peoria & the Valley. Free quotes."
        path="/garage-flooring"
        image="https://www.nextlevelcoatingsaz.com/services/garage-flooring/Garage-Flooring-5.webp"
      />
      <GarageFlooringIntro />
      <GarageFlooringGallery />
      <GarageFlooringDetails />
      <GarageFlooringCTA />
      <CallNowButton />
    </main>
  )
}
