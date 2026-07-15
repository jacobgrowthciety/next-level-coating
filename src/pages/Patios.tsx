import PatiosIntro from '../sections/PatiosIntro'
import PatiosGallery from '../sections/PatiosGallery'
import PatiosDetails from '../sections/PatiosDetails'
import PatiosCTA from '../sections/PatiosCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Patios, Sidewalks & Driveways service page (reference/BRIEF.md §8 `/patios`, §9). */
export default function Patios() {
  return (
    <main>
      <Seo
        title="Concrete Patio Coatings | Next Level Coatings"
        description="100% UV-stable polyaspartic patio, sidewalk, and driveway coatings, 4X stronger than epoxy. Cooler underfoot, built for the Arizona sun. Free quotes."
        path="/patios"
        image="https://www.nextlevelcoatingsaz.com/services/patios/patios-01.webp"
      />
      <PatiosIntro />
      <PatiosGallery />
      <PatiosDetails />
      <PatiosCTA />
      <CallNowButton />
    </main>
  )
}
