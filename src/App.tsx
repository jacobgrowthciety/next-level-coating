import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LocalBusinessSchema from './components/LocalBusinessSchema'
import Home from './pages/Home'
import GarageFlooring from './pages/GarageFlooring'
import About from './pages/About'
import ComingSoon from './pages/ComingSoon'

/** Sitemap routes without a real page yet (reference/BRIEF.md §6B, §8). `label` drives each
 * placeholder's per-route <title>/description (Seo audit fix — these used to all share Home's
 * head tags) instead of a generic "Coming Soon" for every one of them. */
const COMING_SOON_ROUTES = [
  { path: '/commercial', label: 'Commercial Concrete Coatings' },
  { path: '/residential', label: 'Residential Concrete Coatings' },
  { path: '/patios', label: 'Patios, Sidewalks & Driveways' },
  { path: '/pool-decks', label: 'Pool Deck Coatings' },
  { path: '/paver-sealing', label: 'Paver Sealing' },
  { path: '/grind-seal', label: 'Grind & Seal' },
  { path: '/polished-concrete', label: 'Polished Concrete' },
  { path: '/concrete-coatings', label: 'Concrete Coatings' },
  { path: '/flake-color-chart', label: 'Flake Color Chart' },
  { path: '/solid-color-chart', label: 'Solid Color Chart' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
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
        <Route path="/about" element={<About />} />
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
