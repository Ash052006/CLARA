import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthGate from './components/AuthGate'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <AuthGate>
      <Router>
        <div className="min-h-screen animated-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AuthGate>
  )
}

export default App
