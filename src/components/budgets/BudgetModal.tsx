import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Budget } from '@/types'
import { useFinance } from '@/contexts/FinanceContext'
import { getExpenseCategories } from '@/utils/categories'
import { DollarSign } from 'lucide-react'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  budgetToEdit?: { id?: string; category: string; limitAmount: number } | null
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budgetToEdit,
}) => {
  const { saveBudget } = useFinance()
  const [category, setCategory] = useState<string>('Alimentação')
  const [limitAmount, setLimitAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const expenseCategories = getExpenseCategories()

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category)
      setLimitAmount(budgetToEdit.limitAmount.toString())
      setError('')
    } else {
      setCategory('Alimentação')
      setLimitAmount('')
      setError('')
    }
  }, [budgetToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(limitAmount.replace(',', '.'))
    if (!limitAmount || isNaN(parsed) || parsed <= 0) {
      setError('Informe um limite mensal válido e positivo')
      return
    }

    setIsSubmitting(true)
    try {
      await saveBudget({
        id: budgetToEdit?.id,
        category,
        limitAmount: parsed,
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Editar Teto de Gastos' : 'Definir Novo Orçamento'}
      subtitle="Estipule um limite mensal para controlar despesas nesta categoria"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={Boolean(budgetToEdit?.id)}
          options={expenseCategories.map(c => ({ value: c.name, label: c.name }))}
        />

        <Input
          label="Limite Mensal (R$)"
          placeholder="Ex: 1500,00"
          value={limitAmount}
          onChange={(e) => {
            setLimitAmount(e.target.value)
            setError('')
          }}
          error={error}
          icon={<DollarSign className="w-4 h-4" />}
          inputMode="decimal"
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {budgetToEdit ? 'Atualizar Limite' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
