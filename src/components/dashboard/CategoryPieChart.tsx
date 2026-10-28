import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Card } from '@/components/ui/Card'
import { CategorySummary } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { PieChart as PieChartIcon } from 'lucide-react'

interface CategoryPieChartProps {
  categories: CategorySummary[]
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ categories }) => {
  // Take top 5 categories, and group remainder into 'Outros' if more than 5
  const topCategories = categories.slice(0, 5)
  if (categories.length > 5) {
    const remainder = categories.slice(5)
    const otherAmount = remainder.reduce((acc, c) => acc + c.amount, 0)
    const otherPercent = remainder.reduce((acc, c) => acc + c.percentage, 0)
    topCategories.push({
      category: 'Outros',
      amount: otherAmount,
      percentage: otherPercent,
      count: remainder.reduce((acc, c) => acc + c.count, 0),
      color: '#64748b',
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategorySummary
      return (
        <div className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            {data.category}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Total: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(data.amount)}</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Participação: <span className="font-bold text-emerald-500">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              Despesas por Categoria
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Distribuição percentual dos seus gastos no período
            </p>
          </div>
        </div>

        {topCategories.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-xs text-gray-400 text-center">
            Nenhuma despesa registrada para o período selecionado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Donut chart */}
            <div className="h-[210px] sm:col-span-6 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={topCategories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="transparent"
                  >
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom List Legend */}
            <div className="sm:col-span-6 space-y-2.5">
              {topCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-[11px] text-gray-400 w-11 text-right">
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
