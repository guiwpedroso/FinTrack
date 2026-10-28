import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Goal } from '@/types'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/utils/formatters'
import { DollarSign, CheckSquare, Square } from 'lucide-react'

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const { contributeToGoal } = useFinance()
  const [amount, setAmount] = useState<string>('')
  const [createTx, setCreateTx] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!goal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Informe um valor de aporte válido e positivo')
      return
    }

    setIsSubmitting(true)
    try {
      await contributeToGoal(goal.id, parsed, createTx)
      setAmount('')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const parsedAmount = parseFloat(amount.replace(',', '.')) || 0
  const projectedTotal = goal.currentAmount + parsedAmount
  const projectedPct = Math.min(100, (projectedTotal / goal.targetAmount) * 100)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Aporte na Meta"
      subtitle={`Adicionar fundos para "${goal.title}"`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-xs space-y-1">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Saldo Atual:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.currentAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Meta Total:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.targetAmount)}</span>
          </div>
          {parsedAmount > 0 && (
            <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-dark-700 text-emerald-500 font-bold">
              <span>Novo Saldo Estimado:</span>
              <span>{formatCurrency(projectedTotal)} ({projectedPct.toFixed(1)}%)</span>
            </div>
          )}
        </div>

        <Input
          label="Valor do Aporte (R$)"
          placeholder="Ex: 500,00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError('')
          }}
          error={error}
          icon={<DollarSign className="w-4 h-4" />}
          inputMode="decimal"
          required
          autoFocus
        />

        {/* Checkbox: create transaction */}
        <div 
          onClick={() => setCreateTx(!createTx)}
          className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 select-none pt-1"
        >
          {createTx ? (
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
          <span>Registrar saída no extrato de transações</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Confirmar Aporte
          </Button>
        </div>
      </form>
    </Modal>
  )
}
