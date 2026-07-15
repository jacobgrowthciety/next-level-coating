import ResidentialIntro from '../sections/ResidentialIntro'
import ResidentialGallery from '../sections/ResidentialGallery'
import ResidentialDetails from '../sections/ResidentialDetails'
import ResidentialCTA from '../sections/ResidentialCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Residential service page (reference/BRIEF.md §8 `/residential`, §9). */
export default function Residential() {
  return (
    <main>
      <Seo
        title="Residential Polyaspartic Floor Coating | Next Level Coatings"
        description="4X stronger than epoxy with a lifetime warranty. Our six-step polyaspartic process upgrades garages, patios, and pool decks. Licensed, bonded & insured. Free quotes."
        path="/residential"
        image="https://www.nextlevelcoatingsaz.com/services/residential/residential-01.webp"
      />
      <ResidentialIntro />
      <ResidentialGallery />
      <ResidentialDetails />
      <ResidentialCTA />
      <CallNowButton />
    </main>
  )
}
