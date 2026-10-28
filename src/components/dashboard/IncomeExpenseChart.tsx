import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { MonthlyChartData } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { TrendingUp } from 'lucide-react'

interface IncomeExpenseChartProps {
  data: MonthlyChartData[]
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0
      const balance = income - expense

      return (
        <div className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-gray-800 dark:text-gray-200 pb-1 border-b border-gray-100 dark:border-dark-700">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Receitas:</span>
            <span className="font-semibold">{formatCurrency(income)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400">
            <span>Despesas:</span>
            <span className="font-semibold">{formatCurrency(expense)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100 dark:border-dark-700 font-bold text-gray-900 dark:text-white">
            <span>Saldo Líquido:</span>
            <span className={balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Evolução Mensal (Receitas vs Despesas)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Comparativo dos últimos 6 meses calculado com base nas suas transações
          </p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#33445c" opacity={0.25} vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 15, fontSize: '12px' }}
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {value === 'income' ? 'Receitas' : 'Despesas'}
                </span>
              )}
            />
            <Bar
              dataKey="income"
              name="income"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expense"
              name="expense"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
