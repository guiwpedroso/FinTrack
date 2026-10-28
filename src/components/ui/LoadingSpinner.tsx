import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Carregando informações...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
          <Loader2 className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        {message}
      </p>
    </div>
  )
}
