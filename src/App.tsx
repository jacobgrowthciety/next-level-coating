import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import GarageFlooring from './pages/GarageFlooring'
import About from './pages/About'
import ComingSoon from './pages/ComingSoon'

/** Sitemap routes without a real page yet (reference/BRIEF.md §6B, §8). */
const COMING_SOON_ROUTES = [
  '/commercial',
  '/residential',
  '/patios',
  '/pool-decks',
  '/paver-sealing',
  '/grind-seal',
  '/polished-concrete',
  '/concrete-coatings',
  '/flake-color-chart',
  '/solid-color-chart',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms-conditions',
]

export default function App() {
  return (
    <>
      {/* Scrolls to top on every route change (reference/BRIEF.md §6A) */}
      <ScrollToTop />
      {/* Persistent sticky header on every page (reference/BRIEF.md §6A) */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garage-flooring" element={<GarageFlooring />} />
        <Route path="/about" element={<About />} />
        {COMING_SOON_ROUTES.map((path) => (
          <Route key={path} path={path} element={<ComingSoon />} />
        ))}
        {/* Any other unlisted route falls back to Coming Soon instead of a 404 (§6B) */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
      {/* Persistent footer on every page (reference/BRIEF.md §7, §8) */}
      <Footer />
    </>
  )
}
