import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  icon?: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  children,
  icon,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none rounded-xl text-sm transition-all duration-200 outline-none cursor-pointer',
            'bg-gray-50 dark:bg-dark-900/80 text-gray-900 dark:text-gray-100',
            'border border-gray-300 dark:border-dark-700',
            'focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
            icon ? 'pl-10' : 'pl-3.5',
            'pr-10 py-2.5',
            error && 'border-rose-500 dark:border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        >
          {options ? options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100">
              {opt.label}
            </option>
          )) : children}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 font-medium animate-fade-in">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
