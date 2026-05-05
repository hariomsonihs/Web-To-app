import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateApp from './pages/CreateApp'
import MyBuilds from './pages/MyBuilds'
import Docs from './pages/Docs'
import Download from './pages/Download'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateApp />} />
        <Route path="/builds" element={<MyBuilds />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/download/:buildId" element={<Download />} />
      </Routes>
    </div>
  )
}
