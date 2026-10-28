import React from 'react'
import { Card } from '@/components/ui/Card'
import { CategorySummary } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface CategoryReportTableProps {
  categories: CategorySummary[]
  totalExpense: number
}

export const CategoryReportTable: React.FC<CategoryReportTableProps> = ({
  categories,
  totalExpense,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-dark-700/80">
        <h3 className="font-bold text-base text-gray-900 dark:text-white">
          Detalhamento de Gastos por Categoria
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Visão minuciosa sobre a distribuição e ticket médio das suas despesas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-700/80 bg-gray-50/50 dark:bg-dark-900/50 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-5">Categoria</th>
              <th className="py-3 px-5 text-right">Total Gasto</th>
              <th className="py-3 px-5">Participação</th>
              <th className="py-3 px-5 text-right">Lançamentos</th>
              <th className="py-3 px-5 text-right">Ticket Médio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700/60">
            {categories.map((c) => {
              const avg = c.count > 0 ? c.amount / c.count : 0
              return (
                <tr key={c.category} className="hover:bg-gray-50/50 dark:hover:bg-dark-750/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {c.category}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(c.amount)}
                  </td>

                  <td className="py-3.5 px-5 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <ProgressBar value={c.percentage} size="sm" variant="emerald" />
                      <span className="text-xs text-gray-500 font-semibold w-10 text-right">
                        {c.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right text-gray-500 dark:text-gray-400">
                    {c.count} {c.count === 1 ? 'item' : 'itens'}
                  </td>

                  <td className="py-3.5 px-5 text-right text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {formatCurrency(avg)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
