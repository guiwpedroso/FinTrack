import React, { useState } from 'react'
import { Transaction } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => Promise<void>
  onNewTransaction: () => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onNewTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const itemsPerPage = 8
  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = transactions.slice(startIndex, startIndex + itemsPerPage)

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return
    setIsDeleting(true)
    try {
      await onDelete(transactionToDelete.id)
      setTransactionToDelete(null)
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-4">
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Você ainda não possui transações cadastradas para os filtros selecionados."
          actionLabel="Adicionar Nova Transação"
          onAction={onNewTransaction}
        />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <Card className="overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700/80 bg-gray-50/50 dark:bg-dark-900/50 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Transação</th>
                <th className="py-3.5 px-5">Categoria</th>
                <th className="py-3.5 px-5">Data</th>
                <th className="py-3.5 px-5 text-right">Valor</th>
                <th className="py-3.5 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700/60 text-sm">
              {currentItems.map((tx) => {
                const isIncome = tx.type === 'income'
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-dark-750/50 transition-colors group"
                  >
                    {/* Title & Icon */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <CategoryIcon categoryName={tx.category} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {tx.title}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">
                              {tx.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-5">
                      <Badge variant="neutral" size="sm">
                        {tx.category}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <span
                        className={`font-bold inline-flex items-center gap-0.5 ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                          title="Editar transação"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTransactionToDelete(tx)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                          title="Excluir transação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card List View */}
      <div className="sm:hidden space-y-3">
        {currentItems.map((tx) => {
          const isIncome = tx.type === 'income'
          return (
            <Card key={tx.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    <CategoryIcon categoryName={tx.category} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <p className="text-[11px] text-gray-400">{formatDate(tx.date)}</p>
                  </div>
                </div>

                <span
                  className={`text-sm font-bold shrink-0 ${
                    isIncome ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-700/60">
                <Badge variant="neutral" size="sm">
                  {tx.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 text-gray-400 hover:text-emerald-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTransactionToDelete(tx)}
                    className="p-1.5 text-gray-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Página <strong className="text-gray-900 dark:text-white">{currentPage}</strong> de{' '}
            <strong className="text-gray-900 dark:text-white">{totalPages}</strong> ({transactions.length} registros)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-750 transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-750 transition-colors"
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(transactionToDelete)}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Transação"
        message={`Tem certeza de que deseja remover a transação "${transactionToDelete?.title}"? Esta ação recalculará seus saldos imediatamente.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
