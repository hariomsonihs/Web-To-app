import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Wifi, WifiOff, Battery, Signal } from 'lucide-react'

export default function PhonePreview({ form }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const bgColor = form.theme === 'light' ? '#ffffff' : form.theme === 'custom' ? form.primaryColor + '22' : '#121212'
  const textColor = form.theme === 'light' ? '#000000' : '#ffffff'
  const barColor = form.primaryColor || '#667eea'

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Live Preview</p>

      {/* Phone frame */}
      <div className="relative w-[220px] h-[440px] rounded-[2.5rem] border-4 border-slate-600 shadow-2xl overflow-hidden"
        style={{ background: bgColor }}>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-10" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-6 pb-1" style={{ color: textColor }}>
          <span className="text-[10px] font-bold">{time}</span>
          <div className="flex items-center gap-1">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-1/2 rounded-full mx-auto mb-1" style={{ background: barColor }} />

        {/* App bar */}
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: barColor }}>
          {form.iconPreview ? (
            <img src={form.iconPreview} className="w-5 h-5 rounded" alt="icon" />
          ) : (
            <div className="w-5 h-5 rounded bg-white/30" />
          )}
          <span className="text-white text-xs font-semibold truncate">
            {form.appName || 'My App'}
          </span>
        </div>

        {/* WebView area */}
        <div className="flex-1 overflow-hidden" style={{ height: '320px', background: bgColor }}>
          {form.url ? (
            <iframe
              src={form.url}
              className="w-full h-full border-0 pointer-events-none"
              style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
              sandbox="allow-scripts allow-same-origin"
              title="preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
              <Smartphone size={32} style={{ color: textColor }} />
              <p className="text-xs" style={{ color: textColor }}>Enter URL to preview</p>
            </div>
          )}
        </div>

        {/* Bottom nav if links exist */}
        {form.bottomNavLinks?.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex border-t border-white/10"
            style={{ background: bgColor }}>
            {form.bottomNavLinks.slice(0, 4).map((l, i) => (
              <div key={i} className="flex-1 py-2 text-center">
                <p className="text-[8px] truncate px-1" style={{ color: textColor }}>{l.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/30" />
      </div>

      {/* App info below phone */}
      <div className="text-center">
        <p className="text-xs font-semibold text-white">{form.appName || 'App Name'}</p>
        <p className="text-xs text-slate-500">{form.packageName || 'com.example.app'}</p>
      </div>
    </div>
  )
}
