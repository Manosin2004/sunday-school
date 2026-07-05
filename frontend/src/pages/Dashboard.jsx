import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning ☀️')
    else if (hour < 17) setGreeting('Good Afternoon 🌤️')
    else setGreeting('Good Evening 🌙')

    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    const loadData = async () => {
      try {
        const r = await api.get('/dashboard.php')
        setData(r.data)
        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard:', error)
        setData({
          total_students: 0,
          present_today: 0,
          total_classes: 0,
          date: new Date().toLocaleDateString()
        })
        setLoading(false)
      }
    }
    loadData()

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { 
      num: data?.total_students ?? 0, 
      label: 'Total Students', 
      icon: '👨‍👩‍👧‍👦', 
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5, #818cf8)'
    },
    { 
      num: data?.present_today ?? 0, 
      label: 'Present Today', 
      icon: '✅', 
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669, #34d399)'
    },
    { 
      num: data?.total_classes ?? 0, 
      label: 'Total Classes', 
      icon: '📚', 
      color: '#d97706',
      gradient: 'linear-gradient(135deg, #d97706, #fbbf24)'
    },
    { 
      num: data?.date ?? new Date().toLocaleDateString(), 
      label: "Today's Date", 
      icon: '📅', 
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)'
    },
  ]

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊', active: true },
    { path: '/classes', label: 'Classes', icon: '🏫' },
    { path: '/students', label: 'Students', icon: '👦' },
    { path: '/attendance', label: 'Attendance', icon: '📋' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true },
  ]

  const features = [
    { 
      to: '/attendance', 
      icon: '📋', 
      label: 'Attendance',
      desc: 'Mark presence today',
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5, #818cf8)'
    },
    { 
      to: '/students', 
      icon: '👦', 
      label: 'Students',
      desc: 'Manage all students',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669, #34d399)'
    },
    { 
      to: '/classes', 
      icon: '🏫', 
      label: 'Classes',
      desc: 'View class details',
      color: '#d97706',
      gradient: 'linear-gradient(135deg, #d97706, #fbbf24)'
    },
    { 
      to: '/reports', 
      icon: '📊', 
      label: 'Reports',
      desc: 'Analytics & insights',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)'
    },
  ]

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        padding: '1rem',
        background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0
      }}>
        <div style={{ 
          textAlign: 'center',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          <div style={{
            width: 'clamp(60px, 8vw, 80px)',
            height: 'clamp(60px, 8vw, 80px)',
            background: 'conic-gradient(from 0deg, #4f46e5, #818cf8, #a78bfa, #4f46e5)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem',
            padding: '4px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              ⛪
            </div>
          </div>
          <h3 style={{ 
            color: '#4f46e5', 
            fontWeight: 700, 
            marginBottom: '0.5rem',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)'
          }}>
            Loading Sunday School
          </h3>
          <div style={{
            width: 'clamp(150px, 30vw, 300px)',
            height: '4px',
            background: '#e0e7ff',
            borderRadius: '2px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
              borderRadius: '2px',
              animation: 'slide 1s ease-in-out infinite'
            }} />
          </div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(350%); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      height: '100dvh',
      width: '100vw',
      background: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 30%, #eef2ff 60%, #f0f9ff 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      margin: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Mobile Header - Visible only on small screens */}
      <div className="mobile-header" style={{
        display: 'none',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/church-logo.jpg"
            alt="Church"
            style={{ height: '36px', width: 'auto', borderRadius: '6px' }}
          />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
              CSI Christ Church
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              Thalavaipuram
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(79,70,229,0.08)',
          padding: '4px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#4f46e5',
          fontWeight: 600
        }}>
          {currentTime}
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" style={{
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 1vw, 1rem)'
        }}>
          <img
            src="/church-logo.jpg"
            alt="Church Logo"
            style={{ height: 'clamp(32px, 4vw, 44px)', width: 'auto', borderRadius: '6px' }}
          />
          <span style={{
            fontWeight: 700,
            fontSize: 'clamp(0.85rem, 1.5vw, 1.3rem)',
            color: '#1e293b'
          }}>
            CSI Christ Church, Thalavaipuram
          </span>
        </div>

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
                background: item.active ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: item.active ? 'white' : '#64748b',
                border: 'none',
                padding: 'clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.6rem, 1.2vw, 1rem)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: 'clamp(0.65rem, 1vw, 0.9rem)',
                fontWeight: item.active ? 600 : 500,
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontFamily: 'inherit',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

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
            {currentTime}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile Only */}
      <div className="bottom-nav" style={{
        display: 'none',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        padding: '8px 4px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        boxShadow: '0 -2px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '2px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.path === '/logout') {
                  if (window.confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('ss_user')
                    navigate('/login')
                  }
                } else {
                  navigate(item.path)
                }
              }}
              style={{
                background: item.active ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: item.active ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 4px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: item.active ? 700 : 500,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                minHeight: '48px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '9px' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'clamp(0.5rem, 1.5vw, 1.5rem)',
        position: 'relative',
        paddingBottom: 'clamp(0.5rem, 1.5vw, 1.5rem)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: `rgba(79, 70, 229, ${Math.random() * 0.06 + 0.02})`,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatBg ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
          <style>{`
            @keyframes floatBg {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.5); }
            }
          `}</style>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.5rem, 1.5vw, 1.5rem)',
          height: '100%'
        }}>
          {/* Greeting Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: 'clamp(0.5rem, 1.2vw, 1.25rem) clamp(0.75rem, 1.5vw, 1.5rem)',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'clamp(12px, 1.5vw, 16px)',
            border: '1px solid rgba(255,255,255,0.3)',
            flexShrink: 0
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
                fontWeight: 700,
                color: '#1e293b'
              }}>
                {greeting}
              </h2>
              <p style={{
                margin: 0,
                fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
                color: '#64748b'
              }}>
                Training in Faith • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="date-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(79,70,229,0.06)',
              padding: '0.3rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(79,70,229,0.1)'
            }}>
              <span>🕊️</span>
              <span style={{
                fontSize: 'clamp(0.6rem, 0.9vw, 0.85rem)',
                color: '#4f46e5',
                fontWeight: 500
              }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(0.5rem, 1.2vw, 1.25rem)',
            flexShrink: 0
          }}>
            {stats.map((stat, i) => {
              const cardColors = [
                { bg: 'rgba(79,70,229,0.08)', border: '#4f46e5', shadow: 'rgba(79,70,229,0.3)' },
                { bg: 'rgba(5,150,105,0.08)', border: '#059669', shadow: 'rgba(5,150,105,0.3)' },
                { bg: 'rgba(217,119,6,0.08)', border: '#d97706', shadow: 'rgba(217,119,6,0.3)' },
                { bg: 'rgba(124,58,237,0.08)', border: '#7c3aed', shadow: 'rgba(124,58,237,0.3)' }
              ];
              const colorSet = cardColors[i] || cardColors[0];
              
              return (
                <div
                  key={i}
                  className="stat-card"
                  style={{
                    padding: 'clamp(0.6rem, 1.2vw, 1.25rem)',
                    borderRadius: 'clamp(12px, 1.5vw, 20px)',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${stat.color}20`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',
                    animation: 'slideUp 0.6s ease both',
                    animationDelay: `${i * 0.08}s`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 'clamp(40px, 10vw, 80px)',
                    height: 'clamp(40px, 10vw, 80px)',
                    background: stat.gradient,
                    borderRadius: '0 14px 0 100%',
                    opacity: 0.06,
                    pointerEvents: 'none'
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <span style={{ 
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)'
                    }}>{stat.icon}</span>
                    <span style={{
                      fontSize: 'clamp(1rem, 3vw, 2rem)',
                      fontWeight: 800,
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {stat.num}
                    </span>
                  </div>
                  
                  <div style={{
                    fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)',
                    color: '#64748b',
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {stat.label}
                  </div>
                  
                  <div style={{
                    marginTop: '0.4rem',
                    height: '3px',
                    background: stat.gradient,
                    borderRadius: '2px',
                    opacity: 0.3,
                    width: '40%'
                  }} />
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            flex: 1,
            minHeight: 0
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✨</span> Quick Actions
              </h3>
            </div>
            
            <div className="features-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 'clamp(0.5rem, 1.2vw, 1.25rem)',
              flex: 1
            }}>
              {features.map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.to)}
                  className="feature-card"
                  style={{
                    padding: 'clamp(0.8rem, 1.5vw, 1.5rem)',
                    borderRadius: 'clamp(12px, 1.5vw, 20px)',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    animation: 'slideUp 0.6s ease both',
                    animationDelay: `${0.3 + i * 0.08}s`,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'clamp(70px, 12vh, 120px)',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '100%',
                    height: '100%',
                    background: item.gradient,
                    opacity: 0.04,
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }} />
                  
                  <div style={{
                    fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                    marginBottom: '0.2rem',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {item.icon}
                  </div>
                  
                  <div style={{
                    fontWeight: 700,
                    fontSize: 'clamp(0.75rem, 1.5vw, 1.05rem)',
                    marginBottom: '0.1rem',
                    position: 'relative',
                    zIndex: 1,
                    background: item.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {item.label}
                  </div>
                  
                  <div style={{
                    fontSize: 'clamp(0.5rem, 1vw, 0.8rem)',
                    color: '#94a3b8',
                    position: 'relative',
                    zIndex: 1,
                    fontWeight: 500
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(0.5rem, 1.2vw, 1.25rem)',
            flexShrink: 0
          }}>
            <div style={{
              padding: 'clamp(0.4rem, 0.8vw, 0.75rem) clamp(0.6rem, 1.2vw, 1.25rem)',
              borderRadius: 'clamp(10px, 1.5vw, 16px)',
              background: 'linear-gradient(135deg, rgba(255,251,235,0.9), rgba(254,243,199,0.8))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderLeft: '4px solid #f59e0b',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              animation: 'slideUp 0.6s ease 0.6s both'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.3rem)' }}>📖</span>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: 'clamp(0.55rem, 1vw, 0.85rem)',
                    color: '#92400e',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    fontStyle: 'italic'
                  }}>
                    "Let the little children come..."
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 'clamp(0.45rem, 0.8vw, 0.7rem)',
                    color: '#b45309',
                    fontWeight: 600
                  }}>
                    — Matthew 19:14
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              padding: 'clamp(0.4rem, 0.8vw, 0.75rem) clamp(0.6rem, 1.2vw, 1.25rem)',
              borderRadius: 'clamp(10px, 1.5vw, 16px)',
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              textAlign: 'center',
              animation: 'slideUp 0.6s ease 0.7s both',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: 'clamp(0.5rem, 0.9vw, 0.75rem)',
                color: '#64748b',
                fontWeight: 500
              }}>
                ✝ "Train up a child..."
                <span style={{ 
                  display: 'inline-block',
                  opacity: 0.6, 
                  marginLeft: '0.2rem',
                  fontSize: 'clamp(0.4rem, 0.7vw, 0.65rem)',
                  fontWeight: 600
                }}>— Prov 22:6</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatBg {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.5); }
        }

        /* Mobile Specific Styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-header {
            display: flex !important;
          }
          
          .bottom-nav {
            display: block !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          
          .stat-card {
            padding: 10px 12px !important;
          }
          
          .feature-card {
            min-height: 65px !important;
            padding: 12px 8px !important;
          }
          
          .feature-card div:last-child {
            display: none !important;
          }
          
          .date-badge {
            display: none !important;
          }
          
          .nav-label {
            display: none !important;
          }
          
          .stat-card div:first-child span:first-child {
            font-size: 1.3rem !important;
          }
          
          .stat-card div:first-child span:last-child {
            font-size: 1rem !important;
          }
          
          .stat-card div:last-child {
            font-size: 0.6rem !important;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
          
          .feature-card {
            min-height: 55px !important;
            padding: 8px 6px !important;
          }
          
          .feature-card span:first-child {
            font-size: 1.5rem !important;
          }
          
          .feature-card div:first-of-type {
            font-size: 0.7rem !important;
          }
          
          .stat-card {
            padding: 8px 10px !important;
          }
          
          .stat-card div:first-child span:first-child {
            font-size: 1.1rem !important;
          }
          
          .stat-card div:first-child span:last-child {
            font-size: 0.9rem !important;
          }
          
          .stat-card div:last-child {
            font-size: 0.55rem !important;
          }
        }

        @media (max-width: 360px) {
          .mobile-header {
            padding: 8px 12px !important;
          }
          
          .mobile-header img {
            height: 30px !important;
          }
          
          .mobile-header div:first-child div:first-child {
            font-size: 11px !important;
          }
          
          .mobile-header div:first-child div:last-child {
            font-size: 8px !important;
          }
          
          .stats-grid {
            gap: 4px !important;
          }
          
          .features-grid {
            gap: 4px !important;
          }
          
          .stat-card {
            padding: 6px 8px !important;
            border-radius: 10px !important;
          }
          
          .stat-card div:first-child span:first-child {
            font-size: 0.9rem !important;
          }
          
          .stat-card div:first-child span:last-child {
            font-size: 0.8rem !important;
          }
          
          .stat-card div:last-child {
            font-size: 0.5rem !important;
          }
          
          .feature-card {
            min-height: 48px !important;
            padding: 6px 4px !important;
            border-radius: 10px !important;
          }
          
          .feature-card span:first-child {
            font-size: 1.2rem !important;
          }
          
          .feature-card div:first-of-type {
            font-size: 0.6rem !important;
          }
          
          .bottom-nav button {
            min-height: 40px !important;
            padding: 4px 2px !important;
          }
          
          .bottom-nav button span:first-child {
            font-size: 16px !important;
          }
          
          .bottom-nav button span:last-child {
            font-size: 7px !important;
          }
        }

        /* Safe area support */
        @supports (padding: max(0px)) {
          .bottom-nav {
            padding-bottom: max(8px, env(safe-area-inset-bottom)) !important;
          }
        }

        /* Remove tap highlight on mobile */
        button, .feature-card, .stat-card {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(79,70,229,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}