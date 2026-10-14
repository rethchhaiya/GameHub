import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111318] text-white">
      <h1 className="text-4xl font-bold text-purple-400">
        GameHub 🎮
      </h1>
      <p className="text-gray-400">
        Your gaming community starts here.
      </p>
      <Link
        to="/explore"
        className="rounded-lg bg-purple-600 px-5 py-2 font-medium hover:bg-purple-500"
      >
        Explore Games
      </Link>
    </main>
  )
}

function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#111318] p-8 text-white">
      <h1 className="text-3xl font-bold">Explore Games</h1>
      <p className="mt-2 text-gray-400">
        Game discovery will be built here.
      </p>
      <Link to="/" className="mt-4 inline-block text-purple-400 hover:underline">
        Back to Home
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App