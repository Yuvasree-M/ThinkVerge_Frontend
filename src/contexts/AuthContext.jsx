
// import { createContext, useContext, useState, useCallback, useEffect } from 'react'
// import { useQueryClient } from '@tanstack/react-query'
// import { authApi, userApi } from '../api/services'
// import api from '../api/axios'
// import toast from 'react-hot-toast'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const queryClient = useQueryClient()

//   const refreshUser = useCallback(async () => {
//     const token = localStorage.getItem('jwt')
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     try {
//       const { data } = await userApi.me()
//       setUser(data)
//     } catch {
//       localStorage.removeItem('jwt')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => { refreshUser() }, [refreshUser])

//   const login = useCallback(async (credentials) => {
//     setLoading(true)
//     try {
//       const { data } = await authApi.login(credentials)

//       if (data.token) {
//         localStorage.setItem('jwt', data.token)
//       }

//       const loggedInUser = data.user ?? { email: credentials.email, role: data.role, name: data.name }
//       setUser(loggedInUser)

//       const role = loggedInUser.role?.toUpperCase()
//       if (role === 'STUDENT') {
//         queryClient.prefetchQuery({
//           queryKey: ['student-dashboard'],
//           queryFn: () => api.get('/dashboard/student').then(r => r.data),
//           staleTime: 60_000,
//         })
//       } else if (role === 'INSTRUCTOR') {
//         queryClient.prefetchQuery({
//           queryKey: ['my-courses'],
//           queryFn: () => api.get('/courses/instructor/my').then(r => r.data),
//           staleTime: 60_000,
//         })
//       } else if (role === 'ADMIN') {
//         queryClient.prefetchQuery({
//           queryKey: ['all-courses-admin'],
//           queryFn: () => api.get('/courses/admin/all').then(r => r.data),
//           staleTime: 60_000,
//         })
//       }

//       toast.success('Welcome back!')
//       return data
//     } finally {
//       setLoading(false)
//     }
//   }, [queryClient])

//   const register = useCallback(async (payload) => {
//     setLoading(true)
//     try {
//       const { data } = await authApi.register(payload)
//       toast.success('Registration submitted! Await admin approval before logging in.')
//       return data
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const logout = useCallback(async () => {
//     try { await authApi.logout() } catch {}
//     localStorage.removeItem('jwt')
//     queryClient.clear()
//     setUser(null)
//     toast.success('Logged out successfully')
//   }, [queryClient])

//   const role = user?.role?.toUpperCase()

//   return (
//     // ✅ setUser added to context value
//     <AuthContext.Provider value={{ user, setUser, role, loading, login, register, logout, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider')
//   return ctx
// }

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi, userApi } from '../api/services'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const queryClient           = useQueryClient()

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

      if (data.token) {
        localStorage.setItem('jwt', data.token)
      }

      const loggedInUser = data.user ?? { email: credentials.email, role: data.role, name: data.name }
      setUser(loggedInUser)

      // Prefetch dashboard data in the background while redirect animation plays
      const role = loggedInUser.role?.toUpperCase()
      if (role === 'STUDENT') {
        queryClient.prefetchQuery({
          queryKey: ['student-dashboard'],
          queryFn: () => api.get('/dashboard/student').then(r => r.data),
          staleTime: 60_000,
        })
      } else if (role === 'INSTRUCTOR') {
        queryClient.prefetchQuery({
          queryKey: ['my-courses'],
          queryFn: () => api.get('/courses/instructor/my').then(r => r.data),
          staleTime: 60_000,
        })
      } else if (role === 'ADMIN') {
        queryClient.prefetchQuery({
          queryKey: ['all-courses-admin'],
          queryFn: () => api.get('/courses/admin/all').then(r => r.data),
          staleTime: 60_000,
        })
      }

      toast.success('Welcome back!')
      return data
    } finally {
      setLoading(false)
    }
  }, [queryClient])

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
    localStorage.removeItem('jwt')
    queryClient.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }, [queryClient])

  const role = user?.role?.toUpperCase()

  return (
    <AuthContext.Provider value={{ user, setUser, role, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
