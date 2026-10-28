import React from 'react'
import { Moon, Sun, Menu, Calendar, Plus } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useFinance } from '@/contexts/FinanceContext'
import { PeriodFilter } from '@/types'

interface HeaderProps {
  title: string
  subtitle?: string
  onOpenMobileMenu: () => void
  onOpenNewTransaction: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenNewTransaction,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { period, setPeriod } = useFinance()

  const periodOptions: { value: PeriodFilter; label: string }[] = [
    { value: 'this_month', label: 'Este Mês' },
    { value: 'last_month', label: 'Mês Passado' },
    { value: 'last_3_months', label: 'Últimos 3 Meses' },
    { value: 'last_6_months', label: 'Últimos 6 Meses' },
    { value: 'this_year', label: 'Este Ano' },
    { value: 'all', label: 'Todo o Período' },
  ]

  return (
    <header className="h-20 border-b bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-gray-200 dark:border-dark-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Title & Mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          title="Menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions: Period filter, theme toggle & quick mobile add button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Period Selector */}
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-emerald-500 hidden sm:block">
            <Calendar className="w-4 h-4" />
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
            className="appearance-none text-xs sm:text-sm font-semibold py-2 pl-3 sm:pl-9 pr-7 rounded-xl cursor-pointer outline-none transition-all
              bg-gray-100 dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-dark-700
              hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            title="Filtrar dados por período"
          >
            {periodOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 pointer-events-none text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Mobile New Transaction */}
        <button
          onClick={onOpenNewTransaction}
          className="md:hidden p-2 rounded-xl bg-emerald-500 text-white shadow-glow-emerald"
          title="Nova Transação"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-750 border border-gray-200 dark:border-dark-700 transition-all duration-200"
          title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-600" />
          )}
        </button>
      </div>
    </header>
  )
}
