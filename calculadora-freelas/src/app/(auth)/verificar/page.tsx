'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

export default function VerificarPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    setEmail(localStorage.getItem('bob_pending_verification') || 'sua conta')
  }, [])

  const confirmVerify = () => {
    localStorage.removeItem('bob_pending_verification')
    router.push('/onboarding')
  }

  const resendVerify = () => {
    alert(`E-mail de confirmação reenviado para ${email}.`)
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <span className="label-uppercase text-[var(--color-brand-red)]">Confirme seu e-mail</span>
        <h1 className="text-display-md text-[var(--color-text)]">Falta pouco</h1>
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Enviamos um link de confirmação para <strong className="text-[var(--color-text)]">{email}</strong>. Confirme para liberar as propostas em PDF.
      </p>

      <div className="flex items-center gap-3 p-4 bg-[var(--color-brand-yellow)]/[.12] border border-[var(--color-brand-yellow)]/30 rounded-[var(--radius-md)]">
        <Clock size={17} className="text-[var(--color-brand-yellow)] flex-shrink-0" />
        <span className="text-xs leading-relaxed text-[var(--color-text)]">
          Enquanto isso você já pode configurar seus custos — nada é perdido.
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={confirmVerify}
          className="h-[46px] px-[18px] bg-[var(--color-brand-red)] text-white text-xs font-800 tracking-wide uppercase rounded-[var(--radius-md)] hover:brightness-110 transition-[filter]"
        >
          Já confirmei · continuar
        </button>
        <button
          type="button"
          onClick={resendVerify}
          className="h-[46px] px-4 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-700 tracking-wide uppercase rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
        >
          Reenviar e-mail
        </button>
      </div>
    </div>
  )
}
