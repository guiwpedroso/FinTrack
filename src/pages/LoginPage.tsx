import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Zap, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { signIn, enterDemoMode, isFirebaseAvailable } = useAuth()
  const { error: toastError, success } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!email.trim()) {
      errs.email = 'Informe seu e-mail'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'E-mail em formato inválido'
    }

    if (!password) {
      errs.password = 'Informe sua senha'
    } else if (password.length < 6) {
      errs.password = 'A senha deve ter no mínimo 6 caracteres'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await signIn(email, password)
      success('Bem-vindo de volta!', 'Autenticação realizada com sucesso.')
      navigate('/')
    } catch (err: any) {
      console.error(err)
      toastError(
        'Erro na autenticação',
        err.message || 'Verifique seu e-mail e senha e tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    enterDemoMode()
    success('Modo Demonstração Ativado', 'Você já pode explorar todas as funcionalidades do FinTrack.')
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-900 selection:bg-brand-500/20 selection:text-brand-400">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-glow-emerald mb-2">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Fin<span className="text-emerald-500">Track</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Controle financeiro pessoal inteligente e descomplicado
          </p>
        </div>

        {/* Demo Mode Instant Access Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Acesso Imediato para Portfólio</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Experimente o painel com dados realistas pré-carregados e armazenamento local.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDemoMode}
            className="w-full"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Explorar no Modo Demonstração
          </Button>
        </div>

        {/* Firebase Authentication Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-700/80">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Acessar com E-mail
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Firebase Auth</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar na Conta
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Não possui uma conta?{' '}
            <Link
              to="/register"
              className="text-emerald-500 hover:text-emerald-400 font-semibold underline underline-offset-4"
            >
              Criar conta gratuita
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
