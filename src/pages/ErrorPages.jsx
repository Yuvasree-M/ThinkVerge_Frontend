import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Layers } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        <div className="w-20 h-20 rounded-2xl bg-royal-gradient flex items-center justify-center mx-auto mb-6 shadow-royal-lg">
          <Layers size={32} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-navy-900 text-6xl mb-2">404</h1>
        <p className="font-display font-semibold text-navy-700 text-xl mb-2">Page not found</p>
        <p className="text-slate-lms text-sm mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Go Home</Link>
      </div>
    </div>
  )
}

export function UnauthorizedPage() {
  const { role } = useAuth()
  const home = role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student'
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h1 className="font-display font-bold text-navy-900 text-3xl mb-2">Access Denied</h1>
        <p className="text-slate-lms text-sm mb-8 max-w-sm">You don't have permission to view this page.</p>
        <Link to={home} className="btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  )
}
