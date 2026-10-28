import React from 'react'
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react'
import { DEFAULT_CATEGORIES } from '@/utils/categories'
import { TransactionType } from '@/types'

export type SortField = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

interface TransactionFiltersProps {
  searchTerm: string
  onSearchChange: (val: string) => void
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  selectedType: 'all' | TransactionType
  onTypeChange: (type: 'all' | TransactionType) => void
  sortBy: SortField
  onSortChange: (sort: SortField) => void
  onReset: () => void
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all
              bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-700
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl outline-none cursor-pointer transition-all
              bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-700
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Todas as Categorias</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sm:col-span-3 relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-gray-400 hidden sm:block">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="w-full text-xs sm:text-sm pl-3 sm:pl-9 pr-4 py-2.5 rounded-xl outline-none cursor-pointer transition-all
              bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-700
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="date_desc">Mais Recentes</option>
            <option value="date_asc">Mais Antigas</option>
            <option value="amount_desc">Maior Valor</option>
            <option value="amount_asc">Menor Valor</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="sm:col-span-1 flex justify-end">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 transition-colors"
            title="Redefinir filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type Toggle Pills */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-dark-700/60">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2">
          Filtrar tipo:
        </span>
        <button
          onClick={() => onTypeChange('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            selectedType === 'all'
              ? 'bg-emerald-500 text-white shadow-glow-emerald'
              : 'bg-gray-100 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => onTypeChange('income')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            selectedType === 'income'
              ? 'bg-emerald-500 text-white shadow-glow-emerald'
              : 'bg-gray-100 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
          }`}
        >
          Receitas
        </button>
        <button
          onClick={() => onTypeChange('expense')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            selectedType === 'expense'
              ? 'bg-rose-500 text-white shadow-glow-rose'
              : 'bg-gray-100 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
          }`}
        >
          Despesas
        </button>
      </div>
    </div>
  )
}
