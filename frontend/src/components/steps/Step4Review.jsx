import { Smartphone, Globe, Package, Palette, Shield, Zap } from 'lucide-react'

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon size={16} className="text-purple-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-white truncate">{value || <span className="text-slate-500 italic">Not set</span>}</p>
      </div>
    </div>
  )
}

export default function Step4Review({ form, onBuild }) {
  const missing = []
  if (!form.url) missing.push('Website URL')
  if (!form.appName) missing.push('App Name')
  if (!form.packageName) missing.push('Package Name')
  if (!form.iconFile) missing.push('App Icon')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review & Build</h2>

      <div className="glass rounded-xl p-4">
        <Row icon={Globe} label="Website URL" value={form.url} />
        <Row icon={Smartphone} label="App Name" value={form.appName} />
        <Row icon={Package} label="Package Name" value={form.packageName} />
        <Row icon={Palette} label="Theme" value={`${form.theme}${form.theme === 'custom' ? ` (${form.primaryColor})` : ''}`} />
        <Row icon={Shield} label="Permissions" value={form.permissions.join(', ')} />
        <Row icon={Zap} label="Features" value={[
          form.pushNotifications && 'Push Notifications',
          form.admob && 'AdMob',
          form.bottomNavLinks.length > 0 && `${form.bottomNavLinks.length} Nav Links`,
          form.customJs && 'Custom JS',
        ].filter(Boolean).join(', ') || 'None'} />
        <Row icon={Package} label="Build Type" value={form.buildType.toUpperCase()} />
      </div>

      <div className="flex gap-4">
        {form.iconPreview && (
          <div className="text-center">
            <img src={form.iconPreview} alt="icon" className="w-16 h-16 rounded-2xl object-cover" />
            <p className="text-xs text-slate-500 mt-1">Icon</p>
          </div>
        )}
        {form.splashPreview && (
          <div className="text-center">
            <img src={form.splashPreview} alt="splash" className="w-10 h-16 rounded-lg object-cover" />
            <p className="text-xs text-slate-500 mt-1">Splash</p>
          </div>
        )}
      </div>

      {missing.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm font-medium mb-1">Missing required fields:</p>
          <ul className="text-red-300 text-sm list-disc list-inside">
            {missing.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      <button onClick={onBuild} disabled={missing.length > 0}
        className="w-full gradient-bg py-4 rounded-xl font-bold text-white text-lg disabled:opacity-40 hover:opacity-90 transition-opacity">
        🚀 Build My App
      </button>
      <p className="text-xs text-slate-500 text-center">Build takes 3–8 minutes via GitHub Actions</p>
    </div>
  )
}
