import { useRef } from 'react'
import { Upload, Image } from 'lucide-react'

function ImageUpload({ label, hint, file, preview, onFile }) {
  const ref = useRef()
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div onClick={() => ref.current.click()}
        className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/50 transition-colors">
        {preview ? (
          <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-xl mx-auto" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Upload size={28} />
            <span className="text-sm">Click to upload</span>
            <span className="text-xs text-slate-500">{hint}</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const f = e.target.files[0]
          if (!f) return
          if (f.size > 2 * 1024 * 1024) { alert('Max 2MB'); return }
          onFile(f, URL.createObjectURL(f))
        }} />
    </div>
  )
}

const THEMES = ['dark', 'light', 'custom']

export default function Step2Branding({ form, update }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Branding & Design</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ImageUpload label="App Icon *" hint="512×512 PNG recommended"
          file={form.iconFile} preview={form.iconPreview}
          onFile={(f, p) => update({ iconFile: f, iconPreview: p })} />
        <ImageUpload label="Splash Screen" hint="1080×1920 PNG recommended"
          file={form.splashFile} preview={form.splashPreview}
          onFile={(f, p) => update({ splashFile: f, splashPreview: p })} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">App Theme</label>
        <div className="flex gap-3">
          {THEMES.map(t => (
            <button key={t} onClick={() => update({ theme: t })}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm capitalize transition-all ${form.theme === t ? 'gradient-bg text-white' : 'glass text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {form.theme === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
          <div className="flex items-center gap-4">
            <input type="color" value={form.primaryColor}
              onChange={e => update({ primaryColor: e.target.value })}
              className="w-16 h-12 rounded-lg cursor-pointer bg-transparent border-0" />
            <span className="font-mono text-slate-300">{form.primaryColor}</span>
          </div>
        </div>
      )}
    </div>
  )
}
