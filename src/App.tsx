import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      {/* Persistent sticky header on every page (reference/BRIEF.md §6A) */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Additional routes (About, Services, Contact, etc.) per reference/BRIEF.md §8 */}
      </Routes>
    </>
  )
}
