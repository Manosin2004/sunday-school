// src/context/ConfirmContext.jsx
import { createContext, useContext, useState } from 'react'

// Create Context
const ConfirmContext = createContext()

// Provider Component
export function ConfirmProvider({ children }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [config, setConfig] = useState({
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: null,
    onCancel: null
  })

  // Show confirmation dialog - returns Promise
  const showConfirmation = (options) => {
    return new Promise((resolve) => {
      setConfig({
        title: options?.title || 'Are you sure?',
        message: options?.message || 'This action cannot be undone.',
        confirmText: options?.confirmText || 'Yes, Delete',
        cancelText: options?.cancelText || 'Cancel',
        type: options?.type || 'danger',
        onConfirm: () => {
          resolve(true)
          setShowConfirm(false)
        },
        onCancel: () => {
          resolve(false)
          setShowConfirm(false)
        }
      })
      setShowConfirm(true)
    })
  }

  // Close dialog without action
  const closeConfirm = () => {
    setShowConfirm(false)
    if (config.onCancel) config.onCancel()
  }

  return (
    <ConfirmContext.Provider value={{ showConfirmation, closeConfirm }}>
      {children}
      {showConfirm && (
        <ConfirmationDialog 
          config={config} 
          onClose={closeConfirm}
        />
      )}
    </ConfirmContext.Provider>
  )
}

// Custom hook to use confirm
export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

// Confirmation Dialog Component
function ConfirmationDialog({ config, onClose }) {
  const getColors = () => {
    switch(config.type) {
      case 'danger':
        return {
          icon: '🗑️',
          bg: '#FFE8E8',
          border: '#FF6B6B',
          color: '#FF6B6B',
          gradient: 'linear-gradient(135deg, #FF6B6B, #EE5A24)'
        }
      case 'warning':
        return {
          icon: '⚠️',
          bg: '#FFF8E1',
          border: '#FFD93D',
          color: '#FFD93D',
          gradient: 'linear-gradient(135deg, #FFD93D, #F9A825)'
        }
      case 'info':
        return {
          icon: 'ℹ️',
          bg: '#E6F9F7',
          border: '#4ECDC4',
          color: '#4ECDC4',
          gradient: 'linear-gradient(135deg, #4ECDC4, #00B894)'
        }
      default:
        return {
          icon: '🗑️',
          bg: '#FFE8E8',
          border: '#FF6B6B',
          color: '#FF6B6B',
          gradient: 'linear-gradient(135deg, #FF6B6B, #EE5A24)'
        }
    }
  }

  const colors = getColors()

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm()
  }

  const handleCancel = () => {
    if (config.onCancel) config.onCancel()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleCancel}
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
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          margin: '0 auto 16px',
          border: `2px solid ${colors.border}40`
        }}>
          {colors.icon}
        </div>

        {/* Title */}
        <h3 style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 700,
          color: '#2D3436',
          margin: '0 0 8px'
        }}>
          {config.title}
        </h3>

        {/* Message */}
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#636E72',
          margin: '0 0 24px',
          lineHeight: 1.5
        }}>
          {config.message}
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleCancel}
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
            {config.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '12px',
              background: colors.gradient,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: `0 4px 15px ${colors.border}40`,
              touchAction: 'manipulation'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 6px 25px ${colors.border}60`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 4px 15px ${colors.border}40`
            }}
          >
            {config.confirmText}
          </button>
        </div>
      </div>

      <style>{`
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
        @media (max-width: 420px) {
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
      `}</style>
    </>
  )
}