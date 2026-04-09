import clsx from 'clsx'

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className={clsx(
        'rounded-full border-2 border-royal-100 border-t-royal-500 animate-spin',
        sizes[size]
      )} />
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-3 border-royal-100 border-t-royal-500 animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
        <p className="text-sm text-slate-lms">Loading...</p>
      </div>
    </div>
  )
}
