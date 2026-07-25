import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="label-uppercase">Acesse sua conta</span>
        <h1 className="text-display-md text-[var(--color-text)]">Entrar</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Não tem conta?{' '}
          <Link
            href="/cadastro"
            className="text-[var(--color-brand-red)] hover:brightness-110 transition-all font-600"
          >
            Criar gratuitamente
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" action="#" method="POST">
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          id="login-email"
        />
        <div className="flex flex-col gap-1.5">
          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            id="login-password"
          />
          <Link
            href="/esqueci-senha"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors self-end"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2">
          Entrar
          <ArrowRight size={16} className="ml-1" />
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* OAuth — placeholder, integrar com Better Auth */}
      <Button variant="secondary" size="lg" className="w-full" disabled>
        Continuar com Google
      </Button>
    </div>
  )
}
