'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simula autenticação e cria sessão no localStorage
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'bob_user_session',
          JSON.stringify({
            name: email.split('@')[0] || 'Usuário BOB',
            email: email || 'usuario@bob.os',
            role: 'PRO',
            loggedAt: new Date().toISOString(),
          })
        )
      }
      router.push('/calcular')
    }, 400)
  }

  const handleQuickDemo = () => {
    setLoading(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'bob_user_session',
        JSON.stringify({
          name: 'Robert (Demo)',
          email: 'robert@beekoff.com.br',
          role: 'PRO',
          loggedAt: new Date().toISOString(),
        })
      )
    }
    router.push('/calcular')
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="label-uppercase text-[var(--color-brand-red)]">Acesse sua conta</span>
        <h1 className="text-display-md text-[var(--color-text)] tracking-tight">Entrar</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Não tem conta?{' '}
          <Link
            href="/cadastro"
            className="text-[var(--color-brand-red)] hover:brightness-110 transition-all font-600 underline"
          >
            Criar gratuitamente
          </Link>
        </p>
      </div>

      {/* Botão de Acesso Instantâneo / Demo Mode */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center text-black text-[0.65rem] font-900">
            ⚡
          </div>
          <span className="text-xs font-700 uppercase tracking-wide text-[var(--color-text)]">
            Acesso Rápido de Teste
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Para visualizar e testar o interior do sistema imediatamente sem precisar de senha:
        </p>
        <Button
          type="button"
          variant="yellow"
          size="md"
          onClick={handleQuickDemo}
          loading={loading}
          className="w-full font-800 shadow-sm"
        >
          <Zap size={15} className="fill-current" />
          Entrar no Sistema Agora
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Ou entre com e-mail
        </span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="login-email"
        />
        <div className="flex flex-col gap-1.5">
          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="login-password"
          />
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              alert('No modo MVP, utilize o Acesso Rápido ou qualquer senha para testar o sistema.')
            }}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors self-end"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full mt-2 font-700 shadow-md">
          Entrar na Calculadora
          <ArrowRight size={16} className="ml-1" />
        </Button>
      </form>
    </div>
  )
}
