import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Lock, User, AlertCircle } from 'lucide-react'
import styles from './LoginPage.module.css'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logo}>
            <Shield size={36} />
            <div>
              <h1>Sri Lanka Police</h1>
              <p>Traffic Fine Management System</p>
            </div>
          </div>
          <div className={styles.tagline}>
            <h2>National Traffic Fine Analytics Portal</h2>
            <p>Secure access for senior officials to monitor, analyze, and manage traffic fine collections nationwide.</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>25</span>
              <span className={styles.statLabel}>Districts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>3,847</span>
              <span className={styles.statLabel}>Fines This Month</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>Rs.4.2M</span>
              <span className={styles.statLabel}>Revenue Collected</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBadge}>
              <Lock size={20} />
            </div>
            <h2>Official Sign In</h2>
            <p>Enter your credentials to access the portal</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <div className={styles.inputWrapper}>
                <User size={15} className={styles.inputIcon} />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={15} className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.hint}>
            <span>Demo: <strong>admin</strong> / <strong>admin123</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
