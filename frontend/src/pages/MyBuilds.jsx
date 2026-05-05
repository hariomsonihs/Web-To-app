import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Download, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

const statusIcon = { completed: CheckCircle, failed: XCircle, pending: Loader, building: Loader }
const statusColor = { completed: 'text-green-400', failed: 'text-red-400', pending: 'text-yellow-400', building: 'text-blue-400' }

export default function MyBuilds() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/builds').then(r => setBuilds(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20 text-slate-400">Loading builds...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black gradient-text mb-2">My Builds</h1>
      <p className="text-slate-400 mb-8">All your generated apps</p>

      {builds.length === 0 ? (
        <div className="glass-card p-16 text-center text-slate-400">
          <p className="text-lg">No builds yet.</p>
          <a href="/create" className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold inline-block mt-4">
            Create Your First App
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {builds.map((b, i) => {
            const Icon = statusIcon[b.status] || Loader
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="glass-card p-6 flex items-center gap-4">
                <Icon size={24} className={`${statusColor[b.status]} ${b.status === 'building' ? 'animate-spin' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{b.appName}</p>
                  <p className="text-sm text-slate-400 truncate">{b.url}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {new Date(b.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold uppercase ${statusColor[b.status]}`}>{b.status}</span>
                  {b.downloadUrl && (
                    <a href={b.downloadUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 mt-1">
                      <Download size={14} /> Download
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
