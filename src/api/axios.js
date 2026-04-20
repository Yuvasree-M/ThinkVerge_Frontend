import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // ✅ send HttpOnly cookie with every request
})

// ✅ NO localStorage token injection — backend uses HttpOnly JWT cookie
// Having two browsers inject the same localStorage token caused 403 for the second user

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
