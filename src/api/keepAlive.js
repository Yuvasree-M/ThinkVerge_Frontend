const BACKEND = import.meta.env.VITE_BASE_URL?.replace('/api', '') ?? ''

export function startKeepAlive() {
  if (!BACKEND) return
  const ping = () => fetch(`${BACKEND}/actuator/health`, { method: 'GET' }).catch(() => {})
  ping() 
  setInterval(ping, 14 * 60 * 1000)
}