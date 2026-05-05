import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Download as DownloadIcon, ArrowLeft } from 'lucide-react'

export default function Download() {
  const { buildId } = useParams()
  const [build, setBuild] = useState(null)

  useEffect(() => {
    axios.get(`/api/build-status/${buildId}`).then(r => setBuild(r.data)).catch(() => {})
  }, [buildId])

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <div className="glass-card p-10">
        {!build ? (
          <p className="text-slate-400">Loading...</p>
        ) : build.status === 'completed' ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-black mb-2">{build.appName}</h1>
            <p className="text-slate-400 mb-6">{build.url}</p>
            <a href={build.downloadUrl} target="_blank" rel="noreferrer"
              className="gradient-bg px-8 py-4 rounded-xl font-bold text-white text-lg inline-flex items-center gap-2 hover:opacity-90">
              <DownloadIcon size={20} /> Download APK
            </a>
          </>
        ) : (
          <p className="text-slate-400">Build status: {build.status}</p>
        )}
        <Link to="/builds" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white mt-6 text-sm">
          <ArrowLeft size={14} /> Back to My Builds
        </Link>
      </div>
    </div>
  )
}
