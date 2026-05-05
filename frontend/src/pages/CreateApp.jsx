import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import StepIndicator from '../components/StepIndicator'
import Step1URL from '../components/steps/Step1URL'
import Step2Branding from '../components/steps/Step2Branding'
import Step3Features from '../components/steps/Step3Features'
import Step4Review from '../components/steps/Step4Review'
import BuildProgress from '../components/BuildProgress'

const INITIAL = {
  url: '', appName: '', packageName: '',
  theme: 'dark', primaryColor: '#667eea',
  permissions: ['internet'],
  pushNotifications: false, admob: false,
  admobAppId: '', admobBannerId: '',
  bottomNavLinks: [],
  customJs: '',
  buildType: 'apk',
  iconFile: null, iconPreview: null,
  splashFile: null, splashPreview: null,
}

export default function CreateApp() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [building, setBuilding] = useState(false)
  const [buildId, setBuildId] = useState(null)

  const update = (fields) => setForm(f => ({ ...f, ...fields }))

  const handleBuild = async () => {
    setBuilding(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'iconFile' || k === 'splashFile') {
          if (v) data.append(k, v)
        } else if (Array.isArray(v)) {
          data.append(k, JSON.stringify(v))
        } else if (v !== null && v !== undefined) {
          data.append(k, v)
        }
      })
      const res = await axios.post('/api/create-app', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setBuildId(res.data.buildId)
      toast.success('Build started! Tracking progress...')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Build failed. Check your inputs.')
      setBuilding(false)
    }
  }

  if (building) return <BuildProgress buildId={buildId} onReset={() => { setBuilding(false); setBuildId(null); setForm(INITIAL); setStep(0) }} />

  const steps = [
    <Step1URL form={form} update={update} />,
    <Step2Branding form={form} update={update} />,
    <Step3Features form={form} update={update} />,
    <Step4Review form={form} onBuild={handleBuild} />,
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-2 gradient-text">Create Your App</h1>
        <p className="text-slate-400 mb-8">Fill in the details below to generate your Android APK</p>
        <StepIndicator current={step} total={4} labels={['URL & Info', 'Branding', 'Features', 'Review']} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
          className="glass-card p-8 mt-8">
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
          className="glass px-6 py-3 rounded-xl font-semibold disabled:opacity-30 hover:bg-white/10 transition-colors">
          ← Back
        </button>
        {step < 3 && (
          <button onClick={() => setStep(s => s + 1)}
            className="gradient-bg px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity">
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
