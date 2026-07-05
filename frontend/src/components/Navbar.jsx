import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/classes', label: 'Classes' },
  { path: '/students', label: 'Students' },
  { path: '/attendance', label: 'Attendance' },
  { path: '/reports', label: 'Reports' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      background: '#1e3a5f',
      padding: '0 clamp(1rem, 2vw, 2rem)',
      height: 'clamp(56px, 7vh, 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.4rem' }}>⛪</span>
        <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>
          Sunday School
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2rem)' }}>
        {navItems.map((item, index) => (
          <span
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              color: pathname === item.path ? '#fff' : '#93c5fd',
              fontSize: '0.95rem',
              fontWeight: pathname === item.path ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => {
              if (pathname !== item.path) e.currentTarget.style.color = '#93c5fd'
            }}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          👤 Admin
        </span>
<button
  key={index}
  onClick={() => {
    if (item.isLogout) {
      // Handle logout
      localStorage.removeItem('token'); // Remove token if using JWT
      localStorage.removeItem('user'); // Remove user data if stored
      navigate('/login'); // Redirect to login page
    } else {
      navigate(item.path);
    }
  }}
  style={{
    // ... styles
  }}
>
  <span style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>{item.icon}</span>
  {item.label}
</button>
      </div>
    </nav>
  )
}