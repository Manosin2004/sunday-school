import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Attendance() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // ADDED
  const navigate = useNavigate()

  // Get current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/classes', label: 'Classes', icon: '🏫' },
    { path: '/students', label: 'Students', icon: '👦' },
    { path: '/attendance', label: 'Attendance', icon: '📋', active: true },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/admin', label: 'Admin', icon: '⚙️' },
    { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true },
  ]

  useEffect(() => { 
    api.get('/classes.php').then(r => setClasses(r.data)) 
  }, [])

  const loadStudents = async (cid, d) => {
    setLoading(true)
    try {
      const [s, a] = await Promise.all([
        api.get(`/students.php?class_id=${cid}`),
        api.get(`/attendance.php?date=${d}&class_id=${cid}`)
      ])
      setStudents(s.data)
      const map = {}
      a.data.forEach(r => { map[r.student_id] = { status: r.status, notes: r.notes } })
      s.data.forEach(st => { if (!map[st.id]) map[st.id] = { status: 'absent', notes: '' } })
      setAttendance(map)
    } catch (error) {
      showMessage('Failed to load attendance data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClass = (cid) => { 
    setClassId(cid); 
    if (cid) loadStudents(cid, date) 
  }

  const handleDate = (d) => { 
    setDate(d); 
    if (classId) loadStudents(classId, d) 
  }

  const toggle = (id) => {
    setAttendance(a => ({ 
      ...a, 
      [id]: { 
        ...a[id], 
        status: a[id]?.status === 'present' ? 'absent' : 'present' 
      } 
    }))
  }

  const save = async () => {
    if (!classId) {
      showMessage('Please select a class first', 'error')
      return
    }
    
    setSaving(true)
    try {
      const records = students.map(s => ({ 
        student_id: s.id, 
        date, 
        status: attendance[s.id]?.status || 'absent', 
        notes: attendance[s.id]?.notes || '' 
      }))
      await api.post('/attendance.php', records)
      showMessage('Attendance saved successfully! ✅', 'success')
    } catch (error) {
      showMessage('Failed to save attendance', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 25%, #eef2ff 50%, #f0f9ff 75%, #f5f3ff 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      margin: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation Bar - WITH MOBILE MENU */}
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
        zIndex: 100,
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 1vw, 1rem)'
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
            color: '#1e293b'
          }}>
            ✝️ Sunday School
          </span>
        </div>

        {/* Hamburger Menu Button - FOR MOBILE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#1e293b',
            touchAction: 'manipulation'
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.25rem, 0.8vw, 1rem)',
          overflow: 'auto',
          flex: 1,
          justifyContent: 'center',
          padding: '0 0.5rem'
        }}
        className="desktop-nav">
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
                fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
                fontWeight: item.active ? 600 : 500,
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                if (!item.active) {
                  e.currentTarget.style.background = 'rgba(79,70,229,0.1)'
                  e.currentTarget.style.color = '#4f46e5'
                }
              }}
              onMouseLeave={e => {
                if (!item.active) {
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

        {/* Mobile Navigation Menu - DROPDOWN */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            padding: '0.5rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            zIndex: 200
          }}
          className="mobile-nav">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path)
                  setIsMobileMenuOpen(false)
                }}
                style={{
                  background: item.active ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                  color: item.active ? 'white' : '#64748b',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: item.active ? 600 : 500,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'inherit',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}

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

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'clamp(0.75rem, 1.5vw, 1.5rem)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Page Header - Blue Theme */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 2vw, 2rem)',
            marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)'
              }}>
                📋
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  fontWeight: 700
                }}>
                  Attendance Management
                </h1>
                <p style={{
                  margin: '4px 0 0 0',
                  opacity: 0.9,
                  fontSize: 'clamp(0.7rem, 1vw, 0.9rem)'
                }}>
                  Track daily attendance for students
                </p>
              </div>
            </div>
            {students.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 1.5vw, 1.5rem)',
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  fontWeight: 700,
                  display: 'block'
                }}>
                  {presentCount}/{students.length}
                </span>
                <span style={{
                  fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
                  opacity: 0.9
                }}>
                  {attendancePercentage}% Present
                </span>
              </div>
            )}
          </div>

          {/* Filter Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: 'clamp(1rem, 1.5vw, 1.5rem)',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            transition: 'box-shadow 0.3s ease'
          }}>
            {msg.text && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontWeight: 500,
                animation: 'slideDown 0.3s ease',
                background: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: msg.type === 'success' ? '#16a34a' : '#dc2626',
                borderLeft: `4px solid ${msg.type === 'success' ? '#16a34a' : '#dc2626'}`
              }}>
                {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
            className="filter-grid">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  📅 Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => handleDate(e.target.value)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: '#f8fafc',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#4f46e5'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.background = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  🏫 Select Class
                </label>
                <select
                  value={classId}
                  onChange={e => handleClass(e.target.value)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#4f46e5'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.background = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.class_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students List */}
          {students.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: 'clamp(1rem, 1.5vw, 1.5rem)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'box-shadow 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <h2 style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  color: '#1e293b'
                }}>
                  👨‍🎓 Students
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: '#059669',
                      fontWeight: 600
                    }}>
                      ✅ {presentCount} Present
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: '#dc2626',
                      fontWeight: 600
                    }}>
                      ❌ {students.length - presentCount} Absent
                    </span>
                  </div>
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                      color: 'white',
                      padding: '0.4rem 1.2rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: saving ? 0.7 : 1,
                      touchAction: 'manipulation'
                    }}
                    onClick={save}
                    disabled={saving}
                    onMouseEnter={e => {
                      if (!saving) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.3)'
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {saving ? '⏳ Saving...' : '💾 Save Attendance'}
                  </button>
                </div>
              </div>

              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2.5rem',
                  color: '#94a3b8'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '2rem',
                    height: '2rem',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#4f46e5',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  <p style={{ marginTop: '0.75rem' }}>Loading students...</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '500px'
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          textAlign: 'left',
                          padding: '0.75rem 0.75rem',
                          background: '#f8fafc',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '2px solid #e2e8f0'
                        }}>#</th>
                        <th style={{
                          textAlign: 'left',
                          padding: '0.75rem 0.75rem',
                          background: '#f8fafc',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '2px solid #e2e8f0'
                        }}>Student Name</th>
                        <th style={{
                          textAlign: 'center',
                          padding: '0.75rem 0.75rem',
                          background: '#f8fafc',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '2px solid #e2e8f0'
                        }}>Status</th>
                        <th style={{
                          textAlign: 'left',
                          padding: '0.75rem 0.75rem',
                          background: '#f8fafc',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '2px solid #e2e8f0'
                        }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const status = attendance[s.id]?.status || 'absent'
                        const isPresent = status === 'present'
                        return (
                          <tr key={s.id} style={{
                            transition: 'background 0.2s ease',
                            background: isPresent ? 'rgba(5, 150, 105, 0.03)' : 'transparent'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = isPresent ? 'rgba(5, 150, 105, 0.08)' : '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = isPresent ? 'rgba(5, 150, 105, 0.03)' : 'transparent'}
                          >
                            <td style={{
                              padding: '0.75rem 0.75rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle',
                              fontWeight: 600,
                              color: '#94a3b8'
                            }}>{i + 1}</td>
                            <td style={{
                              padding: '0.75rem 0.75rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle',
                              fontWeight: 500
                            }}>
                              <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <span style={{
                                  background: isPresent ? 'linear-gradient(135deg, #059669, #34d399)' : 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
                                  color: 'white',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  transition: 'all 0.3s ease'
                                }}>
                                  {s.name.charAt(0).toUpperCase()}
                                </span>
                                {s.name}
                              </span>
                            </td>
                            <td style={{
                              padding: '0.75rem 0.75rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle',
                              textAlign: 'center'
                            }}>
                              <button
                                onClick={() => toggle(s.id)}
                                style={{
                                  padding: '0.4rem 1rem',
                                  border: 'none',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  background: isPresent ? 'linear-gradient(135deg, #059669, #34d399)' : 'linear-gradient(135deg, #dc2626, #f87171)',
                                  color: 'white',
                                  minWidth: '90px',
                                  boxShadow: isPresent ? '0 4px 12px rgba(5, 150, 105, 0.3)' : '0 4px 12px rgba(220, 38, 38, 0.3)',
                                  touchAction: 'manipulation'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.transform = 'scale(1.05)'
                                  e.currentTarget.style.boxShadow = isPresent ? '0 8px 20px rgba(5, 150, 105, 0.4)' : '0 8px 20px rgba(220, 38, 38, 0.4)'
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.transform = 'scale(1)'
                                  e.currentTarget.style.boxShadow = isPresent ? '0 4px 12px rgba(5, 150, 105, 0.3)' : '0 4px 12px rgba(220, 38, 38, 0.3)'
                                }}
                              >
                                {isPresent ? '✅ Present' : '❌ Absent'}
                              </button>
                            </td>
                            <td style={{
                              padding: '0.75rem 0.75rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle'
                            }}>
                              <input
                                placeholder="Add notes..."
                                value={attendance[s.id]?.notes || ''}
                                onChange={e => setAttendance(a => ({
                                  ...a,
                                  [s.id]: { ...a[s.id], notes: e.target.value }
                                }))}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem 0.75rem',
                                  border: '2px solid #e2e8f0',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  transition: 'all 0.3s ease',
                                  background: '#f8fafc',
                                  boxSizing: 'border-box'
                                }}
                                onFocus={e => {
                                  e.target.style.borderColor = '#4f46e5'
                                  e.target.style.background = 'white'
                                  e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'
                                }}
                                onBlur={e => {
                                  e.target.style.borderColor = '#e2e8f0'
                                  e.target.style.background = '#f8fafc'
                                  e.target.style.boxShadow = 'none'
                                }}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {classId && students.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '3rem' }}>📋</div>
              <h3 style={{
                margin: '0.75rem 0 0.5rem 0',
                color: '#64748b'
              }}>No Students Found</h3>
              <p>No students enrolled in this class yet</p>
            </div>
          )}

          {!classId && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '3rem' }}>👆</div>
              <h3 style={{
                margin: '0.75rem 0 0.5rem 0',
                color: '#64748b'
              }}>Select a Class</h3>
              <p>Please select a class and date to mark attendance</p>
            </div>
          )}
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          nav button[aria-label="Toggle menu"] {
            display: flex !important;
          }
          
          .mobile-nav {
            display: flex !important;
          }
          
          .filter-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
          
          nav button[aria-label="Toggle menu"] {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .page-header {
            flex-direction: column !important;
            text-align: center;
            gap: 1rem;
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(79, 70, 229, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4338ca, #6366f1);
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
        button {
          touch-action: manipulation;
        }
        input, select {
          font-size: 16px !important;
        }
      `}</style>
    </div>
  )
}
