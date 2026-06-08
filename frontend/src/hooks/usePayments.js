import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function usePayments(apiUrl) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)

  const refresh = useCallback(() => {
    axios.get(`${apiUrl}/payments`)
      .then(r => setPayments(r.data))
      .finally(() => setLoading(false))
  }, [apiUrl])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [refresh])

  const add = (p) => setPayments(prev => [p, ...prev])

  return { payments, loading, add }
}
