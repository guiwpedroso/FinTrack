import React from 'react'
import { Card } from '@/components/ui/Card'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { cn } from '@/utils/cn'

interface MetricCardProps {
  title: string
  amount: number
  percentageChange?: number
  icon: React.ReactNode
  type?: 'balance' | 'income' | 'expense' | 'savings'
  periodLabel?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  percentageChange,
  icon,
  type = 'balance',
  periodLabel = 'vs mês anterior',
}) => {
  const getBadge = () => {
    if (percentageChange === undefined || isNaN(percentageChange)) return null

    const isPositive = percentageChange > 0
    const isNeutral = percentageChange === 0

    // For expenses, an increase is technically red/warning, and a decrease is green
    const isGood = type === 'expense' ? !isPositive : isPositive

    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border leading-none',
          isNeutral && 'bg-gray-100 text-gray-600 dark:bg-dark-750 dark:text-gray-400 border-gray-200 dark:border-dark-600',
          !isNeutral && isGood && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          !isNeutral && !isGood && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        )}
      >
        {isNeutral ? (
          <Minus className="w-3 h-3" />
        ) : isPositive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        <span>{formatPercent(percentageChange)}</span>
      </div>
    )
  }

  const getBorderAccent = () => {
    switch (type) {
      case 'income':
        return 'group-hover:border-emerald-500/40'
      case 'expense':
        return 'group-hover:border-rose-500/40'
      case 'savings':
        return 'group-hover:border-blue-500/40'
      default:
        return 'group-hover:border-emerald-500/40'
    }
  }

  const getIconBackground = () => {
    switch (type) {
      case 'income':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'expense':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
      case 'savings':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      default:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    }
  }

  return (
    <Card className={cn('p-5 sm:p-6 group relative overflow-hidden transition-all duration-300', getBorderAccent())}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 duration-200', getIconBackground())}>
          {icon}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {formatCurrency(amount)}
        </div>

        <div className="flex items-center gap-2">
          {getBadge()}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {periodLabel}
          </span>
        </div>
      </div>
    </Card>
  )
}
