import GarageFlooringIntro from '../sections/GarageFlooringIntro'
import GarageFlooringGallery from '../sections/GarageFlooringGallery'
import GarageFlooringDetails from '../sections/GarageFlooringDetails'
import GarageFlooringCTA from '../sections/GarageFlooringCTA'
import CallNowButton from '../components/CallNowButton'

/** Garage Flooring — flagship service page (reference/BRIEF.md §8 `/garage-flooring`, §9, §9A). */
export default function GarageFlooring() {
  return (
    <main>
      <GarageFlooringIntro />
      <GarageFlooringGallery />
      <GarageFlooringDetails />
      <GarageFlooringCTA />
      <CallNowButton />
    </main>
  )
}
