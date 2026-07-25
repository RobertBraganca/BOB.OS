import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Criar conta',
}

export default function CadastroPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="label-uppercase">Comece agora — é grátis</span>
        <h1 className="text-display-md text-[var(--color-text)]">Criar conta</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="text-[var(--color-brand-red)] hover:brightness-110 transition-all font-600"
          >
            Entrar
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" action="#" method="POST">
        <Input
          type="text"
          label="Seu nome"
          placeholder="Como você quer ser chamado?"
          autoComplete="name"
          required
          id="signup-name"
        />
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          id="signup-email"
        />
        <Input
          type="password"
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          minLength={8}
          required
          id="signup-password"
          hint="Use pelo menos 8 caracteres com letras e números"
        />

        {/* Consentimento LGPD — obrigatório por PRD seção 6 */}
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
            . Seus dados financeiros são protegidos conforme a LGPD.
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2">
          Criar conta grátis
          <ArrowRight size={16} className="ml-1" />
        </Button>
      </form>

      <p className="text-[0.65rem] text-[var(--color-text-muted)] text-center leading-relaxed">
        Sem cartão de crédito. O motor de cálculo permanece gratuito indefinidamente.
      </p>
    </div>
  )
}
