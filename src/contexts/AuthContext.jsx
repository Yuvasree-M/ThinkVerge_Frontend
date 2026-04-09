import { createContext, useContext, useState, useCallback } from 'react'
import { authApi, userApi } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.login(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user ?? { email: credentials.email, role: data.role }))
      setToken(data.token)
      setUser(data.user ?? { email: credentials.email, role: data.role })
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
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user ?? { email: payload.email, role: data.role }))
      setToken(data.token)
      setUser(data.user ?? { email: payload.email, role: data.role })
      toast.success('Account created!')
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await userApi.me()
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    } catch {}
  }, [])

  const role = user?.role?.toUpperCase()

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
