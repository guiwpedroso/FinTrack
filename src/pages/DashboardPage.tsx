import React from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList'
import { GoalsOverview } from '@/components/dashboard/GoalsOverview'
import { BudgetAlerts } from '@/components/dashboard/BudgetAlerts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { 
    summary, 
    monthlyEvolution, 
    categoryExpenses, 
    transactions, 
    goals, 
    budgetStatuses, 
    loading 
  } = useFinance()

  if (loading) {
    return <LoadingSpinner message="Carregando visão geral das finanças..." />
  }

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          title="Saldo Geral"
          amount={summary.totalBalance}
          percentageChange={summary.prevMonthComparison.balancePercent}
          icon={<Wallet className="w-5 h-5 text-emerald-500" />}
          type="balance"
          periodLabel="vs mês anterior"
        />

        <MetricCard
          title="Receitas do Período"
          amount={summary.totalIncome}
          percentageChange={summary.prevMonthComparison.incomePercent}
          icon={<ArrowUpRight className="w-5 h-5 text-emerald-500" />}
          type="income"
          periodLabel="vs período anterior"
        />

        <MetricCard
          title="Despesas do Período"
          amount={summary.totalExpenses}
          percentageChange={summary.prevMonthComparison.expensesPercent}
          icon={<ArrowDownRight className="w-5 h-5 text-rose-500" />}
          type="expense"
          periodLabel="vs período anterior"
        />

        <MetricCard
          title="Economia Líquida"
          amount={summary.monthlySavings}
          percentageChange={summary.savingsRate}
          icon={<PiggyBank className="w-5 h-5 text-blue-500" />}
          type="savings"
          periodLabel={`Taxa de poupança: ${summary.savingsRate.toFixed(1)}%`}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <IncomeExpenseChart data={monthlyEvolution} />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart categories={categoryExpenses} />
        </div>
      </div>

      {/* Secondary Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <RecentTransactionsList transactions={transactions} />
        <BudgetAlerts budgetStatuses={budgetStatuses} />
        <GoalsOverview goals={goals} />
      </div>
    </div>
  )
}
