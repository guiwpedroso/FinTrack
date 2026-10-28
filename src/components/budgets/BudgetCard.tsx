import React from 'react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { BudgetStatusItem } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import { Edit2, Trash2, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface BudgetCardProps {
  item: BudgetStatusItem
  onEdit: (item: BudgetStatusItem) => void
  onDelete: (id: string) => void
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ item, onEdit, onDelete }) => {
  const isDanger = item.status === 'danger'
  const isWarning = item.status === 'warning'

  const getStatusBadge = () => {
    if (isDanger) {
      return (
        <Badge variant="rose" size="sm">
          <AlertCircle className="w-3 h-3" />
          <span>Excedido ({item.percentage.toFixed(0)}%)</span>
        </Badge>
      )
    }
    if (isWarning) {
      return (
        <Badge variant="amber" size="sm">
          <AlertTriangle className="w-3 h-3" />
          <span>Atenção ({item.percentage.toFixed(0)}%)</span>
        </Badge>
      )
    }
    return (
      <Badge variant="emerald" size="sm">
        <CheckCircle className="w-3 h-3" />
        <span>Normal ({item.percentage.toFixed(0)}%)</span>
      </Badge>
    )
  }

  return (
    <Card className="p-5 space-y-4 hover:border-emerald-500/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-750 border border-gray-200 dark:border-dark-600 flex items-center justify-center text-emerald-500">
            <CategoryIcon categoryName={item.category} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              {item.category}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {item.transactionCount} lançamentos neste mês
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            title="Editar teto"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            title="Remover orçamento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Gasto Atual</span>
          <span className="font-extrabold text-gray-900 dark:text-white">
            {formatCurrency(item.spentAmount)} <span className="font-normal text-gray-400">/ {formatCurrency(item.limitAmount)}</span>
          </span>
        </div>

        <ProgressBar
          value={item.percentage}
          variant={isDanger ? 'rose' : isWarning ? 'amber' : 'emerald'}
          size="md"
        />

        <div className="flex items-center justify-between pt-1">
          {getStatusBadge()}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {isDanger ? (
              <span className="text-rose-500 font-bold">
                Excedido em {formatCurrency(item.spentAmount - item.limitAmount)}
              </span>
            ) : (
              <span>Resta {formatCurrency(item.remainingAmount)}</span>
            )}
          </span>
        </div>
      </div>
    </Card>
  )
}
