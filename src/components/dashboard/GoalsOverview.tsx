import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Goal } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { Target, ChevronRight } from 'lucide-react'

interface GoalsOverviewProps {
  goals: Goal[]
}

export const GoalsOverview: React.FC<GoalsOverviewProps> = ({ goals }) => {
  const displayGoals = goals.slice(0, 3)

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            Progresso de Metas
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Acompanhe o ritmo de realização dos seus objetivos
          </p>
        </div>

        <Link
          to="/goals"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
        >
          <span>Gerenciar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {displayGoals.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400">
          Nenhuma meta cadastrada ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {displayGoals.map((g) => {
            const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100)
            return (
              <div key={g.id} className="space-y-1.5 p-3 rounded-xl bg-gray-50 dark:bg-dark-850/60 border border-gray-100 dark:border-dark-700/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">
                    {g.title}
                  </span>
                  <span className="font-bold text-emerald-500 shrink-0">
                    {pct.toFixed(0)}%
                  </span>
                </div>

                <ProgressBar value={pct} size="sm" variant="emerald" />

                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
                  <span>Atual: {formatCurrency(g.currentAmount)}</span>
                  <span>Meta: {formatCurrency(g.targetAmount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
