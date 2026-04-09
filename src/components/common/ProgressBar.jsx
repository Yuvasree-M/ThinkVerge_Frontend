import clsx from 'clsx'

export default function ProgressBar({ value = 0, max = 100, color = 'royal', label, showPercent = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    royal: 'bg-royal-gradient',
    gold:  'bg-gold-gradient',
    green: 'bg-emerald-500',
    red:   'bg-red-500',
  }
  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-navy-600">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-royal-600">{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-royal-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
