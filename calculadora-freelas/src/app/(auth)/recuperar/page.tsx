'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { CheckCircle2 } from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError('Informe um e-mail válido para receber o link.')
      return
    }
    setError('')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-4 bg-[var(--color-brand-green)]/[.12] border border-[var(--color-brand-green)]/30 rounded-[var(--radius-md)]">
          <CheckCircle2 size={17} className="text-[var(--color-brand-green)] flex-shrink-0" />
          <span className="text-xs leading-relaxed text-[var(--color-text)]">
            Link enviado para <strong>{email}</strong>. Ele expira em 30 minutos.
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          Não chegou? Confira a caixa de spam ou peça um novo link.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="h-11 px-4 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Reenviar link
          </button>
          <Link
            href="/login"
            className="flex items-center h-11 px-4 bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <span className="label-uppercase text-[var(--color-brand-red)]">Recuperar acesso</span>
        <h1 className="text-display-md text-[var(--color-text)]">Esqueci minha senha</h1>
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Informe o e-mail da conta. Enviamos um link de redefinição válido por 30 minutos.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error || undefined}
          className="h-[46px]"
          id="recover-email"
        />
        <Button type="submit" size="lg" className="w-full h-12">
          Enviar link de redefinição
        </Button>
        <Link href="/login" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
          Voltar para o login
        </Link>
      </form>
    </div>
  )
}
