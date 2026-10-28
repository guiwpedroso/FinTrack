import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextData {
  showToast: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextData | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const duration = toast.duration ?? 4500
    const newToast: Toast = { ...toast, id, duration }

    setToasts(prev => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const success = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'success' })
  }, [showToast])

  const error = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'error' })
  }, [showToast])

  const warning = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'warning' })
  }, [showToast])

  const info = useCallback((title: string, description?: string) => {
    showToast({ title, description, type: 'info' })
  }, [showToast])

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />
    }
  }

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30'
      case 'error':
        return 'border-rose-500/30'
      case 'warning':
        return 'border-amber-500/30'
      case 'info':
        return 'border-blue-500/30'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div 
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md',
              'bg-gray-900/95 text-white border transition-all duration-300 animate-slide-up',
              'dark:bg-dark-800/95 dark:text-gray-100',
              getBorderColor(t.type)
            )}
          >
            {getToastIcon(t.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-wide text-gray-100">{t.title}</p>
              {t.description && (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg"
              title="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
