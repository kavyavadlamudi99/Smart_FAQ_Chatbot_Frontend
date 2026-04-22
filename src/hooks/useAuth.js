import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (token) {
      // TODO: Verify token with backend
      setIsAuthenticated(true)
      setUser({ email: 'user@example.com' }) // Mock user
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
    setLoading(false)
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return { user, loading, isAuthenticated, login, logout, checkAuth }
}
