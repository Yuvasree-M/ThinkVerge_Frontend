import clsx from 'clsx'

const COLORS = {
  blue:   { bg: 'bg-royal-50',  icon: 'bg-royal-gradient text-white', value: 'text-royal-700' },
  gold:   { bg: 'bg-gold-50',   icon: 'bg-gold-gradient text-white',  value: 'text-gold-700'  },
  green:  { bg: 'bg-emerald-50',icon: 'bg-emerald-500 text-white',    value: 'text-emerald-700'},
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-500 text-white',     value: 'text-purple-700'},
}

export default function StatCard({ label, value, icon: Icon, color = 'blue', trend }) {
  const c = COLORS[color]
  return (
    <div className={clsx('card flex items-center gap-4 animate-slide-up', c.bg)}>
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', c.icon)}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider">{label}</p>
        <p className={clsx('text-2xl font-display font-bold mt-0.5', c.value)}>{value}</p>
        {trend && <p className="text-xs text-emerald-600 font-medium mt-0.5">{trend}</p>}
      </div>
    </div>
  )
}
