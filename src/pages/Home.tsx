import Hero from '../sections/Hero'
import FeaturedProjects from '../sections/FeaturedProjects'
import ServicesGrid from '../sections/ServicesGrid'
import MidPageCTA from '../sections/MidPageCTA'
import Process from '../sections/Process'
import Reviews from '../sections/Reviews'
import FinalCTA from '../sections/FinalCTA'
import Seo from '../components/Seo'
import CallNowButton from '../components/CallNowButton'
import { usePageContent } from '../lib/pageContent'

/**
 * Homepage narrative order: introduce the company, prove it with real work, say what's offered,
 * offer a quote, explain how the job runs, reinforce with reviews, close.
 *
 * The About teaser that used to sit between Process and Services is gone from this flow — it
 * interrupted the run-up to the quote without moving anyone toward it. /about and its nav link
 * are untouched.
 *
 * Section backgrounds run dark → charcoal → near-black → teal → black → light → teal, so the top
 * half of the page holds one continuous dark surface instead of alternating light and dark on
 * every section. Each section owns its own colour and its top divider names the colour above it;
 * if this order ever changes, those `PREV_SECTION_BG` constants and the ascending z-index on each
 * <section> both have to move with it.
 */
export default function Home() {
  const { metaTitle, metaDescription, ogImage } = usePageContent('/')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={ogImage}
        path="/"
      />
      <Hero />
      <FeaturedProjects />
      <ServicesGrid />
      <MidPageCTA />
      <Process />
      <Reviews />
      <FinalCTA />
      <CallNowButton />
    </main>
  )
}
