import React, { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalModal } from '@/components/goals/GoalModal'
import { ContributeModal } from '@/components/goals/ContributeModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Goal } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { Plus, Target, Trophy, Sparkles } from 'lucide-react'

export const GoalsPage: React.FC = () => {
  const { goals, deleteGoal, loading } = useFinance()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0)
  const totalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0)
  const overallPct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
  const completedGoalsCount = goals.filter(g => g.currentAmount >= g.targetAmount).length

  const handleOpenNew = () => {
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setIsModalOpen(true)
  }

  const handleContribute = (goal: Goal) => {
    setContributeGoal(goal)
  }

  const handleDeleteConfirm = async () => {
    if (!goalToDelete) return
    setIsDeleting(true)
    try {
      await deleteGoal(goalToDelete)
      setGoalToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Carregando metas financeiras..." />
  }

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Metas & Objetivos Financeiros
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Transforme sonhos em planos mensuráveis com prazos definidos e aportes contínuos
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenNew}
          icon={<Plus className="w-4 h-4" />}
        >
          Criar Nova Meta
        </Button>
      </div>

      {/* Summary KPI Banner */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-white via-white to-emerald-50/30 dark:from-dark-800 dark:via-dark-800 dark:to-emerald-950/20 border-emerald-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Patrimônio Reservado
            </span>
            <p className="text-2xl font-extrabold text-emerald-500">
              {formatCurrency(totalCurrent)}
            </p>
            <p className="text-xs text-gray-400">Total acumulado em todas as metas</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Alvo Global
            </span>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalTarget)}
            </p>
            <p className="text-xs text-gray-400">Soma dos objetivos desejados</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Progresso Médio
            </span>
            <p className="text-2xl font-extrabold text-blue-500">
              {overallPct.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">Taxa média de realização</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Metas Concluídas
            </span>
            <p className="text-2xl font-extrabold text-amber-500 flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              {completedGoalsCount} de {goals.length}
            </p>
            <p className="text-xs text-gray-400">Objetivos já 100% atingidos</p>
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="p-4">
          <EmptyState
            title="Nenhuma meta criada"
            description="Crie metas com valores e prazos (ex: Reserva de Emergência, Viagem, Setup Novo) e registre seus depósitos periodicamente."
            actionLabel="Criar Primeira Meta"
            onAction={handleOpenNew}
            icon={<Target className="w-8 h-8 text-emerald-500" />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={handleContribute}
              onEdit={handleEdit}
              onDelete={id => setGoalToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Goal Modal (Add / Edit) */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={editingGoal}
      />

      {/* Contribution Modal */}
      <ContributeModal
        isOpen={Boolean(contributeGoal)}
        onClose={() => setContributeGoal(null)}
        goal={contributeGoal}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Meta"
        message="Tem certeza de que deseja remover esta meta financeira? O histórico das suas transações não será afetado."
        confirmText="Sim, excluir"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
