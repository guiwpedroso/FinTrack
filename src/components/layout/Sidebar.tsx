import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFinance } from '@/contexts/FinanceContext'
import { cn } from '@/utils/cn'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenNewTransaction: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenNewTransaction,
}) => {
  const { user, isDemoMode, signOut } = useAuth()
  const { profile } = useFinance()

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Orçamentos', icon: PieChart },
    { to: '/goals', label: 'Metas', icon: Target },
    { to: '/reports', label: 'Relatórios', icon: BarChart3 },
    { to: '/settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col border-r transition-all duration-300 z-30 select-none',
        'bg-white dark:bg-dark-900 border-gray-200 dark:border-dark-700/80',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5 border-b border-gray-100 dark:border-dark-800 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-glow-emerald shrink-0">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                Fin<span className="text-emerald-500">Track</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">
                Finance Dashboard
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Demo Mode Badge */}
      {!collapsed && (
        <div className="px-4 pt-4">
          {isDemoMode ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              <div className="leading-tight">
                <p className="text-xs font-bold">Modo Demonstração</p>
                <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Dados salvos localmente</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <div className="leading-tight">
                <p className="text-xs font-bold">Firebase Conectado</p>
                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Nuvem Firestore ativa</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={onOpenNewTransaction}
          className={cn(
            'w-full flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
            'bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow-emerald hover:shadow-glow-emerald-lg',
            collapsed ? 'p-3' : 'py-2.5 px-4 gap-2 text-sm'
          )}
          title="Nova Transação"
        >
          <Plus className="w-5 h-5" />
          {!collapsed && <span>Nova Transação</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-800'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-dark-800">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                {profile.displayName || user?.displayName || 'Usuário'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'demo@fintrack.app'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut()}
              className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
