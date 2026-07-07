import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import GarageFlooring from './pages/GarageFlooring'
import About from './pages/About'

export default function App() {
  return (
    <>
      {/* Persistent sticky header on every page (reference/BRIEF.md §6A) */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garage-flooring" element={<GarageFlooring />} />
        <Route path="/about" element={<About />} />
        {/* Additional routes (Services, Contact, etc.) per reference/BRIEF.md §8 */}
      </Routes>
      {/* Persistent footer on every page (reference/BRIEF.md §7, §8) */}
      <Footer />
    </>
  )
}
