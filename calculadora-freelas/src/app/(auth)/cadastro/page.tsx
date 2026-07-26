'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Zap } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'bob_user_session',
          JSON.stringify({
            name: name || email.split('@')[0] || 'Novo Usuário',
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
        <span className="label-uppercase text-[var(--color-brand-red)]">Comece agora — é grátis</span>
        <h1 className="text-display-md text-[var(--color-text)] tracking-tight">Criar conta</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="text-[var(--color-brand-red)] hover:brightness-110 transition-all font-600 underline"
          >
            Entrar
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
          Para visualizar e usar a calculadora de imediato sem preencher formulário:
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
          Acessar Sistema Agora
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Ou preencha seus dados
        </span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSignup}>
        <Input
          type="text"
          label="Seu nome"
          placeholder="Como você quer ser chamado?"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="signup-name"
        />
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="signup-email"
        />
        <Input
          type="password"
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          minLength={4}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="signup-password"
          hint="Para teste MVP, qualquer senha é válida"
        />

        {/* Consentimento LGPD */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="consent"
            required
            className="w-3.5 h-3.5 mt-0.5 accent-[var(--color-brand-red)] flex-shrink-0 cursor-pointer"
          />
          <label htmlFor="consent" className="text-xs text-[var(--color-text-muted)] leading-relaxed cursor-pointer">
            Concordo com os{' '}
            <Link href="/termos" className="text-[var(--color-text-secondary)] hover:text-white underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-[var(--color-text-secondary)] hover:text-white underline">
              Política de Privacidade
            </Link>
            .
          </label>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full mt-2 font-700 shadow-md">
          Criar conta e Acessar
          <ArrowRight size={16} className="ml-1" />
        </Button>
      </form>

      <p className="text-[0.65rem] text-[var(--color-text-muted)] text-center leading-relaxed">
        O motor de cálculo em 3 camadas permanece gratuito indefinidamente.
      </p>
    </div>
  )
}
