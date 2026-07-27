'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, AlertTriangle } from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}

export default function CadastroPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Informe seu nome — ele assina suas propostas.')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError('E-mail inválido. Confira o endereço digitado.')
      return
    }
    if (password.length < 6) {
      setError('Crie uma senha com pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      localStorage.setItem(
        'bob_user_session',
        JSON.stringify({ name, email, role: 'PRO', loggedAt: new Date().toISOString() })
      )
      localStorage.setItem('bob_pending_verification', email)
      router.push('/verificar')
    }, 400)
  }

  const handleGoogle = () => {
    alert('Login com Google ainda não está disponível — em estudo para uma integração gratuita. Use e-mail e senha por enquanto.')
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <span className="label-uppercase text-[var(--color-brand-red)]">Comece agora</span>
        <h1 className="text-display-md text-[var(--color-text)]">Criar conta grátis</h1>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-[var(--color-brand-red)]/10 border border-[var(--color-brand-red)]/30 rounded-[var(--radius-md)]">
          <AlertTriangle size={16} className="text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed text-[var(--color-text)]">{error}</span>
        </div>
      )}

      <form className="flex flex-col gap-[14px]" onSubmit={handleSubmit}>
        <Input
          label="Nome"
          placeholder="Como você assina seus trabalhos"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-[46px]"
          id="signup-name"
        />
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-[46px]"
          id="signup-email"
        />
        <Input
          type="password"
          label="Senha"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[46px]"
          id="signup-password"
        />

        <Button type="submit" size="lg" loading={loading} className="w-full h-12 mt-1">
          Criar conta grátis
          <ArrowRight size={17} />
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="label-uppercase">ou</span>
        <span className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2.5 h-12 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] hover:border-[var(--color-text-muted)] transition-colors"
      >
        <GoogleIcon />
        Continuar com Google
      </button>

      <p className="text-xs text-[var(--color-text-secondary)]">
        Já tem conta?{' '}
        <Link href="/login" className="text-[var(--color-brand-red)] font-600 hover:brightness-110">
          Entrar
        </Link>
      </p>
    </div>
  )
}
