import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import useAnalytics from './hooks/useAnalytics'
import LocalBusinessSchema from './components/LocalBusinessSchema'
import PresentationBridge from './components/PresentationBridge'
import Home from './pages/Home'
import GarageFlooring from './pages/GarageFlooring'
import Commercial from './pages/Commercial'
import Residential from './pages/Residential'
import Patios from './pages/Patios'
import PoolDecks from './pages/PoolDecks'
import PolishedConcrete from './pages/PolishedConcrete'
import ConcreteCoatings from './pages/ConcreteCoatings'
import About from './pages/About'
import FlakeColorChart from './pages/FlakeColorChart'
import FlakeGallery from './pages/FlakeGallery'
import SolidColorChart from './pages/SolidColorChart'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ComingSoon from './pages/ComingSoon'

/**
 * Sanity Studio, loaded on demand. Every other page above is imported eagerly, and Studio must
 * not be: its dependency tree is larger than the whole marketing site, and a static import here
 * would put it in the bundle every visitor downloads to read about garage floors. React.lazy
 * keeps it in a separate chunk fetched only when someone opens /admin.
 */
const Admin = lazy(() => import('./pages/Admin'))

/**
 * Shown while that chunk downloads. Studio is a large download on a cold cache, so this is a
 * deliberate placeholder rather than a blank screen — on the site's black background, so it does
 * not flash white before Studio's own theme takes over.
 */
function StudioLoading() {
  return (
    <div
      style={{
        height: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#000000',
        color: 'rgba(255,255,255,0.6)',
        font: '14px system-ui, sans-serif',
      }}
    >
      Loading Studio…
    </div>
  )
}

export default function App() {
  // Called here rather than in a component beside <Routes> so its effect runs *after* the
  // active page's <Seo> effect has set document.title (child effects flush before parent).
  useAnalytics()
  const { pathname } = useLocation()

  /**
   * Studio takes over the viewport and renders none of the marketing chrome — no sticky header
   * overlapping its toolbars, no footer below a full-height app, no LocalBusiness schema on a
   * page that is not the business's, and no ScrollToTop fighting Studio's own routing.
   *
   * Returned before the site's <Routes> rather than added as another entry inside it, because the
   * chrome lives outside that element and could not be excluded from within it.
   */
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<StudioLoading />}>
        <Routes>
          {/* Splat: Studio routes internally beneath basePath '/admin' (src/admin/sanity.config.ts),
              so it must receive every path under the prefix, not just the bare one. */}
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <>
      {/* Scrolls to top on every route change (reference/BRIEF.md §6A) */}
      <ScrollToTop />
      {/* Renders nothing, and loads nothing, unless this page is inside Sanity Presentation's
          preview frame — see the component. */}
      <PresentationBridge />
      {/* Site-wide LocalBusiness structured data (reference/BRIEF.md §7) — present on every
          route, same as the header/footer. */}
      <LocalBusinessSchema />
      {/* Persistent sticky header on every page (reference/BRIEF.md §6A) */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garage-flooring" element={<GarageFlooring />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/residential" element={<Residential />} />
        <Route path="/patios" element={<Patios />} />
        <Route path="/pool-decks" element={<PoolDecks />} />
        <Route path="/polished-concrete" element={<PolishedConcrete />} />
        <Route path="/concrete-coatings" element={<ConcreteCoatings />} />
        <Route path="/about" element={<About />} />
        <Route path="/flake-color-chart" element={<FlakeColorChart />} />
        <Route path="/flake-color-chart/:slug" element={<FlakeGallery />} />
        <Route path="/solid-color-chart" element={<SolidColorChart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        {/* Any other unlisted route falls back to Coming Soon instead of a 404 (§6B) */}
        <Route path="*" element={<ComingSoon path="/" label="Page" noindex />} />
      </Routes>
      {/* Persistent footer on every page (reference/BRIEF.md §7, §8) */}
      <Footer />
    </>
  )
}
