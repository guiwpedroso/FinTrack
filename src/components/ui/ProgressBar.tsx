import React from 'react'
import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number // 0 to 100+
  max?: number
  className?: string
  showLabel?: boolean
  variant?: 'auto' | 'emerald' | 'amber' | 'rose' | 'blue'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = 'auto',
  size = 'md',
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  const getVariantColor = () => {
    if (variant !== 'auto') {
      const colors = {
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
        blue: 'bg-blue-500',
      }
      return colors[variant]
    }

    if (percentage >= 100) return 'bg-rose-500 shadow-glow-rose'
    if (percentage >= 80) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-gray-500 dark:text-gray-400">Progresso</span>
          <span className="text-gray-800 dark:text-gray-200">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div 
        className={cn(
          'w-full bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden',
          sizes[size],
          className
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getVariantColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
