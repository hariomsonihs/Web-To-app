import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Smartphone, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/create', label: 'Create App' },
  { to: '/builds', label: 'My Builds' },
  { to: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-bg p-2 rounded-lg">
            <Smartphone size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">WebToApp</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors ${pathname === l.to ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/create"
            className="gradient-bg px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            Build Now
          </Link>
        </div>

        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 flex flex-col gap-3 px-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5">
              {l.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  )
}
