import { Studio } from 'sanity'
import { Helmet } from 'react-helmet-async'
import config from '../admin/sanity.config'

/**
 * Sanity Studio, mounted at /admin on the marketing site.
 *
 * This module is the code-splitting boundary: App.tsx pulls it in with React.lazy, so Studio's
 * dependency tree — which is larger than the entire marketing site — lands in its own chunk and
 * is downloaded only by someone who actually opens /admin. Importing `sanity` anywhere reachable
 * from the eager graph would undo that and put it in front of every visitor, so keep this the
 * only such import outside src/admin/.
 *
 * Studio renders its own full-height application shell and expects a sized container; without an
 * explicit height it collapses, since the marketing layout has nothing setting one. `100dvh`
 * rather than `100vh` so mobile browser chrome does not push the bottom toolbar off screen.
 *
 * App.tsx also withholds the site header, footer and schema markup on this route — see there.
 */
export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Studio | Next Level Coatings</title>
        {/* An admin surface has no business in search results. The route is also disallowed in
            public/robots.txt; this covers the case of a crawler reaching it via a link. */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ height: '100dvh' }}>
        <Studio config={config} />
      </div>
    </>
  )
}
