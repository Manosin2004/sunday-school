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
      if (editId) {
        await api.put(`/students.php?id=${editId}`, form)
        showMessage('Student updated successfully! ✏️', 'success')
        setEditId(null)
      } else {
        await api.post('/students.php', form)
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
    setForm({ 
      name: s.name, 
      class_id: s.class_id, 
      dob: s.dob || '', 
      phone: s.phone || '' 
    })
    setEditId(s.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        zIndex: 100
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
            boxShadow: '0 10px 40px rgba(5, 150, 105, 0.3)'
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
              borderBottom: '2px solid #f1f5f9'
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
            }}>
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
                    background: '#f8fafc'
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
                    cursor: 'pointer'
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
            }}>
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
                    background: '#f8fafc'
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
                    background: '#f8fafc'
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
                opacity: isSubmitting ? 0.7 : 1
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
              borderBottom: '2px solid #f1f5f9'
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
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
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
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0'
                      }}>Name</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0'
                      }}>Class</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0'
                      }}>DOB</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0'
                      }}>Phone</th>
                      <th style={{
                        textAlign: 'center',
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e2e8f0'
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
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          fontWeight: 600,
                          color: '#94a3b8'
                        }}>{i + 1}</td>
                        <td style={{
                          padding: '0.75rem 1rem',
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
                              background: 'linear-gradient(135deg, #059669, #34d399)',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem'
                            }}>
                              {s.name.charAt(0).toUpperCase()}
                            </span>
                            {s.name}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle'
                        }}>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            {s.class_name}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          color: '#64748b'
                        }}>
                          {s.dob || '—'}
                        </td>
                        <td style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          color: '#64748b'
                        }}>
                          {s.phone || '—'}
                        </td>
                        <td style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                          textAlign: 'center'
                        }}>
                          <button 
                            style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '0.25rem 0.875rem',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              marginRight: '0.5rem'
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
                            ✏️ Edit
                          </button>
                          <button 
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '0.25rem 0.875rem',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
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
                            🗑️ Delete
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
          {/* Backdrop */}
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

          {/* Dialog */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '420px',
              width: '90%',
              zIndex: 10000,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'scaleIn 0.3s ease'
            }}
          >
            {/* Icon */}
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

            {/* Title */}
            <h3 style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: '#2D3436',
              margin: '0 0 8px'
            }}>
              Delete Student
            </h3>

            {/* Message */}
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#636E72',
              margin: '0 0 24px',
              lineHeight: 1.5
            }}>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>?<br/>
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
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
                  touchAction: 'manipulation'
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
                  touchAction: 'manipulation'
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
        @media (max-width: 768px) {
          nav {
            overflow-x: auto;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
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
        input {
          font-size: 16px !important;
        }
      `}</style>
    </div>
  )
}