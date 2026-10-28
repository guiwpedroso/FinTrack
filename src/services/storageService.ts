import { db, isFirebaseConfigured } from './firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  setDoc,
  getDoc
} from 'firebase/firestore'
import { Transaction, Budget, Goal, UserProfile } from '@/types'
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_GOALS, DEMO_USER } from './mockData'

const STORAGE_KEYS = {
  TRANSACTIONS: 'fintrack_demo_transactions',
  BUDGETS: 'fintrack_demo_budgets',
  GOALS: 'fintrack_demo_goals',
  PROFILE: 'fintrack_demo_profile',
}

// Helper for LocalStorage operations
class LocalStorageRepository {
  static getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS))
      return INITIAL_TRANSACTIONS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_TRANSACTIONS
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  }

  static getBudgets(): Budget[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS))
      return INITIAL_BUDGETS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_BUDGETS
    }
  }

  static saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  }

  static getGoals(): Goal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS))
      return INITIAL_GOALS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_GOALS
    }
  }

  static saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
  }

  static getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_USER))
      return DEMO_USER
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEMO_USER
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  }

  static resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS))
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS))
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS))
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_USER))
  }
}

// Unified Service API
export const StorageService = {
  // === TRANSACTIONS ===
  async getTransactions(userId: string, isDemo: boolean): Promise<Transaction[]> {
    if (isDemo || !isFirebaseConfigured || !db) {
      return LocalStorageRepository.getTransactions()
    }
    try {
      const q = query(collection(db, 'users', userId, 'transactions'))
      const snapshot = await getDocs(q)
      const list: Transaction[] = []
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Transaction)
      })
      // Sort by date descending
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.warn('Erro ao carregar transações do Firestore, usando fallback local.', error)
      return LocalStorageRepository.getTransactions()
    }
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>, userId: string, isDemo: boolean): Promise<Transaction> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getTransactions()
      const newTx: Transaction = {
        ...transaction,
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId,
        createdAt: new Date().toISOString(),
      }
      all.unshift(newTx)
      LocalStorageRepository.saveTransactions(all)
      return newTx
    }

    const colRef = collection(db, 'users', userId, 'transactions')
    const docRef = await addDoc(colRef, {
      ...transaction,
      userId,
      createdAt: new Date().toISOString(),
    })
    return {
      ...transaction,
      id: docRef.id,
      userId,
    }
  },

  async updateTransaction(transaction: Transaction, userId: string, isDemo: boolean): Promise<void> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getTransactions()
      const updated = all.map(t => (t.id === transaction.id ? transaction : t))
      LocalStorageRepository.saveTransactions(updated)
      return
    }

    const docRef = doc(db, 'users', userId, 'transactions', transaction.id)
    await updateDoc(docRef, { ...transaction })
  },

  async deleteTransaction(transactionId: string, userId: string, isDemo: boolean): Promise<void> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getTransactions()
      const filtered = all.filter(t => t.id !== transactionId)
      LocalStorageRepository.saveTransactions(filtered)
      return
    }

    const docRef = doc(db, 'users', userId, 'transactions', transactionId)
    await deleteDoc(docRef)
  },

  // === BUDGETS ===
  async getBudgets(userId: string, isDemo: boolean): Promise<Budget[]> {
    if (isDemo || !isFirebaseConfigured || !db) {
      return LocalStorageRepository.getBudgets()
    }
    try {
      const q = query(collection(db, 'users', userId, 'budgets'))
      const snapshot = await getDocs(q)
      const list: Budget[] = []
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Budget)
      })
      return list
    } catch {
      return LocalStorageRepository.getBudgets()
    }
  },

  async saveBudget(budget: Omit<Budget, 'id'> & { id?: string }, userId: string, isDemo: boolean): Promise<Budget> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getBudgets()
      if (budget.id) {
        const updated = all.map(b => (b.id === budget.id ? ({ ...budget, id: budget.id, userId } as Budget) : b))
        LocalStorageRepository.saveBudgets(updated)
        return { ...budget, id: budget.id, userId } as Budget
      } else {
        // Check if category already has budget
        const existingIndex = all.findIndex(b => b.category.toLowerCase() === budget.category.toLowerCase())
        if (existingIndex >= 0) {
          all[existingIndex] = { ...all[existingIndex], limitAmount: budget.limitAmount }
          LocalStorageRepository.saveBudgets(all)
          return all[existingIndex]
        }
        const newBudget: Budget = {
          ...budget,
          id: `bg-${Date.now()}`,
          userId,
        }
        all.push(newBudget)
        LocalStorageRepository.saveBudgets(all)
        return newBudget
      }
    }

    if (budget.id) {
      const docRef = doc(db, 'users', userId, 'budgets', budget.id)
      await updateDoc(docRef, { ...budget })
      return { ...budget, id: budget.id, userId } as Budget
    } else {
      const colRef = collection(db, 'users', userId, 'budgets')
      const docRef = await addDoc(colRef, { ...budget, userId })
      return { ...budget, id: docRef.id, userId }
    }
  },

  async deleteBudget(budgetId: string, userId: string, isDemo: boolean): Promise<void> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getBudgets()
      LocalStorageRepository.saveBudgets(all.filter(b => b.id !== budgetId))
      return
    }

    const docRef = doc(db, 'users', userId, 'budgets', budgetId)
    await deleteDoc(docRef)
  },

  // === GOALS ===
  async getGoals(userId: string, isDemo: boolean): Promise<Goal[]> {
    if (isDemo || !isFirebaseConfigured || !db) {
      return LocalStorageRepository.getGoals()
    }
    try {
      const q = query(collection(db, 'users', userId, 'goals'))
      const snapshot = await getDocs(q)
      const list: Goal[] = []
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Goal)
      })
      return list
    } catch {
      return LocalStorageRepository.getGoals()
    }
  },

  async saveGoal(goal: Omit<Goal, 'id'> & { id?: string }, userId: string, isDemo: boolean): Promise<Goal> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getGoals()
      if (goal.id) {
        const updated = all.map(g => (g.id === goal.id ? ({ ...goal, id: goal.id, userId } as Goal) : g))
        LocalStorageRepository.saveGoals(updated)
        return { ...goal, id: goal.id, userId } as Goal
      } else {
        const newGoal: Goal = {
          ...goal,
          id: `goal-${Date.now()}`,
          userId,
          createdAt: new Date().toISOString(),
        }
        all.push(newGoal)
        LocalStorageRepository.saveGoals(all)
        return newGoal
      }
    }

    if (goal.id) {
      const docRef = doc(db, 'users', userId, 'goals', goal.id)
      await updateDoc(docRef, { ...goal })
      return { ...goal, id: goal.id, userId } as Goal
    } else {
      const colRef = collection(db, 'users', userId, 'goals')
      const docRef = await addDoc(colRef, {
        ...goal,
        userId,
        createdAt: new Date().toISOString(),
      })
      return { ...goal, id: docRef.id, userId }
    }
  },

  async deleteGoal(goalId: string, userId: string, isDemo: boolean): Promise<void> {
    if (isDemo || !isFirebaseConfigured || !db) {
      const all = LocalStorageRepository.getGoals()
      LocalStorageRepository.saveGoals(all.filter(g => g.id !== goalId))
      return
    }

    const docRef = doc(db, 'users', userId, 'goals', goalId)
    await deleteDoc(docRef)
  },

  async contributeToGoal(goalId: string, deltaAmount: number, userId: string, isDemo: boolean): Promise<Goal | null> {
    const goals = await this.getGoals(userId, isDemo)
    const target = goals.find(g => g.id === goalId)
    if (!target) return null

    const updatedGoal = {
      ...target,
      currentAmount: Math.max(0, target.currentAmount + deltaAmount),
    }

    return this.saveGoal(updatedGoal, userId, isDemo)
  },

  // === PROFILE & SETTINGS ===
  async getUserProfile(userId: string, isDemo: boolean): Promise<UserProfile> {
    if (isDemo || !isFirebaseConfigured || !db) {
      return LocalStorageRepository.getProfile()
    }
    try {
      const docRef = doc(db, 'users', userId, 'profile', 'info')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile
      }
      return {
        uid: userId,
        displayName: 'Usuário FinTrack',
        email: '',
        currency: 'BRL',
        theme: 'dark',
      }
    } catch {
      return LocalStorageRepository.getProfile()
    }
  },

  async updateUserProfile(profile: UserProfile, isDemo: boolean): Promise<void> {
    if (isDemo || !isFirebaseConfigured || !db) {
      LocalStorageRepository.saveProfile(profile)
      return
    }

    const docRef = doc(db, 'users', profile.uid, 'profile', 'info')
    await setDoc(docRef, profile, { merge: true })
  },

  resetDemoData: LocalStorageRepository.resetDemoData,
}
