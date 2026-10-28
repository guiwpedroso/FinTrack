import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald hover:shadow-glow-emerald-lg active:bg-emerald-700 focus:ring-emerald-500 dark:focus:ring-offset-dark-900 border border-emerald-500/20',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-dark-750 dark:hover:bg-dark-700 dark:text-gray-100 border border-gray-200 dark:border-dark-600 focus:ring-gray-400 dark:focus:ring-offset-dark-900',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose active:bg-rose-700 focus:ring-rose-500 dark:focus:ring-offset-dark-900 border border-rose-500/20',
    outline: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-750 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-dark-600 focus:ring-emerald-500 dark:focus:ring-offset-dark-900',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-750 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:ring-emerald-500 dark:focus:ring-offset-dark-900',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
