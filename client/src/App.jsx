import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import History from './components/History'
import Admin from './components/Admin'

function App() {
  return (
    <>
      <Navigation />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  )
}

export default App
