// src/pages/Login.jsx
import { useState } from 'react'
import api from '../api/axios'

export default function Login({ onLogin }) {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submit = async () => {
    if (!form.username || !form.password) {
      setError('Please enter both username and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/login.php', { ...form, role })
      if (r.data && r.data.user) {
        localStorage.setItem('ss_user', JSON.stringify(r.data.user))
        onLogin(r.data.user)
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) submit()
  }

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b7 100%)',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '8%',
        fontSize: '3rem',
        opacity: '0.6',
        animation: 'float 4s ease-in-out infinite'
      }}>🌈</div>
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '10%',
        fontSize: '2.5rem',
        opacity: '0.5',
        animation: 'float 5s ease-in-out infinite 0.5s'
      }}>⭐</div>
      <div style={{
        position: 'absolute',
        bottom: '45%',
        left: '5%',
        fontSize: '2rem',
        opacity: '0.4',
        animation: 'float 3.5s ease-in-out infinite 1s'
      }}>🎈</div>
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '5%',
        fontSize: '1.8rem',
        opacity: '0.4',
        animation: 'float 4.5s ease-in-out infinite 1.5s'
      }}>🎨</div>

      {/* Main Card */}
      <div className="login-card" style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '40px 40px 0 0',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
        padding: '2rem 1.5rem 2.5rem',
        position: 'relative',
        zIndex: 2,
        maxHeight: '95vh',
        overflowY: 'auto'
      }}>
        {/* Top decorative line */}
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, #ff9f43, #fdcb6e)',
          borderRadius: '2px',
          margin: '0 auto 1.5rem'
        }}></div>

        {/* Small Icon Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            fontSize: '2.8rem',
            display: 'block'
          }}>⛪</span>
        </div>

        <h1 style={{
          textAlign: 'center',
          color: '#2d3436',
          fontSize: '1.6rem',
          fontWeight: 800,
          margin: '0 0 0.2rem',
          letterSpacing: '-0.5px'
        }}>
          Sunday School
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#636e72',
          fontSize: '0.85rem',
          margin: '0 0 1.8rem'
        }}>
          ✝️ Jesus Loves You!
        </p>

        {error && (
          <div style={{
            background: '#ffe8e8',
            color: '#d63031',
            padding: '12px 16px',
            borderRadius: '16px',
            marginBottom: '1.2rem',
            fontSize: '0.85rem',
            textAlign: 'center',
            border: '2px solid #ffb3b3',
            fontWeight: 600
          }}>
            😅 {error}
          </div>
        )}

        {/* Role Tabs - Full width */}
        <div style={{
          display: 'flex',
          background: '#f5f0eb',
          borderRadius: '50px',
          padding: '4px',
          marginBottom: '1.5rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
        }}>
          {[
            { id: 'student', icon: '👧', label: 'Student' },
            { id: 'teacher', icon: '👩‍🏫', label: 'Teacher' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              style={{
                flex: 1,
                padding: '0.7rem 0.5rem',
                borderRadius: '50px',
                border: 'none',
                background: role === r.id ? '#ff9f43' : 'transparent',
                color: role === r.id ? 'white' : '#636e72',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: role === r.id ? '0 4px 15px rgba(255, 159, 67, 0.3)' : 'none',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Input - Username */}
        <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.1rem',
            zIndex: 2
          }}>📧</span>
          <input
            type="email"
            placeholder="username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={handleKeyPress}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem 1rem 0.9rem 3.2rem',
              border: '2px solid #e8e8e8',
              borderRadius: '50px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#faf8f5',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff9f43'
              e.target.style.background = 'white'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8e8e8'
              e.target.style.background = '#faf8f5'
            }}
          />
        </div>

        {/* Input - Password */}
        <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.1rem',
            zIndex: 2
          }}>🔑</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKeyPress}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem 1rem 0.9rem 3.2rem',
              paddingRight: '3.2rem',
              border: '2px solid #e8e8e8',
              borderRadius: '50px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#faf8f5',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff9f43'
              e.target.style.background = 'white'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8e8e8'
              e.target.style.background = '#faf8f5'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '8px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Forgot Password */}
        <div style={{ textAlign: 'right', marginBottom: '1.2rem' }}>
          <span style={{
            fontSize: '0.8rem',
            color: '#ff9f43',
            cursor: 'pointer',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(255, 159, 67, 0.08)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}>
            Forgot Password? 🤔
          </span>
        </div>

        {/* Login Button */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading ? '#fdcb6e' : 'linear-gradient(135deg, #ff9f43, #f0932b)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 6px 25px rgba(255, 159, 67, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            minHeight: '56px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></span>
              LOGGING IN...
            </>
          ) : (
            '🌟 LET\'S GO!'
          )}
        </button>

        {/* Sign up link */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#b2bec3',
          marginTop: '1.2rem',
          marginBottom: 0
        }}>
          Don't have an account?{' '}
          <span style={{
            color: '#ff9f43',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Sign Up
          </span>
        </p>

        {/* Bible Verse */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.65rem',
          color: '#b2bec3',
          marginTop: '0.8rem',
          marginBottom: 0,
          opacity: 0.7
        }}>
          ✝️ "Let the little children come to me" - Matthew 19:14
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-container {
          background: linear-gradient(180deg, #f5e6d3 0%, #e8d5b7 100%);
        }

        /* Hide scrollbar */
        .login-card::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }

        /* Desktop improvements */
        @media (min-width: 769px) {
          .login-container {
            align-items: center !important;
            padding: 20px !important;
          }

          .login-card {
            border-radius: 40px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
            max-width: 450px !important;
            padding: 2.5rem 2rem !important;
            max-height: 90vh !important;
          }

          .login-card::before {
            display: none;
          }

          .login-container > div:not(.login-card) {
            display: block !important;
          }
        }

        /* Small phones */
        @media (max-width: 420px) {
          .login-card {
            padding: 1.5rem 1.2rem 2rem !important;
            border-radius: 30px 30px 0 0 !important;
          }

          .login-card h1 {
            font-size: 1.3rem !important;
          }

          .login-card p {
            font-size: 0.75rem !important;
          }

          .login-card input {
            padding: 0.8rem 0.8rem 0.8rem 3rem !important;
            font-size: 15px !important;
          }

          .login-card button[type="button"] {
            min-height: 44px !important;
          }

          .login-card .login-btn {
            min-height: 50px !important;
            font-size: 1rem !important;
            padding: 0.8rem !important;
          }

          .login-card .role-btn {
            padding: 0.6rem 0.3rem !important;
            font-size: 0.8rem !important;
          }

          .login-card .role-btn span:last-child {
            font-size: 0.75rem !important;
          }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .login-card {
            padding: 1.2rem 0.8rem 1.5rem !important;
            border-radius: 24px 24px 0 0 !important;
          }

          .login-card h1 {
            font-size: 1.1rem !important;
          }

          .login-card .subtitle {
            font-size: 0.7rem !important;
            margin-bottom: 1.2rem !important;
          }

          .login-card input {
            padding: 0.7rem 0.6rem 0.7rem 2.8rem !important;
            font-size: 14px !important;
          }

          .login-card input::placeholder {
            font-size: 0.75rem !important;
          }

          .login-card .login-btn {
            min-height: 44px !important;
            font-size: 0.85rem !important;
            padding: 0.6rem !important;
          }

          .login-card .role-btn {
            padding: 0.5rem 0.2rem !important;
            font-size: 0.7rem !important;
          }

          .login-card .role-btn span:last-child {
            font-size: 0.65rem !important;
          }

          .login-card .forgot-password {
            font-size: 0.65rem !important;
            margin-bottom: 0.8rem !important;
          }

          .login-card .error-message {
            font-size: 0.7rem !important;
            padding: 8px 10px !important;
          }

          .login-card .signup-text {
            font-size: 0.7rem !important;
          }

          .login-card .bible-verse {
            font-size: 0.55rem !important;
          }

          .login-card .icon-header {
            font-size: 2rem !important;
          }

          .login-card .top-line {
            margin-bottom: 1rem !important;
            width: 40px !important;
          }
        }

        /* Prevent zoom on input focus */
        @media (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }

        /* Safe area support */
        @supports (padding: max(0px)) {
          .login-card {
            padding-bottom: max(2.5rem, env(safe-area-inset-bottom)) !important;
          }
        }

        /* Remove autofill background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #faf8f5 inset !important;
          -webkit-text-fill-color: #2d3436 !important;
        }
      `}</style>
    </div>
  )
}
