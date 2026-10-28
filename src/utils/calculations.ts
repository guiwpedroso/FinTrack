import { 
  Transaction, 
  PeriodFilter, 
  FinancialSummary, 
  MonthlyChartData, 
  CategorySummary, 
  Budget 
} from '@/types'
import { getCategoryColor } from './categories'

/**
 * Filter transactions based on selected period
 */
export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: PeriodFilter,
  referenceDate: Date = new Date()
): Transaction[] => {
  if (period === 'all') return transactions

  const now = referenceDate
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  return transactions.filter(t => {
    if (!t.date) return false
    const parts = t.date.split('-').map(Number)
    if (parts.length < 3) return false
    const [tYear, tMonth] = parts // tMonth is 1-indexed

    if (period === 'this_month') {
      return tYear === currentYear && tMonth === (currentMonth + 1)
    }

    if (period === 'last_month') {
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const lastMonth = currentMonth === 0 ? 12 : currentMonth
      return tYear === lastMonthYear && tMonth === lastMonth
    }

    if (period === 'last_3_months') {
      const transDate = new Date(parts[0], parts[1] - 1, parts[2])
      const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1)
      return transDate >= threeMonthsAgo && transDate <= now
    }

    if (period === 'last_6_months') {
      const transDate = new Date(parts[0], parts[1] - 1, parts[2])
      const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1)
      return transDate >= sixMonthsAgo && transDate <= now
    }

    if (period === 'this_year') {
      return tYear === currentYear
    }

    return true
  })
}

/**
 * Calculates percentage variation safely
 */
const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / Math.abs(previous)) * 100
}

/**
 * Compute key financial metrics and comparison against previous period
 */
export const calculateFinancialSummary = (
  allTransactions: Transaction[],
  period: PeriodFilter = 'this_month'
): FinancialSummary => {
  const currentPeriodTransactions = filterTransactionsByPeriod(allTransactions, period)
  
  // Total balance: all-time net balance (all income minus all expenses in user ledger)
  const totalBalance = allTransactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount
  }, 0)

  // Current period totals
  const totalIncome = currentPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpenses = currentPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const monthlySavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0

  // Calculate previous period for comparison
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  let prevPeriodTransactions: Transaction[] = []
  if (period === 'this_month') {
    prevPeriodTransactions = filterTransactionsByPeriod(allTransactions, 'last_month')
  } else if (period === 'last_month') {
    const twoMonthsAgoYear = currentMonth <= 1 ? currentYear - 1 : currentYear
    const twoMonthsAgoMonth = currentMonth === 0 ? 11 : currentMonth === 1 ? 12 : currentMonth - 1
    prevPeriodTransactions = allTransactions.filter(t => {
      const parts = t.date.split('-').map(Number)
      return parts[0] === twoMonthsAgoYear && parts[1] === twoMonthsAgoMonth
    })
  } else {
    // For other periods, compare with previous equal window
    prevPeriodTransactions = []
  }

  const prevIncome = prevPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const prevExpenses = prevPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const prevBalance = prevIncome - prevExpenses

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    monthlySavings,
    savingsRate,
    prevMonthComparison: {
      incomePercent: calculatePercentChange(totalIncome, prevIncome),
      expensesPercent: calculatePercentChange(totalExpenses, prevExpenses),
      balancePercent: calculatePercentChange(monthlySavings, prevBalance),
    },
  }
}

/**
 * Calculates breakdown by category (grouped, sorted, percentages)
 */
export const calculateCategoryBreakdown = (
  transactions: Transaction[],
  type: 'expense' | 'income' = 'expense'
): CategorySummary[] => {
  const filtered = transactions.filter(t => t.type === type)
  const total = filtered.reduce((acc, t) => acc + t.amount, 0)

  const categoryMap = new Map<string, { amount: number; count: number }>()

  filtered.forEach(t => {
    const current = categoryMap.get(t.category) || { amount: 0, count: 0 }
    categoryMap.set(t.category, {
      amount: current.amount + t.amount,
      count: current.count + 1,
    })
  })

  const result: CategorySummary[] = []
  categoryMap.forEach((val, category) => {
    result.push({
      category,
      amount: val.amount,
      count: val.count,
      percentage: total > 0 ? (val.amount / total) * 100 : 0,
      color: getCategoryColor(category),
    })
  })

  // Sort descending by amount
  return result.sort((a, b) => b.amount - a.amount)
}

/**
 * Calculate historical monthly evolution (last N months) from real data
 */
export const calculateMonthlyEvolution = (
  transactions: Transaction[],
  monthsCount: number = 6
): MonthlyChartData[] => {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const list: MonthlyChartData[] = []

  for (let i = monthsCount - 1; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1)
    const y = targetDate.getFullYear()
    const m = targetDate.getMonth() // 0-indexed

    const fullMonthStr = `${y}-${String(m + 1).padStart(2, '0')}`
    const label = `${monthNames[m]}/${String(y).slice(2)}`

    // Find transactions in this specific month
    const monthTransactions = transactions.filter(t => {
      if (!t.date) return false
      return t.date.startsWith(fullMonthStr)
    })

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)

    list.push({
      month: label,
      fullMonth: fullMonthStr,
      income,
      expense,
      balance: income - expense,
    })
  }

  return list
}

export interface BudgetStatusItem {
  id: string
  category: string
  limitAmount: number
  spentAmount: number
  remainingAmount: number
  percentage: number
  status: 'safe' | 'warning' | 'danger'
  transactionCount: number
}

/**
 * Calculate budget status per category based on real expenses in given month
 */
export const calculateBudgetStatuses = (
  budgets: Budget[],
  transactions: Transaction[],
  targetMonthStr?: string
): BudgetStatusItem[] => {
  const monthPrefix = targetMonthStr || new Date().toISOString().slice(0, 7) // "YYYY-MM"

  // Filter expenses belonging to the target month
  const monthExpenses = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(monthPrefix)
  )

  return budgets.map(budget => {
    const categoryExpenses = monthExpenses.filter(
      t => t.category.toLowerCase() === budget.category.toLowerCase()
    )

    const spentAmount = categoryExpenses.reduce((acc, t) => acc + t.amount, 0)
    const limitAmount = budget.limitAmount
    const remainingAmount = Math.max(0, limitAmount - spentAmount)
    const percentage = limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0

    let status: 'safe' | 'warning' | 'danger' = 'safe'
    if (percentage >= 100) {
      status = 'danger'
    } else if (percentage >= 80) {
      status = 'warning'
    }

    return {
      id: budget.id,
      category: budget.category,
      limitAmount,
      spentAmount,
      remainingAmount,
      percentage,
      status,
      transactionCount: categoryExpenses.length,
    }
  }).sort((a, b) => b.percentage - a.percentage)
}
