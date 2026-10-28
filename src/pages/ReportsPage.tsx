import React, { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { CategoryReportTable } from '@/components/reports/CategoryReportTable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { exportTransactionsToCSV } from '@/utils/csvExport'
import { formatCurrency, formatMonthYear } from '@/utils/formatters'
import { 
  Download, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Calendar,
  CheckCircle2
} from 'lucide-react'

export const ReportsPage: React.FC = () => {
  const { 
    filteredTransactions, 
    transactions, 
    summary, 
    monthlyEvolution, 
    categoryExpenses, 
    categoryIncomes,
    period,
    loading 
  } = useFinance()

  const [compareMonthA, setCompareMonthA] = useState<string>(() => {
    return monthlyEvolution[monthlyEvolution.length - 1]?.fullMonth || '2026-10'
  })
  const [compareMonthB, setCompareMonthB] = useState<string>(() => {
    return monthlyEvolution[monthlyEvolution.length - 2]?.fullMonth || '2026-09'
  })

  // Compare 2 specific months from historical data
  const dataA = monthlyEvolution.find(m => m.fullMonth === compareMonthA) || { income: 0, expense: 0, balance: 0, month: compareMonthA }
  const dataB = monthlyEvolution.find(m => m.fullMonth === compareMonthB) || { income: 0, expense: 0, balance: 0, month: compareMonthB }

  const handleExportAll = () => {
    exportTransactionsToCSV(transactions, 'fintrack-relatorio-completo.csv')
  }

  const handleExportFiltered = () => {
    exportTransactionsToCSV(filteredTransactions, `fintrack-relatorio-${period}.csv`)
  }

  if (loading) {
    return <LoadingSpinner message="Calculando relatórios contábeis..." />
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Relatórios e Análise Financeira
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Diagnóstico completo de receitas, despesas, margem de economia e exportação
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportFiltered}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar Período Atual
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportAll}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar Histórico Completo
          </Button>
        </div>
      </div>

      {/* Period Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Receitas do Período
          </span>
          <p className="text-2xl font-extrabold text-emerald-500 mt-2">
            {formatCurrency(summary.totalIncome)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total creditado</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Despesas do Período
          </span>
          <p className="text-2xl font-extrabold text-rose-500 mt-2">
            {formatCurrency(summary.totalExpenses)}
          </p>
          <p className="text-xs text-gray-400">Total debitado</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Resultado Líquido
          </span>
          <p className={`text-2xl font-extrabold mt-2 ${summary.monthlySavings >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatCurrency(summary.monthlySavings)}
          </p>
          <p className="text-xs text-gray-400">Sobra operacional</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Índice de Poupança
          </span>
          <p className="text-2xl font-extrabold text-blue-500 mt-2">
            {summary.savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400">Porcentagem guardada da renda</p>
        </Card>
      </div>

      {/* Month-over-Month Comparison Tool */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-dark-700/80 pb-4">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Comparador Mensal Direto
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Selecione dois meses para comparar receitas, gastos e superávit lado a lado
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={compareMonthA}
              onChange={(e) => setCompareMonthA(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-800 dark:text-gray-200 outline-none"
            >
              {monthlyEvolution.map(m => (
                <option key={m.fullMonth} value={m.fullMonth}>
                  {formatMonthYear(m.fullMonth)}
                </option>
              ))}
            </select>

            <span className="text-xs text-gray-400 font-bold">vs</span>

            <select
              value={compareMonthB}
              onChange={(e) => setCompareMonthB(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-800 dark:text-gray-200 outline-none"
            >
              {monthlyEvolution.map(m => (
                <option key={m.fullMonth} value={m.fullMonth}>
                  {formatMonthYear(m.fullMonth)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Income Comparison */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 space-y-2">
            <span className="text-xs font-semibold text-gray-500">Receitas</span>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthA)}:</span>
              <strong className="text-emerald-500">{formatCurrency(dataA.income)}</strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthB)}:</span>
              <strong className="text-emerald-500">{formatCurrency(dataB.income)}</strong>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-dark-700 text-xs flex justify-between font-bold">
              <span>Diferença:</span>
              <span className={dataA.income >= dataB.income ? 'text-emerald-500' : 'text-rose-500'}>
                {formatCurrency(dataA.income - dataB.income)}
              </span>
            </div>
          </div>

          {/* Expense Comparison */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 space-y-2">
            <span className="text-xs font-semibold text-gray-500">Despesas</span>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthA)}:</span>
              <strong className="text-rose-500">{formatCurrency(dataA.expense)}</strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthB)}:</span>
              <strong className="text-rose-500">{formatCurrency(dataB.expense)}</strong>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-dark-700 text-xs flex justify-between font-bold">
              <span>Diferença:</span>
              <span className={dataA.expense <= dataB.expense ? 'text-emerald-500' : 'text-rose-500'}>
                {formatCurrency(dataA.expense - dataB.expense)}
              </span>
            </div>
          </div>

          {/* Balance Comparison */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 space-y-2">
            <span className="text-xs font-semibold text-gray-500">Saldo Líquido</span>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthA)}:</span>
              <strong className={dataA.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {formatCurrency(dataA.balance)}
              </strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{formatMonthYear(compareMonthB)}:</span>
              <strong className={dataB.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {formatCurrency(dataB.balance)}
              </strong>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-dark-700 text-xs flex justify-between font-bold">
              <span>Variação:</span>
              <span className={dataA.balance >= dataB.balance ? 'text-emerald-500' : 'text-rose-500'}>
                {formatCurrency(dataA.balance - dataB.balance)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Evolution Chart */}
      <IncomeExpenseChart data={monthlyEvolution} />

      {/* Category In-depth Table */}
      <CategoryReportTable
        categories={categoryExpenses}
        totalExpense={summary.totalExpenses}
      />
    </div>
  )
}
