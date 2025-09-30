import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      // This is a placeholder - implement actual token verification
      setUser({ id: '1', email: 'admin@anhbao.com', name: 'Admin' })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Implement login logic
    return { success: true, user: { id: '1', email, name: 'Admin' } }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, loading, login, logout }
}