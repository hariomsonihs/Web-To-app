import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const PERMISSIONS = [
  { id: 'internet', label: 'Internet', required: true },
  { id: 'camera', label: 'Camera' },
  { id: 'storage', label: 'Storage' },
  { id: 'location', label: 'Location' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'microphone', label: 'Microphone' },
]

export default function Step3Features({ form, update }) {
  const [navLink, setNavLink] = useState({ label: '', url: '' })

  const togglePerm = (id) => {
    if (id === 'internet') return
    const perms = form.permissions.includes(id)
      ? form.permissions.filter(p => p !== id)
      : [...form.permissions, id]
    update({ permissions: perms })
  }

  const addNavLink = () => {
    if (!navLink.label || !navLink.url) return
    update({ bottomNavLinks: [...form.bottomNavLinks, navLink] })
    setNavLink({ label: '', url: '' })
  }

  const removeNavLink = (i) => update({ bottomNavLinks: form.bottomNavLinks.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Features & Permissions</h2>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Permissions</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PERMISSIONS.map(p => (
            <button key={p.id} onClick={() => togglePerm(p.id)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left ${form.permissions.includes(p.id) ? 'gradient-bg text-white' : 'glass text-slate-400 hover:text-white'} ${p.required ? 'opacity-70 cursor-default' : ''}`}>
              {p.label} {p.required && <span className="text-xs">(required)</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Optional Features</label>
        {[
          { key: 'pushNotifications', label: 'Firebase Push Notifications' },
          { key: 'admob', label: 'AdMob Ads' },
        ].map(f => (
          <div key={f.key} className="flex items-center justify-between glass p-4 rounded-xl">
            <span className="text-sm">{f.label}</span>
            <button onClick={() => update({ [f.key]: !form[f.key] })}
              className={`w-12 h-6 rounded-full transition-all relative ${form[f.key] ? 'gradient-bg' : 'bg-white/10'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form[f.key] ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {form.admob && (
        <div className="space-y-3">
          <input type="text" placeholder="AdMob App ID (ca-app-pub-xxx~xxx)" value={form.admobAppId}
            onChange={e => update({ admobAppId: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
          <input type="text" placeholder="Banner Ad Unit ID (ca-app-pub-xxx/xxx)" value={form.admobBannerId}
            onChange={e => update({ admobBannerId: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Bottom Navigation Links (optional)</label>
        <div className="flex gap-2 mb-3">
          <input type="text" placeholder="Label" value={navLink.label}
            onChange={e => setNavLink(n => ({ ...n, label: e.target.value }))}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
          <input type="url" placeholder="https://..." value={navLink.url}
            onChange={e => setNavLink(n => ({ ...n, url: e.target.value }))}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
          <button onClick={addNavLink} className="gradient-bg px-3 py-2 rounded-xl text-white">
            <Plus size={16} />
          </button>
        </div>
        {form.bottomNavLinks.map((l, i) => (
          <div key={i} className="flex items-center justify-between glass p-3 rounded-xl mb-2 text-sm">
            <span>{l.label} → {l.url}</span>
            <button onClick={() => removeNavLink(i)} className="text-red-400 hover:text-red-300">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Custom JavaScript Injection (optional)</label>
        <textarea rows={4} placeholder="// JavaScript to inject into every page load" value={form.customJs}
          onChange={e => update({ customJs: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm resize-none" />
      </div>
    </div>
  )
}
