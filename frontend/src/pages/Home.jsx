import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Smartphone, Zap, Shield, Download, ArrowRight, Globe, Palette, Bell } from 'lucide-react'

const features = [
  { icon: Globe, title: 'Any Website', desc: 'Convert any website URL into a native Android WebView app instantly.' },
  { icon: Zap, title: 'Fast Build', desc: 'GitHub Actions builds your APK automatically in minutes.' },
  { icon: Palette, title: 'Custom Branding', desc: 'Set your own icon, splash screen, colors and app name.' },
  { icon: Bell, title: 'Push Notifications', desc: 'Optional Firebase push notification integration.' },
  { icon: Shield, title: 'Secure', desc: 'Input validation, sanitization and safe build pipeline.' },
  { icon: Download, title: 'Direct Download', desc: 'Download APK or AAB ready for Play Store submission.' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-purple-300 mb-6">
          <Zap size={14} /> Free • No Code • Instant APK
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Turn Any Website Into<br />
          <span className="gradient-text">Android App</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          Enter your URL, customize your app, and download a production-ready APK — completely free using GitHub Actions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create"
            className="gradient-bg px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center gap-2 justify-center hover:opacity-90 transition-opacity">
            Start Building <ArrowRight size={20} />
          </Link>
          <Link to="/docs"
            className="glass px-8 py-4 rounded-xl font-bold text-slate-300 text-lg hover:text-white transition-colors">
            How It Works
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }} className="glass-card p-6 hover:border-purple-500/30 transition-colors">
            <div className="gradient-bg w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <f.icon size={22} className="text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Steps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-8 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Enter URL & App Info', 'Upload Icon & Splash', 'Configure Features', 'Download APK'].map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg">
                {i + 1}
              </div>
              <p className="text-sm text-slate-300 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
