'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export function useApi<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchData = async () => {
    if (!token) {
      setError('Chưa đăng nhập')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options?.headers,
        },
      })

      const result: ApiResponse<T> = await response.json()

      if (result.success) {
        setData(result.data || null)
      } else {
        setError(result.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      setError('Lỗi kết nối server')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint, token])

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}

export function useApiMutation<T, P = any>(endpoint: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const mutate = async (payload: P, method: 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<T | null> => {
    if (!token) {
      setError('Chưa đăng nhập')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result: ApiResponse<T> = await response.json()

      if (result.success) {
        return result.data || null
      } else {
        setError(result.error || 'Có lỗi xảy ra')
        return null
      }
    } catch (err) {
      setError('Lỗi kết nối server')
      console.error('API Mutation Error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
