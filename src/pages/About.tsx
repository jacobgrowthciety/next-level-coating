import AboutIntro from '../sections/AboutIntro'
import AboutStory from '../sections/AboutStory'
import AboutCTA from '../sections/AboutCTA'
import CallNowButton from '../components/CallNowButton'

/** About page (reference/BRIEF.md §8 `/team-3`, §9 full founder story, §9A pattern). */
export default function About() {
  return (
    <main>
      <AboutIntro />
      <AboutStory />
      <AboutCTA />
      <CallNowButton />
    </main>
  )
}
