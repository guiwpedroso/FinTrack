import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Goal } from '@/types'
import { useFinance } from '@/contexts/FinanceContext'
import { DEFAULT_CATEGORIES } from '@/utils/categories'
import { DollarSign, Calendar } from 'lucide-react'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  goalToEdit?: Goal | null
}

const PRESET_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#f97316', // orange
]

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { saveGoal } = useFinance()

  const [title, setTitle] = useState<string>('')
  const [targetAmount, setTargetAmount] = useState<string>('')
  const [currentAmount, setCurrentAmount] = useState<string>('0')
  const [deadline, setDeadline] = useState<string>('')
  const [category, setCategory] = useState<string>('Investimentos & Dividendos')
  const [color, setColor] = useState<string>(PRESET_COLORS[0])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title)
      setTargetAmount(goalToEdit.targetAmount.toString())
      setCurrentAmount(goalToEdit.currentAmount.toString())
      setDeadline(goalToEdit.deadline)
      setCategory(goalToEdit.category || 'Investimentos & Dividendos')
      setColor(goalToEdit.color || PRESET_COLORS[0])
      setErrors({})
    } else {
      setTitle('')
      setTargetAmount('')
      setCurrentAmount('0')
      // Default deadline to 6 months from now
      const future = new Date()
      future.setMonth(future.getMonth() + 6)
      setDeadline(future.toISOString().slice(0, 10))
      setCategory('Investimentos & Dividendos')
      setColor(PRESET_COLORS[0])
      setErrors({})
    }
  }, [goalToEdit, isOpen])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) {
      errs.title = 'Informe o nome da meta financeira'
    }

    const parsedTarget = parseFloat(targetAmount.replace(',', '.'))
    if (!targetAmount || isNaN(parsedTarget) || parsedTarget <= 0) {
      errs.targetAmount = 'Informe um valor alvo válido'
    }

    const parsedCurrent = parseFloat(currentAmount.replace(',', '.'))
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      errs.currentAmount = 'Informe um valor atual válido (ou zero)'
    }

    if (!deadline) {
      errs.deadline = 'Informe o prazo estimado'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const parsedTarget = parseFloat(targetAmount.replace(',', '.'))
    const parsedCurrent = parseFloat(currentAmount.replace(',', '.'))

    try {
      await saveGoal({
        id: goalToEdit?.id,
        title: title.trim(),
        targetAmount: parsedTarget,
        currentAmount: parsedCurrent,
        deadline,
        category,
        color,
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
      title={goalToEdit ? 'Editar Meta Financeira' : 'Criar Nova Meta'}
      subtitle="Defina um objetivo financeiro e monitore a evolução do seu patrimônio"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Meta"
          placeholder="Ex: Reserva de Emergência, Entrada do Imóvel..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Valor Desejado (R$)"
            placeholder="Ex: 25000,00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
            icon={<DollarSign className="w-4 h-4" />}
            inputMode="decimal"
            required
          />

          <Input
            label="Valor Já Acumulado (R$)"
            placeholder="0,00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            error={errors.currentAmount}
            icon={<DollarSign className="w-4 h-4" />}
            inputMode="decimal"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prazo Alvo"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            error={errors.deadline}
            icon={<Calendar className="w-4 h-4" />}
            required
          />

          <Select
            label="Categoria Relacionada"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={DEFAULT_CATEGORIES.map(c => ({ value: c.name, label: c.name }))}
          />
        </div>

        {/* Color picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            Cor de Identificação
          </label>
          <div className="flex items-center gap-3">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-dark-900' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {goalToEdit ? 'Atualizar Meta' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
