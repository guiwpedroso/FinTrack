import React, { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { 
  User, 
  Moon, 
  Sun, 
  RotateCcw, 
  LogOut, 
  ShieldCheck, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, resetDemoData } = useFinance()
  const { user, isDemoMode, isFirebaseAvailable, signOut, enterDemoMode } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [displayName, setDisplayName] = useState<string>(profile.displayName || '')
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>(profile.currency || 'BRL')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false)
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile({
        displayName: displayName.trim(),
        currency,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetData = async () => {
    await resetDemoData()
    setIsResetConfirmOpen(false)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile & Preferences Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-dark-700/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Perfil e Preferências
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Personalize sua identificação e padrão de moeda
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome de Exibição"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />

            <Input
              label="E-mail"
              value={user?.email || 'demo@fintrack.app'}
              disabled
              helperText="E-mail vinculado à sua conta"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Moeda Principal"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              options={[
                { value: 'BRL', label: 'Real Brasileiro (R$ BRL)' },
                { value: 'USD', label: 'Dólar Americano ($ USD)' },
                { value: 'EUR', label: 'Euro (€ EUR)' },
              ]}
            />

            {/* Theme Toggle in Settings */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                Aparência da Plataforma
              </label>
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 text-sm font-medium"
              >
                <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  Tema {theme === 'dark' ? 'Escuro (Grafite Minimalista)' : 'Claro'}
                </span>
                <span className="text-xs text-emerald-500 font-bold">Alternar</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>

      {/* Cloud & Firebase Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-dark-700/80">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Status de Persistência e Nuvem
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conexão com Firebase Authentication e Cloud Firestore
            </p>
          </div>
        </div>

        <div className="pt-5 space-y-4">
          {isDemoMode ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Você está no Modo de Demonstração</span>
              </div>
              <p className="text-xs text-amber-600/90 dark:text-amber-400/90 leading-relaxed">
                Suas alterações estão sendo armazenadas com segurança no <strong>LocalStorage</strong> do seu navegador. Para sincronizar em múltiplos dispositivos com Firebase Authentication e Cloud Firestore, adicione suas credenciais no arquivo <code>.env</code>.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Conectado com Sucesso ao Cloud Firestore</span>
              </div>
              <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90 leading-relaxed">
                Seus dados estão protegidos por regras de segurança do Firestore (<code>firestore.rules</code>) e sincronizados em tempo real com a sua conta.
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-xs space-y-2">
            <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" />
              Como conectar seu próprio projeto Firebase:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500 dark:text-gray-400">
              <li>Crie um projeto no <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline">Console do Firebase</a>.</li>
              <li>Ative o <strong>Authentication</strong> (provedor E-mail/Senha).</li>
              <li>Crie um banco <strong>Cloud Firestore</strong> em modo de produção.</li>
              <li>Copie as credenciais da aplicação Web para o arquivo <code>.env</code> na raiz do projeto (consulte <code>.env.example</code>).</li>
              <li>Reinicie o servidor com <code>npm run dev</code>.</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-rose-500/20">
        <h3 className="font-bold text-base text-rose-500 mb-1">
          Zona de Gerenciamento de Dados
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Ações para restaurar dados de teste ou encerrar a sessão
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Restaurar Dados de Exemplo
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setIsSignOutConfirmOpen(true)}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sair da Conta
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Restaurar Dados de Demonstração?"
        message="Esta ação substituirá seus lançamentos atuais pelo conjunto padrão de dados de exemplo brasileiros (Outubro 2026)."
        confirmText="Sim, restaurar"
        variant="primary"
      />

      {/* Sign Out Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={() => signOut()}
        title="Encerrar Sessão"
        message="Tem certeza de que deseja sair da sua conta FinTrack?"
        confirmText="Sair"
        variant="danger"
      />
    </div>
  )
}
