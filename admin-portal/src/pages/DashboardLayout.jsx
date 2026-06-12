import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Map, Tag, List, FileBarChart2,
  Shield, LogOut, Menu, X, Bell, ChevronDown, User
} from 'lucide-react'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Overview',       end: true },
  { to: '/districts',    icon: Map,             label: 'Districts'              },
  { to: '/categories',   icon: Tag,             label: 'Categories'             },
  { to: '/transactions', icon: List,            label: 'Transactions'           },
  { to: '/reports',      icon: FileBarChart2,   label: 'Reports'                },
]

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      <div className={styles.sidebarBrand}>
        <div className={styles.brandIcon}><Shield size={20} /></div>
        <div>
          <div className={styles.brandName}>Traffic Fine</div>
          <div className={styles.brandSub}>Admin Portal</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>NAVIGATION</div>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user?.name || 'Admin'}</div>
            <div className={styles.userRole}>Super Admin</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Logout">
          <LogOut size={15} />
        </button>
      </div>
    </>
  )

  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)}>
          <aside className={styles.mobileSidebar} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className={styles.topbarRight}>
            <button className={styles.notifBtn} aria-label="Notifications">
              <Bell size={16} />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>{user?.name?.charAt(0) || 'A'}</div>
              <span className={styles.topbarName}>{user?.name || 'Admin'}</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
