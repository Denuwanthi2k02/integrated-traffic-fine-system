import React, { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const name = localStorage.getItem('admin_name')
    if (token && name) {
      setUser({ token, name })
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await loginAdmin(credentials)
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_name', data.name)
    setUser({ token: data.token, name: data.name, role: data.role })
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_name')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
