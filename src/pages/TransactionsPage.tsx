import React, { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionFilters, SortField } from '@/components/transactions/TransactionFilters'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { exportTransactionsToCSV } from '@/utils/csvExport'
import { Transaction, TransactionType } from '@/types'
import { Plus, Download } from 'lucide-react'

export const TransactionsPage: React.FC = () => {
  const { filteredTransactions, deleteTransaction, loading } = useFinance()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all')
  const [sortBy, setSortBy] = useState<SortField>('date_desc')

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Apply in-memory search, filter, and sorting on filteredTransactions
  const processedTransactions = useMemo(() => {
    let result = [...filteredTransactions]

    // Search query
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        t => t.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter(t => t.type === selectedType)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === 'date_asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      if (sortBy === 'amount_desc') {
        return b.amount - a.amount
      }
      if (sortBy === 'amount_asc') {
        return a.amount - b.amount
      }
      return 0
    })

    return result
  }, [filteredTransactions, searchTerm, selectedCategory, selectedType, sortBy])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedType('all')
    setSortBy('date_desc')
  }

  const handleOpenNew = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx)
    setIsModalOpen(true)
  }

  const handleExportCSV = () => {
    exportTransactionsToCSV(processedTransactions, 'fintrack-extrato.csv')
  }

  if (loading) {
    return <LoadingSpinner message="Carregando transações..." />
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Extrato de Lançamentos
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {processedTransactions.length}{' '}
            {processedTransactions.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenNew}
            icon={<Plus className="w-4 h-4" />}
          >
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Data Table */}
      <TransactionTable
        transactions={processedTransactions}
        onEdit={handleEdit}
        onDelete={deleteTransaction}
        onNewTransaction={handleOpenNew}
      />

      {/* Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  )
}
