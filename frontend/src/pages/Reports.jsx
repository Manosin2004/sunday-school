import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Reports() {
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
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
    { path: '/attendance', label: 'Attendance', icon: '📋' },
    { path: '/reports', label: 'Reports', icon: '📈', active: true },
    { path: '/logout', label: 'Logout', icon: '🚪' },
  ]

  useEffect(() => { 
    api.get('/classes.php').then(r => setClasses(r.data)) 
  }, [])

  const load = async () => {
    if (!classId) {
      alert('Please select a class')
      return
    }
    setLoading(true)
    try {
      const r = await api.get(`/attendance.php?report=1&class_id=${classId}&month=${month}`)
      setRecords(r.data)
    } catch (error) {
      alert('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (records.length === 0) return
    const rows = [['Name', 'Date', 'Status'], ...records.map(r => [r.name, r.date, r.status])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    const className = classes.find(c => c.id == classId)?.class_name || 'class'
    a.download = `attendance_${className}_${months[month-1]}.csv`
    a.click()
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const selectedClass = classes.find(c => c.id == classId)
  const presentCount = records.filter(r => r.status === 'present').length
  const absentCount = records.filter(r => r.status === 'absent').length
  const attendancePercentage = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0

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
          {/* Page Header - Purple Theme */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 2vw, 2rem)',
            marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)'
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
                📊
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  fontWeight: 700
                }}>
                  Attendance Reports
                </h1>
                <p style={{
                  margin: '4px 0 0 0',
                  opacity: 0.9,
                  fontSize: 'clamp(0.7rem, 1vw, 0.9rem)'
                }}>
                  View and export attendance analytics
                </p>
              </div>
            </div>
            {records.length > 0 && (
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
                  {attendancePercentage}%
                </span>
                <span style={{
                  fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
                  opacity: 0.9
                }}>
                  Attendance Rate
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
                  🏫 Select Class
                </label>
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
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
                    e.target.style.borderColor = '#7c3aed'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)'
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
                  📅 Select Month
                </label>
                <select
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
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
                    e.target.style.borderColor = '#7c3aed'
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.background = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  {months.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={load}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  color: 'white',
                  padding: '0.625rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading ? 0.7 : 1,
                  flex: 1
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.3)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {loading ? '⏳ Loading...' : '📊 View Report'}
              </button>

              {records.length > 0 && (
                <button
                  onClick={exportCSV}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                    color: 'white',
                    padding: '0.625rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  📥 Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Statistics Summary */}
          {records.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                borderTop: '4px solid #7c3aed'
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#7c3aed'
                }}>
                  {records.length}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  Total Records
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                borderTop: '4px solid #059669'
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#059669'
                }}>
                  {presentCount}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  Present
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                borderTop: '4px solid #dc2626'
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#dc2626'
                }}>
                  {absentCount}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  Absent
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                borderTop: '4px solid #d97706'
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#d97706'
                }}>
                  {attendancePercentage}%
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  Attendance Rate
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          {records.length > 0 && (
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
                  📋 Attendance Records
                  {selectedClass && (
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: '#7c3aed',
                      background: '#ede9fe',
                      padding: '0.2rem 0.75rem',
                      borderRadius: '20px'
                    }}>
                      {selectedClass.class_name}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#d97706',
                    background: '#fef3c7',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px'
                  }}>
                    {months[month - 1]}
                  </span>
                </h2>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  background: '#f1f5f9',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px'
                }}>
                  {records.length} records
                </span>
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
                    borderTopColor: '#7c3aed',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  <p style={{ marginTop: '0.75rem' }}>Loading report...</p>
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
                        }}>Student Name</th>
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
                        }}>Date</th>
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
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => {
                        const isPresent = r.status === 'present'
                        return (
                          <tr key={i} style={{
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
                                  background: isPresent ? 'linear-gradient(135deg, #059669, #34d399)' : 'linear-gradient(135deg, #dc2626, #f87171)',
                                  color: 'white',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem'
                                }}>
                                  {r.name.charAt(0).toUpperCase()}
                                </span>
                                {r.name}
                              </span>
                            </td>
                            <td style={{
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle',
                              color: '#64748b'
                            }}>
                              {r.date}
                            </td>
                            <td style={{
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid #f1f5f9',
                              verticalAlign: 'middle',
                              textAlign: 'center'
                            }}>
                              <span style={{
                                padding: '0.25rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: isPresent ? '#dcfce7' : '#fee2e2',
                                color: isPresent ? '#16a34a' : '#dc2626',
                                display: 'inline-block'
                              }}>
                                {isPresent ? '✅ Present' : '❌ Absent'}
                              </span>
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

          {/* Empty State */}
          {records.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '3rem' }}>📊</div>
              <h3 style={{
                margin: '0.75rem 0 0.5rem 0',
                color: '#64748b'
              }}>No Records Found</h3>
              <p>Select a class and month, then click "View Report"</p>
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          nav {
            overflow-x: auto;
          }
          .filter-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .page-header {
            flex-direction: column !important;
            text-align: center;
            gap: 1rem;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(124, 58, 237, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
        }
      `}</style>
    </div>
  )
}