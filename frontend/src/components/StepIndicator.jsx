export default function StepIndicator({ current, total, labels }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${i < current ? 'gradient-bg text-white' : i === current ? 'gradient-bg text-white ring-4 ring-purple-500/30' : 'bg-white/10 text-slate-500'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === current ? 'text-purple-400' : 'text-slate-500'}`}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < current ? 'gradient-bg' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
