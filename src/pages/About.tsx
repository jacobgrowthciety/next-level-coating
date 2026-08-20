import AboutIntro from '../sections/AboutIntro'
import AboutStory from '../sections/AboutStory'
import AboutCTA from '../sections/AboutCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** About page (reference/BRIEF.md §8 `/team-3`, §9 full founder story, §9A pattern). */
export default function About() {
  const { metaTitle, metaDescription, h1, bodyContent, ogImage } = usePageContent('/about')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={ogImage}
        path="/about"
      />
      <AboutIntro h1={h1} body={bodyContent} />
      <AboutStory />
      <AboutCTA />
      <CallNowButton />
    </main>
  )
}
