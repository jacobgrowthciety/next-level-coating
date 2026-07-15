import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
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
import Contact from './pages/Contact'
import ComingSoon from './pages/ComingSoon'

/** Sitemap routes without a real page yet (reference/BRIEF.md §6B, §8). `label` drives each
 * placeholder's per-route <title>/description (Seo audit fix — these used to all share Home's
 * head tags) instead of a generic "Coming Soon" for every one of them. */
const COMING_SOON_ROUTES = [
  { path: '/solid-color-chart', label: 'Solid Color Chart' },
  { path: '/blog', label: 'Blog' },
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms-conditions', label: 'Terms & Conditions' },
]

export default function App() {
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
        <Route path="/contact" element={<Contact />} />
        {COMING_SOON_ROUTES.map(({ path, label }) => (
          <Route key={path} path={path} element={<ComingSoon path={path} label={label} />} />
        ))}
        {/* Any other unlisted route falls back to Coming Soon instead of a 404 (§6B) */}
        <Route path="*" element={<ComingSoon path="/" label="Page" noindex />} />
      </Routes>
      {/* Persistent footer on every page (reference/BRIEF.md §7, §8) */}
      <Footer />
    </>
  )
}
