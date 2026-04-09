import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }) {
  const { token } = useAuth()
  const location  = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function RequireRole({ roles, children }) {
  const { role } = useAuth()
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />
  return children
}

export function GuestOnly({ children }) {
  const { token, role } = useAuth()
  if (token) {
    const dest = role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student'
    return <Navigate to={dest} replace />
  }
  return children
}
