import GarageFlooringIntro from '../sections/GarageFlooringIntro'
import GarageFlooringDetails from '../sections/GarageFlooringDetails'
import GarageFlooringCTA from '../sections/GarageFlooringCTA'
import CallNowButton from '../components/CallNowButton'

/** Garage Flooring — flagship service page (reference/BRIEF.md §8 `/garage-flooring`, §9). */
export default function GarageFlooring() {
  return (
    <main>
      <GarageFlooringIntro />
      <GarageFlooringDetails />
      <GarageFlooringCTA />
      <CallNowButton />
    </main>
  )
}
