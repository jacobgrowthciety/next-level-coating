import PoolDecksIntro from '../sections/PoolDecksIntro'
import PoolDecksGallery from '../sections/PoolDecksGallery'
import PoolDecksDetails from '../sections/PoolDecksDetails'
import PoolDecksCTA from '../sections/PoolDecksCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Pool Decks service page (reference/BRIEF.md §8 `/pool-decks`, §9). */
export default function PoolDecks() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/pool-decks')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/pool-decks"
        image={ogImage}
      />
      <PoolDecksIntro h1={h1} body={bodyContent} />
      <PoolDecksGallery />
      <PoolDecksDetails sections={bodySections} />
      <PoolDecksCTA />
      <CallNowButton />
    </main>
  )
}
