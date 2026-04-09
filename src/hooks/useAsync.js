import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export default function useAsync(asyncFn, { successMsg, errorMsg } = {}) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      if (successMsg) toast.success(successMsg)
      return result
    } catch (err) {
      const msg = errorMsg || err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn, successMsg, errorMsg])

  return { execute, loading, error }
}
