import React from 'react'
import confetti from 'canvas-confetti'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Goal } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Target, Calendar, PlusCircle, Edit2, Trash2, CheckCircle2 } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onContribute: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onContribute,
  onEdit,
  onDelete,
}) => {
  const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const isCompleted = percentage >= 100

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal.deadline) return null
    const target = new Date(goal.deadline)
    const now = new Date()
    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#3b82f6', '#f59e0b'],
    })
  }

  return (
    <Card className="p-5 sm:p-6 space-y-4 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: goal.color || '#10b981' }}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                {goal.title}
              </h4>
              {goal.category && (
                <p className="text-[11px] text-gray-400">{goal.category}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              title="Editar meta"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              title="Excluir meta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount & Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-gray-400">
              Alvo: <strong className="text-gray-700 dark:text-gray-300">{formatCurrency(goal.targetAmount)}</strong>
            </span>
          </div>

          <ProgressBar
            value={percentage}
            size="md"
            variant={isCompleted ? 'emerald' : 'emerald'}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-emerald-500">
              {percentage.toFixed(1)}% alcançado
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {isCompleted ? 'Meta atingida!' : `Faltam ${formatCurrency(remaining)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-gray-100 dark:border-dark-700/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Prazo: {formatDate(goal.deadline)}</span>
          </div>

          {daysRemaining !== null && (
            <span className={daysRemaining < 0 ? 'text-rose-500 font-semibold' : 'text-gray-400'}>
              {daysRemaining < 0
                ? 'Prazo vencido'
                : daysRemaining === 0
                ? 'Termina hoje'
                : `${daysRemaining} dias restantes`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
              onClick={handleCelebrate}
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            >
              Comemorar Conquista 🎉
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onContribute(goal)}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Registrar Aporte
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
