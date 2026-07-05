import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Reports from './pages/Reports'

// Navigation Component with YOUR ORIGINAL STYLE
function Navigation({ user, onLogout }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/classes', label: 'Classes', icon: '🏫' },
    { path: '/students', label: 'Students', icon: '👦' },
    { path: '/attendance', label: 'Attendance', icon: '📋' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    if (onLogout) onLogout()
    // REMOVED: navigate('/login') - Don't navigate, just let App handle it
  }

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      padding: '0 clamp(1rem, 2vw, 2rem)',
      height: 'clamp(60px, 7vh, 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
      zIndex: 100
    }}>
      {/* Left side - Logo and School Name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 1vw, 1rem)'
      }}>
        <img
          src="/church-logo.jpg"
          alt="Church Logo"
          style={{ height: 'clamp(32px, 4vw, 44px)', width: 'auto', borderRadius: '6px' }}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
        <span style={{
          fontWeight: 700,
          fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
          color: '#1e293b'
        }}>
          CSI Christ Church, Thalavaipuram
        </span>
      </div>

      {/* Center - Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.25rem, 0.8vw, 1rem)',
        overflow: 'auto',
        flex: 1,
        justifyContent: 'center',
        padding: '0 0.5rem'
      }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              background: pathname === item.path ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
              color: pathname === item.path ? 'white' : '#64748b',
              border: 'none',
              padding: 'clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.6rem, 1.2vw, 1rem)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
              fontWeight: pathname === item.path ? 600 : 500,
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => {
              if (pathname !== item.path) {
                e.currentTarget.style.background = 'rgba(79,70,229,0.1)'
                e.currentTarget.style.color = '#4f46e5'
              }
            }}
            onMouseLeave={e => {
              if (pathname !== item.path) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#64748b'
              }
            }}
          >
            <span style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side - Time and Logout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          background: 'rgba(79,70,229,0.08)',
          padding: '0.3rem 0.8rem',
          borderRadius: '6px',
          fontSize: 'clamp(0.6rem, 0.8vw, 0.8rem)',
          color: '#4f46e5',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>
          {new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
          })}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: 'clamp(0.3rem, 0.5vw, 0.5rem) clamp(0.8rem, 1.2vw, 1rem)',
            borderRadius: '6px',
            fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#b91c1c'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#dc2626'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  )
}

// Main App
export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('ss_user')
    return u ? JSON.parse(u) : null
  })

  const logout = () => { 
    localStorage.removeItem('ss_user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    setUser(null) 
  }

  // If no user, show Login page (without routing)
  if (!user) return <Login onLogin={setUser} />

  // If user exists, show Dashboard with routing
  return (
    <BrowserRouter>
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        {/* Top Navigation Bar - YOUR ORIGINAL STYLE */}
        <Navigation user={user} onLogout={logout} />
        
        {/* Page Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}