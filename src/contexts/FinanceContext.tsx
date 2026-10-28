import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { 
  Transaction, 
  Budget, 
  Goal, 
  UserProfile, 
  PeriodFilter, 
  FinancialSummary, 
  MonthlyChartData, 
  CategorySummary 
} from '@/types'
import { StorageService } from '@/services/storageService'
import { DEMO_USER } from '@/services/mockData'
import { 
  filterTransactionsByPeriod, 
  calculateFinancialSummary, 
  calculateMonthlyEvolution, 
  calculateCategoryBreakdown,
  calculateBudgetStatuses,
  BudgetStatusItem
} from '@/utils/calculations'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

interface FinanceContextData {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  profile: UserProfile
  period: PeriodFilter
  setPeriod: (period: PeriodFilter) => void
  summary: FinancialSummary
  monthlyEvolution: MonthlyChartData[]
  categoryExpenses: CategorySummary[]
  categoryIncomes: CategorySummary[]
  budgetStatuses: BudgetStatusItem[]
  loading: boolean
  addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<Transaction>
  updateTransaction: (transaction: Transaction) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  saveBudget: (budget: Omit<Budget, 'id' | 'userId'> & { id?: string }) => Promise<Budget>
  deleteBudget: (id: string) => Promise<void>
  saveGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'> & { id?: string }) => Promise<Goal>
  deleteGoal: (id: string) => Promise<void>
  contributeToGoal: (goalId: string, amount: number, createTx?: boolean) => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  resetDemoData: () => Promise<void>
  refreshData: () => Promise<void>
}

const FinanceContext = createContext<FinanceContextData | null>(null)

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth()
  const { success, error: toastError } = useToast()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [profile, setProfile] = useState<UserProfile>(DEMO_USER)
  const [period, setPeriod] = useState<PeriodFilter>('this_month')
  const [loading, setLoading] = useState<boolean>(true)

  const activeUserId = user?.uid || 'demo-user-123'
  const isDemo = isDemoMode || !user || user.isDemo

  // Load all user data
  const loadData = useCallback(async () => {
    if (!activeUserId) return
    setLoading(true)
    try {
      const [txs, bgs, gls, prof] = await Promise.all([
        StorageService.getTransactions(activeUserId, isDemo),
        StorageService.getBudgets(activeUserId, isDemo),
        StorageService.getGoals(activeUserId, isDemo),
        StorageService.getUserProfile(activeUserId, isDemo),
      ])
      setTransactions(txs)
      setBudgets(bgs)
      setGoals(gls)
      setProfile(prof)
    } catch (err) {
      console.error('Falha ao carregar dados financeiros', err)
      toastError('Erro ao carregar dados', 'Não foi possível sincronizar suas informações financeiras.')
    } finally {
      setLoading(false)
    }
  }, [activeUserId, isDemo, toastError])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Calculated state derived from real transactions and active filter
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByPeriod(transactions, period)
  }, [transactions, period])

  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions, period)
  }, [transactions, period])

  const monthlyEvolution = useMemo(() => {
    return calculateMonthlyEvolution(transactions, 6)
  }, [transactions])

  const categoryExpenses = useMemo(() => {
    return calculateCategoryBreakdown(filteredTransactions, 'expense')
  }, [filteredTransactions])

  const categoryIncomes = useMemo(() => {
    return calculateCategoryBreakdown(filteredTransactions, 'income')
  }, [filteredTransactions])

  const budgetStatuses = useMemo(() => {
    return calculateBudgetStatuses(budgets, transactions)
  }, [budgets, transactions])

  // Actions
  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<Transaction> => {
    try {
      const newTx = await StorageService.addTransaction(
        { ...data, userId: activeUserId },
        activeUserId,
        isDemo
      )
      setTransactions(prev => [newTx, ...prev])
      success('Transação adicionada', `"${data.title}" foi registrada com sucesso.`)
      return newTx
    } catch (err) {
      console.error(err)
      toastError('Erro ao salvar transação', 'Por favor tente novamente.')
      throw err
    }
  }

  const updateTransaction = async (transaction: Transaction): Promise<void> => {
    try {
      await StorageService.updateTransaction(transaction, activeUserId, isDemo)
      setTransactions(prev => prev.map(t => (t.id === transaction.id ? transaction : t)))
      success('Transação atualizada', `"${transaction.title}" foi alterada com sucesso.`)
    } catch (err) {
      console.error(err)
      toastError('Erro ao atualizar transação', 'Por favor tente novamente.')
      throw err
    }
  }

  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      await StorageService.deleteTransaction(id, activeUserId, isDemo)
      setTransactions(prev => prev.filter(t => t.id !== id))
      success('Transação removida', 'O registro foi excluído.')
    } catch (err) {
      console.error(err)
      toastError('Erro ao excluir transação', 'Por favor tente novamente.')
      throw err
    }
  }

  const saveBudget = async (budget: Omit<Budget, 'id' | 'userId'> & { id?: string }): Promise<Budget> => {
    try {
      const saved = await StorageService.saveBudget({ ...budget, userId: activeUserId }, activeUserId, isDemo)
      setBudgets(prev => {
        const index = prev.findIndex(b => b.id === saved.id || b.category.toLowerCase() === saved.category.toLowerCase())
        if (index >= 0) {
          const next = [...prev]
          next[index] = saved
          return next
        }
        return [...prev, saved]
      })
      success('Orçamento salvo', `Limite para "${saved.category}" atualizado.`)
      return saved
    } catch (err) {
      console.error(err)
      toastError('Erro ao salvar orçamento', 'Verifique os valores informados.')
      throw err
    }
  }

  const deleteBudget = async (id: string): Promise<void> => {
    try {
      await StorageService.deleteBudget(id, activeUserId, isDemo)
      setBudgets(prev => prev.filter(b => b.id !== id))
      success('Orçamento removido', 'O teto de gastos foi removido.')
    } catch (err) {
      console.error(err)
      toastError('Erro ao remover orçamento', 'Tente novamente.')
      throw err
    }
  }

  const saveGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'> & { id?: string }): Promise<Goal> => {
    try {
      const saved = await StorageService.saveGoal({ ...goal, userId: activeUserId }, activeUserId, isDemo)
      setGoals(prev => {
        const index = prev.findIndex(g => g.id === saved.id)
        if (index >= 0) {
          const next = [...prev]
          next[index] = saved
          return next
        }
        return [...prev, saved]
      })
      success('Meta salva', `Meta "${saved.title}" atualizada com sucesso.`)
      return saved
    } catch (err) {
      console.error(err)
      toastError('Erro ao salvar meta', 'Verifique as informações da meta.')
      throw err
    }
  }

  const deleteGoal = async (id: string): Promise<void> => {
    try {
      await StorageService.deleteGoal(id, activeUserId, isDemo)
      setGoals(prev => prev.filter(g => g.id !== id))
      success('Meta removida', 'A meta foi excluída.')
    } catch (err) {
      console.error(err)
      toastError('Erro ao remover meta', 'Tente novamente.')
      throw err
    }
  }

  const contributeToGoal = async (goalId: string, amount: number, createTx: boolean = false): Promise<void> => {
    try {
      const updated = await StorageService.contributeToGoal(goalId, amount, activeUserId, isDemo)
      if (updated) {
        setGoals(prev => prev.map(g => (g.id === goalId ? updated : g)))
        
        // Optionally create an expense transaction for the deposit
        if (createTx && amount > 0) {
          await addTransaction({
            title: `Aporte Meta: ${updated.title}`,
            amount: amount,
            type: 'expense',
            category: 'Investimentos & Dividendos',
            date: new Date().toISOString().slice(0, 10),
            description: `Aporte automático registrado para a meta ${updated.title}`,
          })
        }
        success('Aporte realizado!', `Adicionado com sucesso à meta "${updated.title}".`)
      }
    } catch (err) {
      console.error(err)
      toastError('Erro ao realizar aporte', 'Não foi possível registrar o valor.')
      throw err
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    try {
      const updatedProfile = { ...profile, ...updates }
      await StorageService.updateUserProfile(updatedProfile, isDemo)
      setProfile(updatedProfile)
      success('Perfil atualizado', 'Suas preferências foram salvas com sucesso.')
    } catch (err) {
      console.error(err)
      toastError('Erro ao atualizar perfil', 'Tente novamente mais tarde.')
      throw err
    }
  }

  const resetDemoData = async (): Promise<void> => {
    StorageService.resetDemoData()
    await loadData()
    success('Dados restaurados', 'Os dados de exemplo foram restaurados com sucesso.')
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        filteredTransactions,
        budgets,
        goals,
        profile,
        period,
        setPeriod,
        summary,
        monthlyEvolution,
        categoryExpenses,
        categoryIncomes,
        budgetStatuses,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
        saveGoal,
        deleteGoal,
        contributeToGoal,
        updateProfile,
        resetDemoData,
        refreshData: loadData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
