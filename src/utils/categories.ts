import { CategoryMeta } from '@/types'

export const DEFAULT_CATEGORIES: CategoryMeta[] = [
  // Despesas
  { id: 'alimentacao', name: 'Alimentação', type: 'expense', icon: 'UtensilsCrossed', color: '#f59e0b' },
  { id: 'moradia', name: 'Moradia', type: 'expense', icon: 'Home', color: '#ef4444' },
  { id: 'transporte', name: 'Transporte', type: 'expense', icon: 'Car', color: '#8b5cf6' },
  { id: 'saude', name: 'Saúde & Bem-estar', type: 'expense', icon: 'HeartPulse', color: '#ec4899' },
  { id: 'educacao', name: 'Educação', type: 'expense', icon: 'GraduationCap', color: '#3b82f6' },
  { id: 'lazer', name: 'Lazer & Cultura', type: 'expense', icon: 'Gamepad2', color: '#14b8a6' },
  { id: 'compras', name: 'Compras & Vestuário', type: 'expense', icon: 'ShoppingBag', color: '#f97316' },
  { id: 'assinaturas', name: 'Assinaturas & Serviços', type: 'expense', icon: 'Tv', color: '#6366f1' },
  { id: 'outras_despesas', name: 'Outras Despesas', type: 'expense', icon: 'Tag', color: '#64748b' },

  // Receitas
  { id: 'salario', name: 'Salário', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 'freelance', name: 'Freelance & Projetos', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { id: 'investimentos', name: 'Investimentos & Dividendos', type: 'income', icon: 'TrendingUp', color: '#34d399' },
  { id: 'rendimentos', name: 'Rendimentos Passivos', type: 'income', icon: 'Coins', color: '#84cc16' },
  { id: 'vendas', name: 'Vendas & Negócios', type: 'income', icon: 'Store', color: '#eab308' },
  { id: 'outras_receitas', name: 'Outras Receitas', type: 'income', icon: 'PlusCircle', color: '#22c55e' },
]

export const getCategoryByName = (name: string): CategoryMeta | undefined => {
  return DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase())
}

export const getCategoryColor = (name: string): string => {
  const cat = getCategoryByName(name)
  if (cat) return cat.color
  // Fallback hash color
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#f97316']
  return colors[Math.abs(hash) % colors.length]
}

export const getExpenseCategories = (): CategoryMeta[] => {
  return DEFAULT_CATEGORIES.filter(c => c.type === 'expense')
}

export const getIncomeCategories = (): CategoryMeta[] => {
  return DEFAULT_CATEGORIES.filter(c => c.type === 'income')
}
