import PolishedConcreteIntro from '../sections/PolishedConcreteIntro'
import PolishedConcreteGallery from '../sections/PolishedConcreteGallery'
import PolishedConcreteDetails from '../sections/PolishedConcreteDetails'
import PolishedConcreteCTA from '../sections/PolishedConcreteCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/**
 * Polished Concrete service page (reference/BRIEF.md §8 `/polished-concrete`, §9).
 *
 * NOTE: the old site's version of this page (/copy-of-grind-seal) had no body copy, only a
 * 7-photo gallery (6 of the 7 were retrievable — see PolishedConcreteGallery). The body copy
 * below is newly written to match the voice/structure of the other 6 service pages and has
 * NOT been sourced from or verified against the old site. Flagged for Jacob to review before
 * launch.
 *
 * No reviews section — no clean review match exists yet. The one review that mentions polished
 * concrete only does so to say the customer chose grind-and-seal instead because it looked
 * similar for less money, so using it here would misrepresent this service. Add a real review
 * once a polished concrete job has one.
 */
export default function PolishedConcrete() {
  return (
    <main>
      <Seo
        title="Polished Concrete Flooring | Next Level Coatings"
        description="Diamond-ground and honed polished concrete flooring, a sleek, low-maintenance finish with no topical coating to maintain. Free quotes."
        path="/polished-concrete"
        image="https://www.nextlevelcoatingsaz.com/services/polished-concrete/polished-concrete-01.webp"
      />
      <PolishedConcreteIntro />
      <PolishedConcreteGallery />
      <PolishedConcreteDetails />
      <PolishedConcreteCTA />
      <CallNowButton />
    </main>
  )
}
