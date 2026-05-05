import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const STEPS = ['Uploading images', 'Generating Android project', 'Triggering build', 'Building APK', 'Finalizing']

export default function BuildProgress({ buildId, onReset }) {
  const [status, setStatus] = useState('pending')
  const [currentStep, setCurrentStep] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!buildId) return
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/build-status/${buildId}`)
        const { status: s, step, downloadUrl: url } = res.data
        setStatus(s)
        if (step !== undefined) setCurrentStep(step)
        if (url) setDownloadUrl(url)
        if (s === 'completed' || s === 'failed') clearInterval(interval)
      } catch { /* retry */ }
    }, 5000)
    return () => clearInterval(interval)
  }, [buildId])

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10">
        {status === 'completed' ? (
          <>
            <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Build Complete!</h2>
            <p className="text-slate-400 mb-6">Your APK is ready to download</p>
            <a href={downloadUrl} target="_blank" rel="noreferrer"
              className="gradient-bg px-8 py-4 rounded-xl font-bold text-white inline-block hover:opacity-90 transition-opacity">
              ⬇ Download APK
            </a>
            <button onClick={onReset} className="block mx-auto mt-4 text-slate-400 hover:text-white text-sm">
              Build another app
            </button>
          </>
        ) : status === 'failed' ? (
          <>
            <XCircle size={64} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Build Failed</h2>
            <p className="text-slate-400 mb-6">Something went wrong. Check your inputs and try again.</p>
            <button onClick={onReset} className="gradient-bg-2 px-8 py-4 rounded-xl font-bold text-white">
              Try Again
            </button>
          </>
        ) : (
          <>
            <Loader size={64} className="text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Building Your App</h2>
            <p className="text-slate-400 mb-8">This takes 3–8 minutes. Don't close this tab.</p>
            <div className="space-y-3 text-left">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 text-sm transition-all ${i < currentStep ? 'text-green-400' : i === currentStep ? 'text-white' : 'text-slate-600'}`}>
                  <span>{i < currentStep ? '✓' : i === currentStep ? '⟳' : '○'}</span>
                  {s}
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
