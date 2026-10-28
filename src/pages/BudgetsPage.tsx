import React, { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { BudgetModal } from '@/components/budgets/BudgetModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BudgetStatusItem } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import { Plus, PieChart, ShieldCheck, AlertTriangle } from 'lucide-react'

export const BudgetsPage: React.FC = () => {
  const { budgetStatuses, deleteBudget, loading } = useFinance()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingBudget, setEditingBudget] = useState<{ id?: string; category: string; limitAmount: number } | null>(null)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Overall totals across all budgets
  const totalLimit = budgetStatuses.reduce((acc, b) => acc + b.limitAmount, 0)
  const totalSpent = budgetStatuses.reduce((acc, b) => acc + b.spentAmount, 0)
  const totalRemaining = Math.max(0, totalLimit - totalSpent)
  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  const handleOpenNew = () => {
    setEditingBudget(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: BudgetStatusItem) => {
    setEditingBudget({
      id: item.id,
      category: item.category,
      limitAmount: item.limitAmount,
    })
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!budgetToDelete) return
    setIsDeleting(true)
    try {
      await deleteBudget(budgetToDelete)
      setBudgetToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Carregando orçamentos..." />
  }

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Tetos de Gastos Mensais
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Defina limites por categoria para evitar imprevistos e manter sua saúde financeira
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenNew}
          icon={<Plus className="w-4 h-4" />}
        >
          Novo Orçamento
        </Button>
      </div>

      {/* Summary Banner */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-white via-white to-emerald-50/30 dark:from-dark-800 dark:via-dark-800 dark:to-emerald-950/20 border-emerald-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Orçado (Mês Atual)
            </span>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalLimit)}
            </p>
            <p className="text-xs text-gray-400">Soma de todos os tetos definidos</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Consumido
            </span>
            <p className={`text-2xl font-extrabold ${totalSpent > totalLimit ? 'text-rose-500' : 'text-emerald-500'}`}>
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-gray-400">{totalPercentage.toFixed(1)}% do teto geral consumido</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Saldo Restante Disponível
            </span>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-xs text-gray-400">Margem segura para o restante do mês</p>
          </div>
        </div>
      </Card>

      {/* Budgets Grid */}
      {budgetStatuses.length === 0 ? (
        <Card className="p-4">
          <EmptyState
            title="Nenhum orçamento configurado"
            description="Defina metas de gastos por categoria (Ex: Alimentação, Moradia, Transporte) para monitorar seus custos em tempo real."
            actionLabel="Criar Primeiro Orçamento"
            onAction={handleOpenNew}
            icon={<PieChart className="w-8 h-8 text-emerald-500" />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgetStatuses.map(item => (
            <BudgetCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={id => setBudgetToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budgetToEdit={editingBudget}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remover Orçamento"
        message="Tem certeza de que deseja remover o teto de gastos para esta categoria? As transações associadas não serão apagadas."
        confirmText="Sim, remover"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
