import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  endAdornment?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  endAdornment,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl text-sm transition-all duration-200 outline-none',
            'bg-gray-50 dark:bg-dark-900/80 text-gray-900 dark:text-gray-100',
            'border border-gray-300 dark:border-dark-700',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
            icon ? 'pl-10' : 'pl-3.5',
            endAdornment ? 'pr-12' : 'pr-3.5',
            'py-2.5',
            error && 'border-rose-500 dark:border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3.5 text-gray-400 dark:text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-500 font-medium animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </div>
  )
})

Input.displayName = 'Input'
