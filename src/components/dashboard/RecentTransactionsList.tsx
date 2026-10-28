import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Transaction } from '@/types'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ArrowUpRight, ArrowDownRight, ChevronRight, Clock } from 'lucide-react'

interface RecentTransactionsListProps {
  transactions: Transaction[]
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({ transactions }) => {
  const recent = transactions.slice(0, 5)

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            Últimas Transações
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Lançamentos mais recentes registrados na sua conta
          </p>
        </div>

        <Link
          to="/transactions"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
        >
          <span>Ver todas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          Nenhuma transação cadastrada recentemente.
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-dark-700/60">
          {recent.map((tx) => {
            const isIncome = tx.type === 'income'
            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 duration-200 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    <CategoryIcon categoryName={tx.category} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold flex items-center justify-end gap-0.5 ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
