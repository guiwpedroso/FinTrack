import React from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'glass'
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 border',
        variant === 'default' && 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700/80 shadow-sm dark:shadow-card-dark',
        variant === 'elevated' && 'bg-white dark:bg-dark-750 border-gray-200 dark:border-dark-600/70 shadow-md',
        variant === 'glass' && 'glass-panel border-gray-200/60 dark:border-white/10 shadow-lg',
        hoverEffect && 'hover:border-emerald-500/30 hover:shadow-glow-emerald hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
