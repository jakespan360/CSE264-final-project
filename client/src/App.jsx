import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'

function App() {
  return (
    <>
      <Navigation />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  )
}

export default App
