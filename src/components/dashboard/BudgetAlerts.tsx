import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { BudgetStatusItem } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import { AlertTriangle, AlertOctagon, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react'

interface BudgetAlertsProps {
  budgetStatuses: BudgetStatusItem[]
}

export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ budgetStatuses }) => {
  const alerts = budgetStatuses.filter(b => b.status === 'warning' || b.status === 'danger')

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            Alertas de Orçamento
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monitoramento de tetos de gastos que exigem sua atenção
          </p>
        </div>

        <Link
          to="/budgets"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
        >
          <span>Ver todos</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Todos os orçamentos sob controle!</p>
            <p className="text-[11px] opacity-80 mt-0.5">Nenhuma categoria ultrapassou 80% do limite mensal estipulado.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((item) => {
            const isDanger = item.status === 'danger'
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                  isDanger
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isDanger ? (
                  <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{item.category}</span>
                    <span className="font-extrabold">{item.percentage.toFixed(0)}% do teto</span>
                  </div>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    Gasto: {formatCurrency(item.spentAmount)} de {formatCurrency(item.limitAmount)}
                    {isDanger ? ' (Estourado!)' : ' (Atenção ao limite)'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
