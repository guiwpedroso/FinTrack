export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string // YYYY-MM-DD
  description?: string
  userId: string
  createdAt?: string
}

export interface Budget {
  id: string
  category: string
  limitAmount: number
  userId: string
}

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string // YYYY-MM-DD
  category?: string
  color?: string
  userId: string
  createdAt?: string
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  currency: 'BRL' | 'USD' | 'EUR'
  theme: 'dark' | 'light'
}

export interface CategoryMeta {
  id: string
  name: string
  type: TransactionType | 'both'
  icon: string
  color: string
}

export type PeriodFilter = 
  | 'this_month' 
  | 'last_month' 
  | 'last_3_months' 
  | 'last_6_months' 
  | 'this_year' 
  | 'all'

export interface FinancialSummary {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  monthlySavings: number
  savingsRate: number
  prevMonthComparison: {
    incomePercent: number
    expensesPercent: number
    balancePercent: number
  }
}

export interface MonthlyChartData {
  month: string // e.g. "Mai", "Jun", "Jul"
  fullMonth: string // e.g. "2026-05"
  income: number
  expense: number
  balance: number
}

export interface CategorySummary {
  category: string
  amount: number
  percentage: number
  count: number
  color: string
}
