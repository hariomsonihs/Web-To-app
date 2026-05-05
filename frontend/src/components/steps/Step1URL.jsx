import { useState } from 'react'
import { Globe, RefreshCw } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

function toPackageName(url, appName) {
  try {
    const host = new URL(url).hostname.replace('www.', '').split('.').reverse().join('.')
    const safe = appName.toLowerCase().replace(/[^a-z0-9]/g, '')
    return `${host}.${safe || 'app'}`
  } catch { return 'com.example.app' }
}

export default function Step1URL({ form, update }) {
  const [fetching, setFetching] = useState(false)

  const handleUrlChange = (url) => {
    update({ url, packageName: toPackageName(url, form.appName) })
  }

  const handleAppNameChange = (appName) => {
    update({ appName, packageName: toPackageName(form.url, appName) })
  }

  const fetchFavicon = async () => {
    if (!form.url) return toast.error('Enter a URL first')
    setFetching(true)
    try {
      const res = await axios.get(`/api/fetch-meta?url=${encodeURIComponent(form.url)}`)
      if (res.data.title && !form.appName) update({ appName: res.data.title })
      toast.success('Site info fetched!')
    } catch { toast.error('Could not fetch site info') }
    finally { setFetching(false) }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Website & App Info</h2>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Website URL *</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="url" placeholder="https://example.com" value={form.url}
              onChange={e => handleUrlChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <button onClick={fetchFavicon} disabled={fetching}
            className="glass px-4 py-3 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={fetching ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">Click the refresh button to auto-fetch app name from the website</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">App Name *</label>
        <input type="text" placeholder="My Awesome App" value={form.appName}
          onChange={e => handleAppNameChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Package Name *</label>
        <input type="text" placeholder="com.example.myapp" value={form.packageName}
          onChange={e => update({ packageName: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm" />
        <p className="text-xs text-slate-500 mt-1">Auto-generated from URL. Must be unique for Play Store.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Build Type</label>
        <div className="flex gap-3">
          {['apk', 'aab'].map(t => (
            <button key={t} onClick={() => update({ buildType: t })}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${form.buildType === t ? 'gradient-bg text-white' : 'glass text-slate-400 hover:text-white'}`}>
              {t.toUpperCase()} {t === 'apk' ? '(Direct Install)' : '(Play Store)'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
