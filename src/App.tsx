import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import useAnalytics from './hooks/useAnalytics'
import LocalBusinessSchema from './components/LocalBusinessSchema'
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
import SolidColorChart from './pages/SolidColorChart'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  // Called here rather than in a component beside <Routes> so its effect runs *after* the
  // active page's <Seo> effect has set document.title (child effects flush before parent).
  useAnalytics()

  return (
    <>
      {/* Scrolls to top on every route change (reference/BRIEF.md §6A) */}
      <ScrollToTop />
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
