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
        {/* Placeholder until the full About page (reference/BRIEF.md §9) is built — keeps the
            homepage "Read Full Story" CTA from 404-ing. */}
        <Route
          path="/about"
          element={
            <main className="flex min-h-screen items-center justify-center px-6 pt-24 text-center">
              <div>
                <h1 className="font-script text-4xl text-brand-teal sm:text-5xl">About Us</h1>
                <p className="mt-4 text-brand-black/70">Full story coming soon.</p>
              </div>
            </main>
          }
        />
        {/* Additional routes (Services, Contact, etc.) per reference/BRIEF.md §8 */}
      </Routes>
    </>
  )
}
