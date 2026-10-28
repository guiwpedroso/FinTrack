import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const ProtectedRoute: React.FC = () => {
  const { user, loading, isDemoMode } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <LoadingSpinner message="Verificando sessão de usuário..." />
      </div>
    )
  }

  // Allow access if user is logged in or if demo mode is enabled
  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
