import AboutIntro from '../sections/AboutIntro'
import AboutStory from '../sections/AboutStory'
import AboutCTA from '../sections/AboutCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** About page (reference/BRIEF.md §8 `/team-3`, §9 full founder story, §9A pattern). */
export default function About() {
  return (
    <main>
      <Seo
        title="About Us | Next Level Coatings"
        description="Meet Chase Gray and the family-owned team behind Next Level Coatings, bringing top-tier concrete coatings to homes and businesses across Arizona since 2020."
        path="/about"
      />
      <AboutIntro />
      <AboutStory />
      <AboutCTA />
      <CallNowButton />
    </main>
  )
}
