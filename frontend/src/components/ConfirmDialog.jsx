// src/components/ConfirmDialog.jsx
import { useState } from 'react'

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: null
  })

  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setConfig({
        title: options.title || 'Are you sure?',
        message: options.message || 'This action cannot be undone.',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'danger',
        onConfirm: () => {
          resolve(true)
          setIsOpen(false)
        },
        onCancel: () => {
          resolve(false)
          setIsOpen(false)
        }
      })
      setIsOpen(true)
    })
  }

  const ConfirmDialog = () => {
    if (!isOpen) return null

    const colors = {
      danger: {
        icon: '🗑️',
        bg: '#FFE8E8',
        border: '#FF6B6B',
        gradient: 'linear-gradient(135deg, #FF6B6B, #EE5A24)'
      },
      warning: {
        icon: '⚠️',
        bg: '#FFF8E1',
        border: '#FFD93D',
        gradient: 'linear-gradient(135deg, #FFD93D, #F9A825)'
      },
      info: {
        icon: 'ℹ️',
        bg: '#E6F9F7',
        border: '#4ECDC4',
        gradient: 'linear-gradient(135deg, #4ECDC4, #00B894)'
      }
    }

    const style = colors[config.type] || colors.danger

    return (
      <>
        {/* Backdrop */}
        <div
          onClick={() => {
            if (config.onCancel) config.onCancel()
            setIsOpen(false)
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999
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
            maxWidth: '400px',
            width: '90%',
            zIndex: 10000,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: style.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              border: `2px solid ${style.border}40`
            }}
          >
            {style.icon}
          </div>

          {/* Title */}
          <h3
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: '#2D3436',
              margin: '0 0 8px'
            }}
          >
            {config.title}
          </h3>

          {/* Message */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#636E72',
              margin: '0 0 24px',
              lineHeight: 1.5
            }}
          >
            {config.message}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <button
              onClick={() => {
                if (config.onCancel) config.onCancel()
                setIsOpen(false)
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: '#F1F2F6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#636E72',
                cursor: 'pointer'
              }}
            >
              {config.cancelText}
            </button>
            <button
              onClick={() => {
                if (config.onConfirm) config.onConfirm()
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: style.gradient,
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
                boxShadow: `0 4px 15px ${style.border}40`
              }}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </>
    )
  }

  return { showConfirm, ConfirmDialog }
}