import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Zap, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  const { signUp, enterDemoMode } = useAuth()
  const { error: toastError, success } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) {
      errs.name = 'Informe seu nome'
    } else if (name.trim().length < 2) {
      errs.name = 'O nome deve ter no mínimo 2 caracteres'
    }

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

    if (password !== confirmPassword) {
      errs.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await signUp(email, password, name.trim())
      success('Conta criada com sucesso!', 'Bem-vindo ao FinTrack.')
      navigate('/')
    } catch (err: any) {
      console.error(err)
      toastError(
        'Erro ao criar conta',
        err.message || 'Verifique os dados ou certifique-se de que o Firebase está configurado no .env.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    enterDemoMode()
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
            Criar Conta no Fin<span className="text-emerald-500">Track</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Comece hoje mesmo a organizar suas economias e metas financeiras
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              placeholder="Ex: Guilherme Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User className="w-4 h-4" />}
              required
            />

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
              placeholder="Pelo menos 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Criar Conta FinTrack
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400 space-y-3">
            <p>
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-emerald-500 hover:text-emerald-400 font-semibold underline underline-offset-4"
              >
                Fazer login
              </Link>
            </p>

            <div className="pt-2 border-t border-gray-100 dark:border-dark-700/80">
              <button
                type="button"
                onClick={handleDemoMode}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center justify-center gap-1.5 w-full"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ou entre diretamente no Modo Demonstração</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
