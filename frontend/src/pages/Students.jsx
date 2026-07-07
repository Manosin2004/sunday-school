import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Students() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({ name: '', class_id: '', dob: '', phone: '' })
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Confirmation Dialog States
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  
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
    { path: '/students', label: 'Students', icon: '👦', active: true },
    { path: '/attendance', label: 'Attendance', icon: '📋' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/logout', label: 'Logout', icon: '🚪', isLogout: true },
  ]

  const load = async () => {
    setLoading(true)
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/students.php'),
        api.get('/classes.php')
      ])
      setStudents(studentsRes.data)
      setClasses(classesRes.data)
    } catch (error) {
      showMessage('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

const submit = async () => {
    if (!form.name || !form.class_id) {
      showMessage('Please fill in all required fields', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: form.name,
        class_id: form.class_id,
        dob: form.dob || null,
        phone: form.phone || null
      }
      if (editId) {
        await api.put(`/students.php?id=${editId}`, payload)
        showMessage('Student updated successfully! ✏️', 'success')
        setEditId(null)
      } else {
        await api.post('/students.php', payload)
        showMessage('Student added successfully! 🎉', 'success')
      }
      setForm({ name: '', class_id: '', dob: '', phone: '' })
      await load()
    } catch (error) {
      showMessage('Failed to save student', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }
  const edit = (s) => {
    let formattedDob = ''
    if (s.dob) {
      const datePart = s.dob.split('T')[0]
      formattedDob = datePart
    }
    setForm({ 
      name: s.name, 
      class_id: s.class_id, 
      dob: formattedDob, 
      phone: s.phone || '' 
    })
    setEditId(s.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr
      }
      const datePart = dateStr.split('T')[0]
      if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return datePart
      }
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  // Open confirmation dialog
  const openConfirmDialog = (id, name) => {
    setDeleteTarget({ id, name })
    setShowConfirm(true)
  }

  // Handle delete after confirmation
  const handleDelete = async () => {
    if (!deleteTarget) return
    
    try {
      await api.delete(`/students.php?id=${deleteTarget.id}`)
      showMessage(`"${deleteTarget.name}" deleted successfully`, 'success')
      await load()
    } catch (error) {
      showMessage('Failed to delete student', 'error')
    } finally {
      setShowConfirm(false)
      setDeleteTarget(null)
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirm(false)
    setDeleteTarget(null)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        padding: '1rem',
        background: 'linear-gradient(135deg, #eef2ff, #ede9fe, #e0e7ff)',
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
      {/* Top Navigation Bar */}
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
          {/* Page Header */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 2vw, 2rem)',
            marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 10px 40px rgba(5, 150, 105, 0.3)',
            flexWrap: 'wrap',
            gap: '1rem'
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
                👦
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  fontWeight: 700
                }}>
                  Student Management
                </h1>
                <p style={{
                  margin: '4px 0 0 0',
                  opacity: 0.9,
                  fontSize: 'clamp(0.7rem, 1vw, 0.9rem)'
                }}>
                  Manage all students and their details
                </p>
              </div>
            </div>
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
                {students.length}
              </span>
              <span style={{
                fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
                opacity: 0.9
              }}>
                Total Students
              </span>
            </div>
          </div>

          {/* Student Form */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: 'clamp(1rem, 1.5vw, 1.5rem)',
            marginBottom: '1.5rem',
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
                {editId ? '✏️ Edit Student' : '➕ Add New Student'}
              </h2>
              {editId && (
                <button
                  onClick={() => {
                    setEditId(null)
                    setForm({ name: '', class_id: '', dob: '', phone: '' })
                  }}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}
                >
                  Cancel
                </button>
              )}
            </div>
            
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
              gap: '1rem',
              marginBottom: '1rem'
            }}
            className="form-grid">
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
                  👤 Student Name *
                </label>
                <input
                  placeholder="Enter student name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
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
                    e.target.style.borderColor = '#059669'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)'
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
                  🏫 Class *
                </label>
                <select
                  value={form.class_id}
                  onChange={e => setForm({...form, class_id: e.target.value})}
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
                    e.target.style.borderColor = '#059669'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)'
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}
            className="form-grid">
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
                  🎂 Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({...form, dob: e.target.value})}
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
                    e.target.style.borderColor = '#059669'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)'
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
                  📞 Parent Phone
                </label>
                <input
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
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
                    e.target.style.borderColor = '#059669'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.background = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <button 
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isSubmitting ? 0.7 : 1,
                touchAction: 'manipulation'
              }}
              onClick={submit}
              disabled={isSubmitting}
              onMouseEnter={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.4)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isSubmitting ? '⏳ Saving...' : editId ? '✏️ Update Student' : '➕ Add Student'}
            </button>
          </div>

          {/* Students List */}
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
                All Students
              </h2>
              <span style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                background: '#f1f5f9',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px'
              }}>
                {students.length} records
              </span>
            </div>

            {students.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '3rem' }}>👦</div>
                <h3 style={{
                  margin: '0.75rem 0 0.5rem 0',
                  color: '#64748b'
                }}>No Students Found</h3>
                <p>Start by adding your first student using the form above</p>
              </div>
            ) : (
              <div style={{ 
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                margin: '0 -0.5rem',
                padding: '0 0.5rem'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '650px',
                  fontSize: 'clamp(0.75rem, 1vw, 0.875rem)'
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>#</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>Name</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>Class</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>DOB</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>Phone</th>
                      <th style={{
                        textAlign: 'center',
                        padding: '0.75rem 0.75rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} style={{
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{
                          padding: '0.75rem 0.75rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          fontWeight: 600,
                          color: '#94a3b8',
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)'
                        }}>{i + 1}</td>
                        <td style={{
                          padding: '0.75rem 0.75rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          fontWeight: 500,
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #059669, #34d399)',
                              color: 'white',
                              width: 'clamp(28px, 3vw, 32px)',
                              height: 'clamp(28px, 3vw, 32px)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(0.6rem, 0.8vw, 0.8rem)',
                              flexShrink: 0
                            }}>
                              {s.name.charAt(0).toUpperCase()}
                            </span>
                            <span style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {s.name}
                            </span>
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem 0.75rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)'
                        }}>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                            fontWeight: 500,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}>
                            {s.class_name}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem 0.75rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          color: '#64748b',
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatDate(s.dob)}
                        </td>
                        <td style={{
                          padding: '0.75rem 0.75rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          color: '#64748b',
                          fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                          whiteSpace: 'nowrap'
                        }}>
                          {s.phone || '—'}
                        </td>
                        <td style={{
                          padding: '0.75rem 0.5rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}>
                          <button 
                            style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '0.2rem 0.6rem',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              marginRight: '0.3rem',
                              touchAction: 'manipulation'
                            }}
                            onClick={() => edit(s)}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#bfdbfe'
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#dbeafe'
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            ✏️
                          </button>
                          <button 
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '0.2rem 0.6rem',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              touchAction: 'manipulation'
                            }}
                            onClick={() => openConfirmDialog(s.id, s.name)}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#fecaca'
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#fee2e2'
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* CUSTOM CONFIRMATION DIALOG */}
      {/* ======================================== */}
      {showConfirm && (
        <>
          <div
            onClick={cancelDelete}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              animation: 'fadeIn 0.3s ease'
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 32px)',
              maxWidth: '420px',
              width: '90%',
              zIndex: 10000,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'scaleIn 0.3s ease'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFE8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              border: '2px solid #FF6B6B40'
            }}>
              🗑️
            </div>

            <h3 style={{
              textAlign: 'center',
              fontSize: 'clamp(18px, 2.5vw, 20px)',
              fontWeight: 700,
              color: '#2D3436',
              margin: '0 0 8px'
            }}>
              Delete Student
            </h3>

            <p style={{
              textAlign: 'center',
              fontSize: 'clamp(13px, 1.5vw, 14px)',
              color: '#636E72',
              margin: '0 0 24px',
              lineHeight: 1.5
            }}>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>?<br/>
              This action cannot be undone.
            </p>

            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}
            className="confirm-buttons">
              <button
                onClick={cancelDelete}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#F1F2F6',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#636E72',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  touchAction: 'manipulation',
                  minWidth: '80px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#E8E8E8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F1F2F6'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #FF6B6B, #EE5A24)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                  touchAction: 'manipulation',
                  minWidth: '80px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 107, 107, 0.6)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)'
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
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
          
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          
          .confirm-buttons {
            flex-direction: column !important;
          }
          
          .confirm-buttons button {
            width: 100% !important;
          }
          
          /* Table mobile optimizations */
          table {
            font-size: 0.7rem !important;
          }
          table th, table td {
            padding: 0.5rem 0.4rem !important;
          }
          table th {
            font-size: 0.6rem !important;
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
          .confirm-dialog {
            padding: 24px 20px !important;
          }
          .confirm-buttons {
            flex-direction: column !important;
          }
          .confirm-buttons button {
            width: 100% !important;
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(5, 150, 105, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #059669, #34d399);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #047857, #10b981);
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
