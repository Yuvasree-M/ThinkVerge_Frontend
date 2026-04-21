import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi, userApi } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on app load from localStorage token
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('jwt')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await userApi.me()
      setUser(data)
    } catch {
      // Token invalid/expired — clear it
      localStorage.removeItem('jwt')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.login(credentials)
      // ✅ Save token to localStorage
      if (data.token) {
        localStorage.setItem('jwt', data.token)
      }
      setUser(data.user ?? { email: credentials.email, role: data.role, name: data.name })
      toast.success('Welcome back!')
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await authApi.register(payload)
      toast.success('Registration submitted! Await admin approval before logging in.')
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    // ✅ Remove token from localStorage
    localStorage.removeItem('jwt')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const role = user?.role?.toUpperCase()

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}