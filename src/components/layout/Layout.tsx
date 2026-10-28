import React, { useState } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  BarChart3, 
  Settings,
  Plus,
  X,
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false)
  const location = useLocation()
  const { isDemoMode } = useAuth()

  // Get current page header title & subtitle
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', subtitle: 'Visão geral dos seus ativos, receitas e despesas' }
      case '/transactions':
        return { title: 'Transações', subtitle: 'Gerencie e filtre todos os seus lançamentos financeiros' }
      case '/budgets':
        return { title: 'Orçamentos', subtitle: 'Monitore tetos de gastos e limites por categoria' }
      case '/goals':
        return { title: 'Metas Financeiras', subtitle: 'Acompanhe objetivos e reserve economias com foco' }
      case '/reports':
        return { title: 'Relatórios & Exportação', subtitle: 'Análises detalhadas e download de planilhas' }
      case '/settings':
        return { title: 'Configurações', subtitle: 'Preferências pessoais, moeda e conexão com nuvem' }
      default:
        return { title: 'FinTrack', subtitle: 'Controle financeiro pessoal' }
    }
  }

  const { title, subtitle } = getPageInfo()

  const mobileNavItems = [
    { to: '/', label: 'Início', icon: LayoutDashboard },
    { to: '/transactions', label: 'Extrato', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Orçamentos', icon: PieChart },
    { to: '/goals', label: 'Metas', icon: Target },
    { to: '/reports', label: 'Relatórios', icon: BarChart3 },
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onOpenNewTransaction={() => setTransactionModalOpen(true)}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-white dark:bg-dark-900 h-full p-5 flex flex-col z-10 border-r border-gray-200 dark:border-dark-700 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                  Fin<span className="text-emerald-500">Track</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4">
              {isDemoMode ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Modo Demonstração Ativo</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Firebase Conectado</span>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {[
                ...mobileNavItems,
                { to: '/settings', label: 'Configurações', icon: Settings },
              ].map(item => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setTransactionModalOpen(true)
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-glow-emerald mt-4"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Transação</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewTransaction={() => setTransactionModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t border-gray-200 dark:border-dark-800 flex items-center justify-around px-2 z-30">
        {mobileNavItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-all',
                  isActive
                    ? 'text-emerald-500 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
      />
    </div>
  )
}
