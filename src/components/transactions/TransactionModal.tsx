import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Transaction, TransactionType } from '@/types'
import { useFinance } from '@/contexts/FinanceContext'
import { getExpenseCategories, getIncomeCategories } from '@/utils/categories'
import { ArrowDownRight, ArrowUpRight, DollarSign, Calendar, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transactionToEdit?: Transaction | null
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { addTransaction, updateTransaction } = useFinance()

  const [type, setType] = useState<TransactionType>('expense')
  const [title, setTitle] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Populate fields when editing
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type)
      setTitle(transactionToEdit.title)
      setAmount(transactionToEdit.amount.toString())
      setCategory(transactionToEdit.category)
      setDate(transactionToEdit.date)
      setDescription(transactionToEdit.description || '')
      setErrors({})
    } else {
      setType('expense')
      setTitle('')
      setAmount('')
      setCategory('Alimentação')
      setDate(new Date().toISOString().slice(0, 10))
      setDescription('')
      setErrors({})
    }
  }, [transactionToEdit, isOpen])

  // Adjust default category when type toggles if empty or incompatible
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    if (newType === 'expense') {
      setCategory('Alimentação')
    } else {
      setCategory('Salário')
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = 'Informe o título da transação'
    } else if (title.trim().length < 2) {
      newErrors.title = 'O título deve ter pelo menos 2 caracteres'
    }

    const numericAmount = parseFloat(amount.replace(',', '.'))
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = 'Informe um valor válido maior que zero'
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria'
    }

    if (!date) {
      newErrors.date = 'Informe a data'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const numericAmount = parseFloat(amount.replace(',', '.'))

    try {
      if (transactionToEdit) {
        await updateTransaction({
          ...transactionToEdit,
          title: title.trim(),
          amount: numericAmount,
          type,
          category,
          date,
          description: description.trim() || undefined,
        })
      } else {
        await addTransaction({
          title: title.trim(),
          amount: numericAmount,
          type,
          category,
          date,
          description: description.trim() || undefined,
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = type === 'expense' ? getExpenseCategories() : getIncomeCategories()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
      subtitle={transactionToEdit ? 'Modifique os detalhes do lançamento' : 'Cadastre uma receita ou despesa no seu histórico'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              type === 'expense'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Despesa</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              type === 'income'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Receita</span>
          </button>
        </div>

        {/* Title Input */}
        <Input
          label="Título"
          placeholder="Ex: Supermercado Pão de Açúcar"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            placeholder="0,00"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            icon={<DollarSign className="w-4 h-4" />}
            required
          />

          <Input
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            icon={<Calendar className="w-4 h-4" />}
            required
          />
        </div>

        {/* Category Selector */}
        <Select
          label="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={errors.category}
          options={categories.map(c => ({ value: c.name, label: c.name }))}
        />

        {/* Description Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            Descrição (opcional)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione anotações ou detalhes sobre o pagamento..."
              className={cn(
                'w-full rounded-xl text-sm transition-all duration-200 outline-none p-3',
                'bg-gray-50 dark:bg-dark-900/80 text-gray-900 dark:text-gray-100',
                'border border-gray-300 dark:border-dark-700',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              )}
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={type === 'expense' ? 'danger' : 'primary'}
            isLoading={isSubmitting}
          >
            {transactionToEdit ? 'Salvar Alterações' : 'Adicionar Transação'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
