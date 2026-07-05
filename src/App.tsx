import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Additional routes (About, Services, Contact, etc.) per reference/BRIEF.md §8 */}
    </Routes>
  )
}
