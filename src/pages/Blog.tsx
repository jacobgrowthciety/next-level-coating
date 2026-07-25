import BlogIntro from '../sections/BlogIntro'
import BlogList from '../sections/BlogList'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Blog listing page (`/blog`) — replaces the former Coming Soon placeholder. */
export default function Blog() {
  return (
    <main>
      <Seo
        title="Blog | Next Level Coatings"
        description="Concrete coating guides, project spotlights, and expert tips from Next Level Coatings — serving Phoenix, Surprise, Peoria and the Arizona Valley."
        path="/blog"
      />
      <BlogIntro />
      <BlogList />
      <CallNowButton />
    </main>
  )
}
