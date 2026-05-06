import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Download, Clock, CheckCircle, XCircle, Loader, RefreshCw, Edit2, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react'
import PhonePreview from '../components/PhonePreview'

const statusIcon = { completed: CheckCircle, failed: XCircle, pending: Loader, building: Loader }
const statusColor = { completed: 'text-green-400', failed: 'text-red-400', pending: 'text-yellow-400', building: 'text-blue-400' }

function BuildCard({ build, onRebuild, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [version, setVersion] = useState(build.versionName || '1.0')
  const Icon = statusIcon[build.status] || Loader

  const handleRebuild = async () => {
    try {
      await axios.post(`/api/rebuild/${build.id}`, { versionName: version })
      toast.success('Rebuild started!')
      onRebuild()
    } catch { toast.error('Rebuild failed') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this build?')) return
    try {
      await axios.delete(`/api/builds/${build.id}`)
      toast.success('Deleted')
      onDelete(build.id)
    } catch { toast.error('Delete failed') }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden">

      {/* Main row */}
      <div className="p-5 flex items-center gap-4">
        <Icon size={24} className={`${statusColor[build.status]} shrink-0 ${build.status === 'building' ? 'animate-spin' : ''}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{build.appName}</p>
            <span className="text-xs glass px-2 py-0.5 rounded-full text-slate-400">v{version}</span>
          </div>
          <p className="text-sm text-slate-400 truncate">{build.url}</p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock size={10} /> {new Date(build.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold uppercase ${statusColor[build.status]}`}>{build.status}</span>
          {build.downloadUrl && (
            <a href={build.downloadUrl} target="_blank" rel="noreferrer"
              className="gradient-bg p-2 rounded-lg text-white hover:opacity-90">
              <Download size={14} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="glass p-2 rounded-lg hover:bg-white/10 text-slate-400">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="border-t border-white/10 overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row gap-6">

              {/* Phone preview */}
              <div className="flex justify-center">
                <PhonePreview form={{
                  url: build.url, appName: build.appName,
                  packageName: build.packageName,
                  theme: build.theme || 'dark',
                  primaryColor: build.primaryColor || '#667eea',
                  iconPreview: build.iconUrl,
                  bottomNavLinks: build.bottomNavLinks || []
                }} />
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-4">
                <h3 className="font-semibold text-sm text-slate-300">Build Controls</h3>

                {/* Version */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Version Name</label>
                  <input value={version} onChange={e => setVersion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>

                {/* App details */}
                <div className="glass rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Package</span><span className="font-mono text-slate-300">{build.packageName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Theme</span><span className="text-slate-300">{build.theme}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Build Type</span><span className="text-slate-300">{build.buildType?.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Permissions</span><span className="text-slate-300">{build.permissions?.join(', ')}</span></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={handleRebuild}
                    className="flex-1 gradient-bg py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90">
                    <RefreshCw size={14} /> Rebuild
                  </button>
                  <button onClick={handleDelete}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 glass hover:bg-red-500/10 flex items-center gap-1">
                    <Trash2 size={14} />
                  </button>
                </div>

                {build.downloadUrl && (
                  <a href={build.downloadUrl} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full glass py-2 rounded-xl text-sm text-purple-400 hover:text-purple-300">
                    <Download size={14} /> Download APK
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MyBuilds() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBuilds = () => {
    axios.get('/api/builds').then(r => setBuilds(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchBuilds() }, [])

  const handleDelete = (id) => setBuilds(b => b.filter(x => x.id !== id))

  if (loading) return <div className="text-center py-20 text-slate-400">Loading builds...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black gradient-text">My Builds</h1>
          <p className="text-slate-400 mt-1">{builds.length} app{builds.length !== 1 ? 's' : ''} built</p>
        </div>
        <button onClick={fetchBuilds} className="glass p-3 rounded-xl hover:bg-white/10 text-slate-400">
          <RefreshCw size={18} />
        </button>
      </div>

      {builds.length === 0 ? (
        <div className="glass-card p-16 text-center text-slate-400">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-4">No builds yet</p>
          <a href="/create" className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold inline-block">
            Create Your First App
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {builds.map(b => (
            <BuildCard key={b.id} build={b} onRebuild={fetchBuilds} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
