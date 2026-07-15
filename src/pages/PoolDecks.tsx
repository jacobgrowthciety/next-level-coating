import PoolDecksIntro from '../sections/PoolDecksIntro'
import PoolDecksGallery from '../sections/PoolDecksGallery'
import PoolDecksDetails from '../sections/PoolDecksDetails'
import PoolDecksCTA from '../sections/PoolDecksCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Pool Decks service page (reference/BRIEF.md §8 `/pool-decks`, §9). */
export default function PoolDecks() {
  return (
    <main>
      <Seo
        title="Polyaspartic Pool Deck Coating | Next Level Coatings"
        description="Non-slip, 100% UV-stable polyaspartic pool deck coatings that stay cool underfoot. Double diamond ground and full-flake finished. Free quotes."
        path="/pool-decks"
        image="https://www.nextlevelcoatingsaz.com/services/pool-decks/pool-decks-01.webp"
      />
      <PoolDecksIntro />
      <PoolDecksGallery />
      <PoolDecksDetails />
      <PoolDecksCTA />
      <CallNowButton />
    </main>
  )
}
